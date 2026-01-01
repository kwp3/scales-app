'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { SCALES, CATEGORY_NAMES, getScaleCategories, searchScales } from '@/lib/music/scales';
import { Scale, ScaleCategory, NOTE_NAMES } from '@/types/music';
import Link from 'next/link';

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ScaleCategory | 'all'>('all');

  const scaleCategories = getScaleCategories();
  const categoryOrder: ScaleCategory[] = ['pentatonic', 'blues', 'major', 'minor', 'mode', 'harmonic', 'melodic', 'exotic'];

  // Filter scales based on search and category
  const filteredScales = useMemo(() => {
    let scales = searchQuery ? searchScales(searchQuery) : SCALES;

    if (selectedCategory !== 'all') {
      scales = scales.filter((s) => s.category === selectedCategory);
    }

    return scales;
  }, [searchQuery, selectedCategory]);

  // Group filtered scales by category
  const groupedScales = useMemo(() => {
    const groups: Partial<Record<ScaleCategory, Scale[]>> = {};

    filteredScales.forEach((scale) => {
      if (!groups[scale.category]) {
        groups[scale.category] = [];
      }
      groups[scale.category]!.push(scale);
    });

    return groups;
  }, [filteredScales]);

  // Get interval names for display
  const getIntervalDisplay = (intervals: number[]): string => {
    const names = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'];
    return intervals.map((i) => names[i]).join(' - ');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scale Library</h1>
          <p className="text-muted-foreground">
            Complete reference of all available scales with formulas and descriptions
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search scales..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All ({SCALES.length})
                </Button>
                {categoryOrder.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {CATEGORY_NAMES[category].replace(' Scales', '').replace(' Modes', '')}
                    {' '}({scaleCategories[category]?.length || 0})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredScales.length} scale{filteredScales.length !== 1 ? 's' : ''}
        </p>

        {/* Scale List */}
        {categoryOrder.map((category) => {
          const scales = groupedScales[category];
          if (!scales || scales.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {CATEGORY_NAMES[category]}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scales.map((scale) => (
                  <Card key={scale.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{scale.name}</CardTitle>
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                          {scale.intervals.length} notes
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {scale.description && (
                        <CardDescription className="mb-3">
                          {scale.description}
                        </CardDescription>
                      )}

                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Formula:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {scale.intervals.map((interval, i) => {
                              const names = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'];
                              return (
                                <span
                                  key={i}
                                  className={`text-xs px-2 py-0.5 rounded font-mono ${
                                    interval === 0
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {names[interval]}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs text-muted-foreground">Notes in C:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {scale.intervals.map((interval, i) => {
                              const note = NOTE_NAMES[interval % 12];
                              return (
                                <span
                                  key={i}
                                  className={`text-xs px-2 py-0.5 rounded font-mono ${
                                    interval === 0
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-chart-1/20 text-chart-1'
                                  }`}
                                >
                                  {note}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Link href={`/?scale=${scale.id}&root=C`}>
                            <Button variant="outline" size="sm" className="w-full">
                              View on Fretboard
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {filteredScales.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No scales found matching &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Interval Quick Reference</CardTitle>
            <CardDescription>
              Common interval patterns and their sound characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { name: '1 (Root)', desc: 'Home base, resolution' },
                { name: 'b2 (Minor 2nd)', desc: 'Tension, dissonance' },
                { name: '2 (Major 2nd)', desc: 'Whole step, passing' },
                { name: 'b3 (Minor 3rd)', desc: 'Minor quality, sad' },
                { name: '3 (Major 3rd)', desc: 'Major quality, happy' },
                { name: '4 (Perfect 4th)', desc: 'Suspended, open' },
                { name: 'b5 (Tritone)', desc: 'Tension, blues' },
                { name: '5 (Perfect 5th)', desc: 'Stable, power' },
                { name: '#5 (Aug 5th)', desc: 'Augmented, mysterious' },
                { name: '6 (Major 6th)', desc: 'Sweet, jazzy' },
                { name: 'b7 (Minor 7th)', desc: 'Dominant, bluesy' },
                { name: '7 (Major 7th)', desc: 'Jazz, sophisticated' },
              ].map((interval) => (
                <div key={interval.name} className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-mono font-semibold text-foreground">{interval.name}</div>
                  <div className="text-xs text-muted-foreground">{interval.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
