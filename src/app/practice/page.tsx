'use client';

import Link from 'next/link';
import { Header } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

const practiceModesData = [
  {
    href: '/practice/patterns',
    title: 'Pattern Visualization',
    description: 'Explore scale patterns across the fretboard in different positions (CAGED system)',
    icon: '🎸',
  },
  {
    href: '/practice/intervals',
    title: 'Interval Training',
    description: 'Learn to identify intervals within scales to improve your ear and theory knowledge',
    icon: '🎵',
  },
  {
    href: '/practice/speed',
    title: 'Speed Trainer',
    description: 'Practice scales with a metronome and gradually increase your tempo',
    icon: '⏱️',
  },
  {
    href: '/practice/melody',
    title: 'Melody Generator',
    description: 'Generate random melodic sequences using scale notes to practice improvisation',
    icon: '🎼',
  },
];

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Practice Modes</h1>
          <p className="text-muted-foreground">
            Choose a practice mode to improve your scale knowledge and playing ability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practiceModesData.map((mode) => (
            <Link key={mode.href} href={mode.href}>
              <Card className="h-full transition-colors hover:border-primary cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mode.icon}</span>
                    <div>
                      <CardTitle>{mode.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {mode.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Effective Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Start slow - accuracy before speed. Use the metronome to build clean technique.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Learn patterns in all positions. Don&apos;t get stuck in the &quot;box&quot; - connect the dots across the fretboard.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Practice with your ears, not just your eyes. Learn to hear the intervals and scale degrees.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>Use the melody generator to break out of repetitive patterns and develop musical phrasing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">5.</span>
                <span>Consistency beats intensity. Short daily sessions are better than long occasional ones.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
