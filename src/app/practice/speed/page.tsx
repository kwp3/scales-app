'use client';

import { useState, useEffect, useRef } from 'react';
import { Fretboard } from '@/components/fretboard';
import { Header } from '@/components/layout';
import { Button, Select, SelectGroup, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { useScale, useFretboard } from '@/hooks';
import { useMetronome } from '@/hooks/useMetronome';
import { CATEGORY_NAMES, getScaleCategories } from '@/lib/music/scales';
import { formatNoteName } from '@/lib/music/notes';
import { NOTE_NAMES, NoteName, ScaleCategory } from '@/types/music';

type PracticePattern = 'ascending' | 'descending' | 'alternating' | 'thirds' | 'free';

const PRACTICE_PATTERNS: { value: PracticePattern; label: string; description: string }[] = [
  { value: 'ascending', label: 'Ascending', description: 'Play scale from low to high' },
  { value: 'descending', label: 'Descending', description: 'Play scale from high to low' },
  { value: 'alternating', label: 'Up & Down', description: 'Ascending then descending' },
  { value: 'thirds', label: 'In Thirds', description: '1-3-2-4-3-5 pattern' },
  { value: 'free', label: 'Free Practice', description: 'Practice at your own pace' },
];

export default function SpeedPage() {
  const { tuning, displayOptions, availableTunings, setTuningId } = useFretboard();
  const { root, setRoot, scale, scaleId, setScaleId, notes } = useScale({ tuning });

  const {
    bpm,
    setBpm,
    isPlaying,
    toggle,
    currentBeat,
    beatsPerMeasure,
    setBeatsPerMeasure,
  } = useMetronome({ initialBpm: 60 });

  const [pattern, setPattern] = useState<PracticePattern>('ascending');
  const [autoIncrement, setAutoIncrement] = useState(false);
  const [incrementAmount, setIncrementAmount] = useState(5);
  const [barsBeforeIncrement, setBarsBeforeIncrement] = useState(4);
  const [practiceTime, setPracticeTime] = useState(0);

  const barCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastBeatRef = useRef(0);

  const scaleCategories = getScaleCategories();
  const categoryOrder: ScaleCategory[] = ['pentatonic', 'blues', 'major', 'minor', 'mode', 'harmonic', 'melodic', 'exotic'];

  // Track bar completions for auto-increment
  useEffect(() => {
    if (!isPlaying) {
      barCountRef.current = 0;
      lastBeatRef.current = 0;
      return;
    }

    // Check if we've completed a bar
    if (currentBeat === 1 && lastBeatRef.current === beatsPerMeasure) {
      barCountRef.current += 1;

      if (autoIncrement && barCountRef.current >= barsBeforeIncrement) {
        setBpm(Math.min(bpm + incrementAmount, 240));
        barCountRef.current = 0;
      }
    }

    lastBeatRef.current = currentBeat;
  }, [currentBeat, beatsPerMeasure, isPlaying, autoIncrement, barsBeforeIncrement, bpm, incrementAmount, setBpm]);

  // Practice timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPracticeTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Options
  const rootOptions = NOTE_NAMES.map((note) => ({
    value: note,
    label: formatNoteName(note),
  }));

  const tuningOptions = availableTunings.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const beatsOptions = [2, 3, 4, 6, 8].map((n) => ({
    value: n.toString(),
    label: `${n} beats`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Speed Trainer</h1>
          <p className="text-muted-foreground">
            Practice scales with a metronome to build speed and consistency
          </p>
        </div>

        {/* Scale Selection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectGroup label="Root Note">
                <Select
                  options={rootOptions}
                  value={root}
                  onChange={(e) => setRoot(e.target.value as NoteName)}
                />
              </SelectGroup>

              <SelectGroup label="Scale">
                <select
                  value={scaleId}
                  onChange={(e) => setScaleId(e.target.value)}
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

              <SelectGroup label="Practice Pattern">
                <Select
                  options={PRACTICE_PATTERNS.map((p) => ({ value: p.value, label: p.label }))}
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value as PracticePattern)}
                />
              </SelectGroup>

              <SelectGroup label="Tuning">
                <Select
                  options={tuningOptions}
                  value={tuning.id}
                  onChange={(e) => setTuningId(e.target.value)}
                />
              </SelectGroup>
            </div>
          </CardContent>
        </Card>

        {/* Metronome Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Metronome</CardTitle>
            <CardDescription>
              {PRACTICE_PATTERNS.find((p) => p.value === pattern)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* BPM Display */}
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold font-mono text-primary">{bpm}</div>
                <div className="text-sm text-muted-foreground">BPM</div>
              </div>

              {/* BPM Slider */}
              <div className="flex-1 space-y-2">
                <input
                  type="range"
                  min={40}
                  max={240}
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>40</span>
                  <span>100</span>
                  <span>160</span>
                  <span>240</span>
                </div>
              </div>

              {/* Quick BPM buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setBpm(Math.max(40, bpm - 5))}>
                  -5
                </Button>
                <Button variant="outline" size="sm" onClick={() => setBpm(Math.min(240, bpm + 5))}>
                  +5
                </Button>
              </div>

              {/* Beat Indicator */}
              <div className="flex gap-1">
                {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-colors ${
                      isPlaying && currentBeat === i + 1
                        ? i === 0
                          ? 'bg-primary'
                          : 'bg-chart-1'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Time Signature */}
              <SelectGroup label="">
                <Select
                  options={beatsOptions}
                  value={beatsPerMeasure.toString()}
                  onChange={(e) => setBeatsPerMeasure(parseInt(e.target.value))}
                  className="w-28"
                />
              </SelectGroup>

              {/* Play/Stop */}
              <Button
                onClick={toggle}
                size="lg"
                variant={isPlaying ? 'destructive' : 'primary'}
                className="w-24"
              >
                {isPlaying ? 'Stop' : 'Start'}
              </Button>
            </div>

            {/* Auto Increment */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant={autoIncrement ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setAutoIncrement(!autoIncrement)}
                >
                  {autoIncrement ? 'Auto-Increment ON' : 'Auto-Increment OFF'}
                </Button>

                {autoIncrement && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Add</span>
                      <Select
                        options={[2, 3, 5, 10].map((n) => ({ value: n.toString(), label: `${n} BPM` }))}
                        value={incrementAmount.toString()}
                        onChange={(e) => setIncrementAmount(parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">every</span>
                      <Select
                        options={[2, 4, 8, 16].map((n) => ({ value: n.toString(), label: `${n} bars` }))}
                        value={barsBeforeIncrement.toString()}
                        onChange={(e) => setBarsBeforeIncrement(parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </>
                )}

                <div className="ml-auto text-sm text-muted-foreground">
                  Practice time: <span className="font-mono text-foreground">{formatTime(practiceTime)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fretboard */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {root} {scale?.name || 'Scale'}
            </CardTitle>
            <CardDescription>
              {scale?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Fretboard
              tuning={tuning}
              startFret={0}
              endFret={15}
              notes={notes}
              displayOptions={displayOptions}
            />
          </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Start Slow</h4>
                <p className="text-sm text-muted-foreground">
                  Begin at a tempo where you can play every note cleanly and evenly.
                  Speed will come naturally with clean repetitions.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Use a Timer</h4>
                <p className="text-sm text-muted-foreground">
                  Aim for 5-10 minutes of focused practice per scale.
                  Consistency beats duration - daily practice adds up.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Vary Your Patterns</h4>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t just play up and down. Try thirds, fourths, or random sequences
                  to build real fluency in the scale.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Record Yourself</h4>
                <p className="text-sm text-muted-foreground">
                  Recording reveals timing issues you might not notice while playing.
                  Listen back and note where you rush or drag.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
