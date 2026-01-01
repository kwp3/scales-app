'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Fretboard } from '@/components/fretboard';
import { Header } from '@/components/layout';
import { Button, Select, SelectGroup, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { useScale, useFretboard } from '@/hooks';
import { CATEGORY_NAMES, getScaleCategories } from '@/lib/music/scales';
import { formatNoteName, getFullIntervalName } from '@/lib/music/notes';
import { NOTE_NAMES, NoteName, ScaleCategory } from '@/types/music';
import { FretboardNote } from '@/types/fretboard';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface QuizState {
  rootNote: FretboardNote | null;
  targetNote: FretboardNote | null;
  correctInterval: number;
  userAnswer: number | null;
  isCorrect: boolean | null;
  showAnswer: boolean;
}

const DIFFICULTY_INTERVALS: Record<Difficulty, number[]> = {
  beginner: [0, 3, 4, 5, 7],      // Unison, m3, M3, P4, P5
  intermediate: [0, 2, 3, 4, 5, 7, 9, 10], // Add M2, M6, m7
  advanced: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // All intervals
};

const INTERVAL_BUTTONS = [
  { semitones: 0, label: '1' },
  { semitones: 1, label: 'b2' },
  { semitones: 2, label: '2' },
  { semitones: 3, label: 'b3' },
  { semitones: 4, label: '3' },
  { semitones: 5, label: '4' },
  { semitones: 6, label: 'b5' },
  { semitones: 7, label: '5' },
  { semitones: 8, label: '#5' },
  { semitones: 9, label: '6' },
  { semitones: 10, label: 'b7' },
  { semitones: 11, label: '7' },
];

const VISIBLE_START_FRET = 0;
const VISIBLE_END_FRET = 12;

// Calculate interval between two notes (pure function, outside component for performance)
function getIntervalBetweenNotes(note1: FretboardNote, note2: FretboardNote): number | null {
  const noteOrder = NOTE_NAMES;
  const index1 = noteOrder.indexOf(note1.note);
  const index2 = noteOrder.indexOf(note2.note);

  if (index1 === -1 || index2 === -1) return null;

  return ((index2 - index1) + 12) % 12;
}

export default function IntervalsPage() {
  const { tuning, displayOptions, availableTunings, setTuningId } = useFretboard();
  const { root, setRoot, scale, scaleId, setScaleId, notes } = useScale({ tuning });

  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [quiz, setQuiz] = useState<QuizState>({
    rootNote: null,
    targetNote: null,
    correctInterval: 0,
    userAnswer: null,
    isCorrect: null,
    showAnswer: false,
  });

  const scaleCategories = getScaleCategories();
  const categoryOrder: ScaleCategory[] = ['pentatonic', 'blues', 'major', 'minor', 'mode', 'harmonic', 'melodic', 'exotic'];

  const availableIntervals = DIFFICULTY_INTERVALS[difficulty];

  // Filter notes to only those visible on the fretboard
  const visibleNotes = useMemo(() => {
    return notes.filter(note => note.fret >= VISIBLE_START_FRET && note.fret <= VISIBLE_END_FRET);
  }, [notes]);

  // Generate a new question
  const generateQuestion = useCallback(() => {
    if (visibleNotes.length < 2) return;

    // Pick a random root note from visible scale notes
    const rootIndex = Math.floor(Math.random() * visibleNotes.length);
    const rootNote = visibleNotes[rootIndex];

    // Filter visible notes that create an interval we're testing
    const validTargets = visibleNotes.filter((note) => {
      const interval = getIntervalBetweenNotes(rootNote, note);
      return interval !== null && availableIntervals.includes(interval) && note !== rootNote;
    });

    if (validTargets.length === 0) {
      // Fallback: just pick any other visible note
      const otherNotes = visibleNotes.filter((n) => n !== rootNote);
      if (otherNotes.length === 0) return;

      const targetNote = otherNotes[Math.floor(Math.random() * otherNotes.length)];
      const interval = getIntervalBetweenNotes(rootNote, targetNote) || 0;

      setQuiz({
        rootNote,
        targetNote,
        correctInterval: interval,
        userAnswer: null,
        isCorrect: null,
        showAnswer: false,
      });
      return;
    }

    const targetNote = validTargets[Math.floor(Math.random() * validTargets.length)];
    const correctInterval = getIntervalBetweenNotes(rootNote, targetNote) || 0;

    setQuiz({
      rootNote,
      targetNote,
      correctInterval,
      userAnswer: null,
      isCorrect: null,
      showAnswer: false,
    });
  }, [visibleNotes, availableIntervals]);

  // Handle answer submission
  const handleAnswer = useCallback((interval: number) => {
    if (quiz.showAnswer || quiz.isCorrect !== null) return;

    const isCorrect = interval === quiz.correctInterval;

    setQuiz((prev) => ({
      ...prev,
      userAnswer: interval,
      isCorrect,
      showAnswer: true,
    }));

    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  }, [quiz.correctInterval, quiz.showAnswer, quiz.isCorrect]);

  // Create display notes for fretboard
  const displayNotes = useMemo((): FretboardNote[] => {
    if (!quiz.rootNote || !quiz.targetNote) return visibleNotes;

    return [
      { ...quiz.rootNote, isRoot: true, isHighlighted: true },
      {
        ...quiz.targetNote,
        isRoot: false,
        isHighlighted: true,
        intervalName: quiz.showAnswer ? INTERVAL_BUTTONS.find(b => b.semitones === quiz.correctInterval)?.label : '?',
      },
    ];
  }, [quiz, visibleNotes]);

  // Initialize first question
  useEffect(() => {
    if (visibleNotes.length > 0 && !quiz.rootNote) {
      generateQuestion();
    }
  }, [visibleNotes, quiz.rootNote, generateQuestion]);

  // Options
  const rootOptions = NOTE_NAMES.map((note) => ({
    value: note,
    label: formatNoteName(note),
  }));

  const tuningOptions = availableTunings.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner (5 intervals)' },
    { value: 'intermediate', label: 'Intermediate (8 intervals)' },
    { value: 'advanced', label: 'Advanced (all 12)' },
  ];

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interval Training</h1>
          <p className="text-muted-foreground">
            Learn to identify intervals by looking at note positions on the fretboard
          </p>
        </div>

        {/* Settings */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectGroup label="Root Note">
                <Select
                  options={rootOptions}
                  value={root}
                  onChange={(e) => {
                    setRoot(e.target.value as NoteName);
                    generateQuestion();
                  }}
                />
              </SelectGroup>

              <SelectGroup label="Scale">
                <select
                  value={scaleId}
                  onChange={(e) => {
                    setScaleId(e.target.value);
                    generateQuestion();
                  }}
                  className="h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categoryOrder.map((category) => (
                    <optgroup key={category} label={CATEGORY_NAMES[category]}>
                      {scaleCategories[category]?.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </SelectGroup>

              <SelectGroup label="Difficulty">
                <Select
                  options={difficultyOptions}
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value as Difficulty);
                    setStats({ correct: 0, total: 0 });
                    generateQuestion();
                  }}
                />
              </SelectGroup>

              <SelectGroup label="Tuning">
                <Select
                  options={tuningOptions}
                  value={tuning.id}
                  onChange={(e) => {
                    setTuningId(e.target.value);
                    generateQuestion();
                  }}
                />
              </SelectGroup>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-primary">{stats.correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-chart-1">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Fretboard */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What interval is this?</CardTitle>
            <CardDescription>
              Orange note = root, Blue note = target. Identify the interval from root to target.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Fretboard
              tuning={tuning}
              startFret={VISIBLE_START_FRET}
              endFret={VISIBLE_END_FRET}
              notes={displayNotes}
              displayOptions={{
                ...displayOptions,
                showNoteNames: true,
                showIntervals: quiz.showAnswer,
              }}
            />
          </CardContent>
        </Card>

        {/* Answer Buttons */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select the interval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
              {INTERVAL_BUTTONS
                .filter((btn) => availableIntervals.includes(btn.semitones))
                .map((btn) => {
                  const isCorrect = quiz.showAnswer && btn.semitones === quiz.correctInterval;
                  const isWrong = quiz.showAnswer && btn.semitones === quiz.userAnswer && !quiz.isCorrect;

                  return (
                    <Button
                      key={btn.semitones}
                      variant={isCorrect ? 'primary' : isWrong ? 'destructive' : 'outline'}
                      onClick={() => handleAnswer(btn.semitones)}
                      disabled={quiz.showAnswer}
                      className="h-12 text-lg font-mono"
                    >
                      {btn.label}
                    </Button>
                  );
                })}
            </div>

            {quiz.showAnswer && (
              <div className={`p-4 rounded-lg ${quiz.isCorrect ? 'bg-green-500/20' : 'bg-destructive/20'}`}>
                <p className="font-semibold">
                  {quiz.isCorrect ? 'Correct!' : 'Not quite...'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  The interval is{' '}
                  <span className="font-mono font-bold text-foreground">
                    {INTERVAL_BUTTONS.find(b => b.semitones === quiz.correctInterval)?.label}
                  </span>{' '}
                  ({getFullIntervalName(quiz.correctInterval)})
                </p>
                <Button onClick={generateQuestion} className="mt-4">
                  Next Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interval Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Interval Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {INTERVAL_BUTTONS.map((btn) => (
                <div
                  key={btn.semitones}
                  className={`p-2 rounded border ${
                    availableIntervals.includes(btn.semitones)
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/50 opacity-50'
                  }`}
                >
                  <span className="font-mono font-bold">{btn.label}</span>
                  <span className="text-muted-foreground ml-2">{getFullIntervalName(btn.semitones)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
