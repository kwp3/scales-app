'use client';

import { useState, useCallback, useMemo } from 'react';
import { Fretboard } from '@/components/fretboard';
import { Header } from '@/components/layout';
import { Button, Select, SelectGroup, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { useScale, useFretboard } from '@/hooks';
import { CATEGORY_NAMES, getScaleCategories } from '@/lib/music/scales';
import { formatNoteName } from '@/lib/music/notes';
import { NOTE_NAMES, NoteName, ScaleCategory } from '@/types/music';
import { FretboardNote } from '@/types/fretboard';

type DirectionTendency = 'ascending' | 'descending' | 'mixed';
type IntervalJump = 'stepwise' | 'small' | 'any';

interface MelodySettings {
  noteCount: number;
  direction: DirectionTendency;
  intervalJump: IntervalJump;
  stayInPosition: boolean;
  positionFret: number;
}

const defaultSettings: MelodySettings = {
  noteCount: 8,
  direction: 'mixed',
  intervalJump: 'small',
  stayInPosition: false,
  positionFret: 5,
};

export default function MelodyPage() {
  const { tuning, displayOptions, availableTunings, setTuningId } = useFretboard();
  const { root, setRoot, scale, scaleId, setScaleId, notes } = useScale({ tuning });

  const [settings, setSettings] = useState<MelodySettings>(defaultSettings);
  const [melodyNotes, setMelodyNotes] = useState<FretboardNote[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const scaleCategories = getScaleCategories();
  const categoryOrder: ScaleCategory[] = ['pentatonic', 'blues', 'major', 'minor', 'mode', 'harmonic', 'melodic', 'exotic'];

  // Filter notes based on position constraint
  const availableNotesForMelody = useMemo(() => {
    if (!settings.stayInPosition) return notes;

    // Filter to notes within 4 frets of the position
    return notes.filter(
      (note) =>
        note.fret >= settings.positionFret - 1 &&
        note.fret <= settings.positionFret + 4
    );
  }, [notes, settings.stayInPosition, settings.positionFret]);

  // Generate melody
  const generateMelody = useCallback(() => {
    if (availableNotesForMelody.length === 0) return;

    const melody: FretboardNote[] = [];
    const notePool = [...availableNotesForMelody];

    // Start with a random note
    let currentIndex = Math.floor(Math.random() * notePool.length);
    let currentNote = notePool[currentIndex];

    for (let i = 0; i < settings.noteCount; i++) {
      // Add sequence number to note
      const melodyNote: FretboardNote = {
        ...currentNote,
        sequenceNumber: i + 1,
        isHighlighted: true,
      };
      melody.push(melodyNote);

      // Find next note based on settings
      let candidates: typeof notePool = [];

      if (settings.intervalJump === 'stepwise') {
        // Only adjacent notes (same string +/- 1-2 frets, or adjacent string same area)
        candidates = notePool.filter((n) => {
          const fretDiff = Math.abs(n.fret - currentNote.fret);
          const stringDiff = Math.abs(n.string - currentNote.string);
          return (fretDiff <= 2 && stringDiff <= 1) && (n !== currentNote);
        });
      } else if (settings.intervalJump === 'small') {
        // Small jumps (up to 3rd intervals)
        candidates = notePool.filter((n) => {
          const fretDiff = Math.abs(n.fret - currentNote.fret);
          const stringDiff = Math.abs(n.string - currentNote.string);
          return (fretDiff <= 4 || stringDiff <= 2) && (n !== currentNote);
        });
      } else {
        // Any jump
        candidates = notePool.filter((n) => n !== currentNote);
      }

      // Apply direction tendency
      if (settings.direction === 'ascending') {
        const ascending = candidates.filter(
          (n) => n.fret > currentNote.fret || (n.fret === currentNote.fret && n.string > currentNote.string)
        );
        if (ascending.length > 0) candidates = ascending;
      } else if (settings.direction === 'descending') {
        const descending = candidates.filter(
          (n) => n.fret < currentNote.fret || (n.fret === currentNote.fret && n.string < currentNote.string)
        );
        if (descending.length > 0) candidates = descending;
      }

      // Pick random from candidates
      if (candidates.length > 0) {
        currentNote = candidates[Math.floor(Math.random() * candidates.length)];
      } else {
        // Fallback to any note
        currentNote = notePool[Math.floor(Math.random() * notePool.length)];
      }
    }

    setMelodyNotes(melody);
    setIsGenerated(true);
  }, [availableNotesForMelody, settings]);

  const clearMelody = useCallback(() => {
    setMelodyNotes([]);
    setIsGenerated(false);
  }, []);

  // Create options
  const rootOptions = NOTE_NAMES.map((note) => ({
    value: note,
    label: formatNoteName(note),
  }));

  const tuningOptions = availableTunings.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const noteCountOptions = [4, 6, 8, 10, 12, 16].map((n) => ({
    value: n.toString(),
    label: `${n} notes`,
  }));

  const directionOptions = [
    { value: 'mixed', label: 'Mixed' },
    { value: 'ascending', label: 'Ascending' },
    { value: 'descending', label: 'Descending' },
  ];

  const jumpOptions = [
    { value: 'stepwise', label: 'Stepwise only' },
    { value: 'small', label: 'Small leaps' },
    { value: 'any', label: 'Any interval' },
  ];

  const positionOptions = [0, 3, 5, 7, 9, 12].map((fret) => ({
    value: fret.toString(),
    label: fret === 0 ? 'Open position' : `Position ${fret}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Melody Generator</h1>
          <p className="text-muted-foreground">
            Generate random melodic sequences to practice improvisation and break out of repetitive patterns
          </p>
        </div>

        {/* Scale Selection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectGroup label="Root Note">
                <Select
                  options={rootOptions}
                  value={root}
                  onChange={(e) => {
                    setRoot(e.target.value as NoteName);
                    clearMelody();
                  }}
                />
              </SelectGroup>

              <SelectGroup label="Scale">
                <select
                  value={scaleId}
                  onChange={(e) => {
                    setScaleId(e.target.value);
                    clearMelody();
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

              <SelectGroup label="Tuning">
                <Select
                  options={tuningOptions}
                  value={tuning.id}
                  onChange={(e) => {
                    setTuningId(e.target.value);
                    clearMelody();
                  }}
                />
              </SelectGroup>
            </div>
          </CardContent>
        </Card>

        {/* Melody Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Melody Settings</CardTitle>
            <CardDescription>Configure how melodies are generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SelectGroup label="Note Count">
                <Select
                  options={noteCountOptions}
                  value={settings.noteCount.toString()}
                  onChange={(e) =>
                    setSettings({ ...settings, noteCount: parseInt(e.target.value) })
                  }
                />
              </SelectGroup>

              <SelectGroup label="Direction">
                <Select
                  options={directionOptions}
                  value={settings.direction}
                  onChange={(e) =>
                    setSettings({ ...settings, direction: e.target.value as DirectionTendency })
                  }
                />
              </SelectGroup>

              <SelectGroup label="Interval Jumps">
                <Select
                  options={jumpOptions}
                  value={settings.intervalJump}
                  onChange={(e) =>
                    setSettings({ ...settings, intervalJump: e.target.value as IntervalJump })
                  }
                />
              </SelectGroup>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Position Lock</label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.stayInPosition ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setSettings({ ...settings, stayInPosition: !settings.stayInPosition })
                    }
                    className="flex-1"
                  >
                    {settings.stayInPosition ? 'Locked' : 'Free'}
                  </Button>
                  {settings.stayInPosition && (
                    <Select
                      options={positionOptions}
                      value={settings.positionFret.toString()}
                      onChange={(e) =>
                        setSettings({ ...settings, positionFret: parseInt(e.target.value) })
                      }
                      className="w-32"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={generateMelody} className="flex-1">
                Generate Melody
              </Button>
              {isGenerated && (
                <Button variant="outline" onClick={clearMelody}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fretboard */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {root} {scale?.name || 'Scale'}
              {isGenerated && ` - ${settings.noteCount} Note Melody`}
            </CardTitle>
            <CardDescription>
              {isGenerated
                ? 'Play the numbered notes in sequence. Numbers show the order.'
                : 'Click "Generate Melody" to create a practice phrase'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Fretboard
              tuning={tuning}
              startFret={0}
              endFret={15}
              notes={isGenerated ? melodyNotes : notes}
              displayOptions={{
                ...displayOptions,
                showNoteNames: true,
                showIntervals: false,
              }}
            />
          </CardContent>
        </Card>

        {/* Generated Melody Info */}
        {isGenerated && melodyNotes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Melody Sequence</CardTitle>
              <CardDescription>Notes in order - practice playing them smoothly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {melodyNotes.map((note, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-card border border-border rounded-lg px-3 py-2"
                  >
                    <span className="text-primary font-bold font-mono">{i + 1}.</span>
                    <span className={`font-mono ${note.isRoot ? 'text-primary font-bold' : 'text-foreground'}`}>
                      {note.note}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      (s{note.string + 1} f{note.fret})
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Try playing this melody at different tempos. Start slow to nail the fingering, then gradually speed up. You can also try playing it backwards or in different octaves!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
