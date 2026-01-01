'use client';

import { useState } from 'react';
import { Fretboard } from '@/components/fretboard';
import { Header } from '@/components/layout';
import { Button, Select, SelectGroup, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { useScale, useFretboard } from '@/hooks';
import { CATEGORY_NAMES, getScaleCategories } from '@/lib/music/scales';
import { formatNoteName } from '@/lib/music/notes';
import { NOTE_NAMES, NoteName, ScaleCategory } from '@/types/music';

export default function Home() {
  const { tuning, displayOptions, setDisplayOption, availableTunings, setTuningId } = useFretboard();
  const { root, setRoot, scale, scaleId, setScaleId, notes, availableScales } = useScale({
    tuning,
  });

  const [showIntervals, setShowIntervals] = useState(false);
  const scaleCategories = getScaleCategories();

  // Create options for root note select
  const rootOptions = NOTE_NAMES.map((note) => ({
    value: note,
    label: formatNoteName(note),
  }));

  // Create options for tuning select
  const tuningOptions = availableTunings.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  // Group scales by category
  const categoryOrder: ScaleCategory[] = ['pentatonic', 'blues', 'major', 'minor', 'mode', 'harmonic', 'melodic', 'exotic'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scale Explorer</h1>
          <p className="text-muted-foreground">
            Select a root note and scale to visualize on the fretboard
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
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

              <SelectGroup label="Tuning">
                <Select
                  options={tuningOptions}
                  value={tuning.id}
                  onChange={(e) => setTuningId(e.target.value)}
                />
              </SelectGroup>

              <div className="flex items-end gap-2">
                <Button
                  variant={showIntervals ? 'primary' : 'outline'}
                  onClick={() => {
                    setShowIntervals(!showIntervals);
                    setDisplayOption('showIntervals', !showIntervals);
                    setDisplayOption('showNoteNames', showIntervals);
                  }}
                  className="flex-1"
                >
                  {showIntervals ? 'Intervals' : 'Notes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fretboard */}
        <Card className="mb-8">
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

        {/* Scale Info */}
        {scale && (
          <Card>
            <CardHeader>
              <CardTitle>Scale Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Formula</h4>
                  <div className="flex flex-wrap gap-2">
                    {scale.intervals.map((interval, i) => {
                      const intervalNames = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'];
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-mono"
                        >
                          {intervalNames[interval]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Notes in {root} {scale.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {scale.intervals.map((interval, i) => {
                      const noteIndex = (NOTE_NAMES.indexOf(root) + interval) % 12;
                      const note = NOTE_NAMES[noteIndex];
                      const isRoot = interval === 0;
                      return (
                        <span
                          key={i}
                          className={`inline-flex items-center justify-center h-8 px-3 rounded-full text-sm font-mono ${
                            isRoot
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-chart-1 text-background'
                          }`}
                        >
                          {note}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {scale.relatedScales && scale.relatedScales.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-foreground mb-2">Related Scales</h4>
                  <div className="flex flex-wrap gap-2">
                    {scale.relatedScales.map((relatedId) => {
                      const related = availableScales.find((s) => s.id === relatedId);
                      return related ? (
                        <Button
                          key={relatedId}
                          variant="outline"
                          size="sm"
                          onClick={() => setScaleId(relatedId)}
                        >
                          {related.name}
                        </Button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
