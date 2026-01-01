'use client';

import { useState, useMemo } from 'react';
import { Fretboard } from '@/components/fretboard';
import { Header } from '@/components/layout';
import { Button, Select, SelectGroup, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { useScale, useFretboard } from '@/hooks';
import { CATEGORY_NAMES, getScaleCategories } from '@/lib/music/scales';
import { formatNoteName } from '@/lib/music/notes';
import { NOTE_NAMES, NoteName, ScaleCategory } from '@/types/music';
import { FretboardNote } from '@/types/fretboard';

// CAGED position definitions (fret ranges for each position)
const CAGED_POSITIONS = [
  { name: 'Position 1 (E Shape)', startFret: 0, endFret: 4 },
  { name: 'Position 2 (D Shape)', startFret: 2, endFret: 6 },
  { name: 'Position 3 (C Shape)', startFret: 4, endFret: 8 },
  { name: 'Position 4 (A Shape)', startFret: 7, endFret: 11 },
  { name: 'Position 5 (G Shape)', startFret: 9, endFret: 13 },
];

export default function PatternsPage() {
  const { tuning, displayOptions, setDisplayOption, availableTunings, setTuningId } = useFretboard();
  const { root, setRoot, scale, scaleId, setScaleId, notes } = useScale({
    tuning,
    startFret: 0,
    endFret: 17,
  });

  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [showAllPositions, setShowAllPositions] = useState(true);
  const [showIntervals, setShowIntervals] = useState(false);

  const scaleCategories = getScaleCategories();
  const categoryOrder: ScaleCategory[] = ['pentatonic', 'blues', 'major', 'minor', 'mode', 'harmonic', 'melodic', 'exotic'];

  // Filter notes based on selected position
  const displayedNotes = useMemo((): FretboardNote[] => {
    if (showAllPositions || selectedPosition === null) {
      return notes;
    }

    const position = CAGED_POSITIONS[selectedPosition];
    return notes.filter(
      (note) => note.fret >= position.startFret && note.fret <= position.endFret
    );
  }, [notes, selectedPosition, showAllPositions]);

  // Calculate fretboard range based on view
  const { startFret, endFret } = useMemo(() => {
    if (showAllPositions || selectedPosition === null) {
      return { startFret: 0, endFret: 15 };
    }
    const position = CAGED_POSITIONS[selectedPosition];
    return {
      startFret: Math.max(0, position.startFret - 1),
      endFret: Math.min(17, position.endFret + 1),
    };
  }, [selectedPosition, showAllPositions]);

  // Create options
  const rootOptions = NOTE_NAMES.map((note) => ({
    value: note,
    label: formatNoteName(note),
  }));

  const tuningOptions = availableTunings.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const positionOptions = CAGED_POSITIONS.map((pos, i) => ({
    value: i.toString(),
    label: pos.name,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pattern Visualization</h1>
          <p className="text-muted-foreground">
            Explore scale patterns in different positions across the fretboard
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

        {/* Position Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Position Selection</CardTitle>
            <CardDescription>
              View scales in specific positions or see all positions at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={showAllPositions ? 'primary' : 'outline'}
                onClick={() => {
                  setShowAllPositions(true);
                  setSelectedPosition(null);
                }}
              >
                All Positions
              </Button>
              {CAGED_POSITIONS.map((pos, i) => (
                <Button
                  key={i}
                  variant={!showAllPositions && selectedPosition === i ? 'primary' : 'outline'}
                  onClick={() => {
                    setShowAllPositions(false);
                    setSelectedPosition(i);
                  }}
                >
                  {pos.name.split(' ')[0]} {pos.name.split(' ')[1]}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant={showIntervals ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  setShowIntervals(!showIntervals);
                  setDisplayOption('showIntervals', !showIntervals);
                  setDisplayOption('showNoteNames', showIntervals);
                }}
              >
                {showIntervals ? 'Showing Intervals' : 'Showing Notes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fretboard */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {root} {scale?.name || 'Scale'}
              {!showAllPositions && selectedPosition !== null && (
                <span className="text-muted-foreground font-normal text-base ml-2">
                  - {CAGED_POSITIONS[selectedPosition].name}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {showAllPositions
                ? 'All positions shown - notice how they connect across the fretboard'
                : `Frets ${CAGED_POSITIONS[selectedPosition!]?.startFret} to ${CAGED_POSITIONS[selectedPosition!]?.endFret}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Fretboard
              tuning={tuning}
              startFret={startFret}
              endFret={endFret}
              notes={displayedNotes}
              displayOptions={{
                ...displayOptions,
                showIntervals,
                showNoteNames: !showIntervals,
              }}
            />
          </CardContent>
        </Card>

        {/* Position Info */}
        <Card>
          <CardHeader>
            <CardTitle>About CAGED Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The CAGED system divides the fretboard into 5 overlapping positions based on open chord shapes.
              Learning scales in all 5 positions allows you to play anywhere on the neck and connect patterns smoothly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {CAGED_POSITIONS.map((pos, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${
                    !showAllPositions && selectedPosition === i
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card'
                  }`}
                >
                  <h4 className="font-semibold text-foreground">{pos.name.split('(')[1]?.replace(')', '')}</h4>
                  <p className="text-sm text-muted-foreground">
                    Frets {pos.startFret}-{pos.endFret}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Practice tip:</strong> Start by learning one position thoroughly, then move to adjacent positions.
                Pay attention to where the root notes are - they&apos;re your anchor points for navigating the fretboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
