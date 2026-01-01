import { IntervalInfo } from '@/types/music';

/**
 * Complete interval definitions
 */
export const INTERVALS: IntervalInfo[] = [
  { semitones: 0, name: 'Perfect Unison', shortName: '1', quality: 'perfect' },
  { semitones: 1, name: 'Minor Second', shortName: 'b2', quality: 'minor' },
  { semitones: 2, name: 'Major Second', shortName: '2', quality: 'major' },
  { semitones: 3, name: 'Minor Third', shortName: 'b3', quality: 'minor' },
  { semitones: 4, name: 'Major Third', shortName: '3', quality: 'major' },
  { semitones: 5, name: 'Perfect Fourth', shortName: '4', quality: 'perfect' },
  { semitones: 6, name: 'Tritone', shortName: 'b5', quality: 'diminished' },
  { semitones: 7, name: 'Perfect Fifth', shortName: '5', quality: 'perfect' },
  { semitones: 8, name: 'Minor Sixth', shortName: 'b6', quality: 'minor' },
  { semitones: 9, name: 'Major Sixth', shortName: '6', quality: 'major' },
  { semitones: 10, name: 'Minor Seventh', shortName: 'b7', quality: 'minor' },
  { semitones: 11, name: 'Major Seventh', shortName: '7', quality: 'major' },
  { semitones: 12, name: 'Perfect Octave', shortName: '8', quality: 'perfect' },
];

/**
 * Get interval info by semitones
 */
export function getIntervalInfo(semitones: number): IntervalInfo | undefined {
  return INTERVALS.find(i => i.semitones === semitones % 12) ||
         (semitones === 12 ? INTERVALS[12] : undefined);
}

/**
 * Get interval by short name
 */
export function getIntervalBySemitones(semitones: number): IntervalInfo {
  const normalized = semitones % 12;
  return INTERVALS[normalized] || INTERVALS[0];
}

/**
 * Calculate compound interval name (for intervals > octave)
 */
export function getCompoundIntervalName(semitones: number): string {
  if (semitones <= 12) {
    return INTERVALS[semitones]?.name || 'Unknown';
  }

  const octaves = Math.floor(semitones / 12);
  const remainder = semitones % 12;
  const baseInterval = INTERVALS[remainder];

  if (!baseInterval) return 'Unknown';

  // Compound interval naming (9th, 11th, 13th, etc.)
  const compoundNames: Record<number, string> = {
    2: 'Ninth',
    4: 'Tenth',
    5: 'Eleventh',
    7: 'Twelfth',
    9: 'Thirteenth',
  };

  if (octaves === 1 && compoundNames[remainder]) {
    const quality = baseInterval.quality === 'minor' ? 'Minor' :
                   baseInterval.quality === 'major' ? 'Major' :
                   baseInterval.quality === 'perfect' ? 'Perfect' : '';
    return `${quality} ${compoundNames[remainder]}`;
  }

  return `${octaves} octave(s) + ${baseInterval.name}`;
}

/**
 * Common interval patterns for ear training
 */
export const INTERVAL_PATTERNS = {
  beginner: [0, 3, 4, 5, 7],           // Unison, m3, M3, P4, P5
  intermediate: [0, 2, 3, 4, 5, 7, 9], // Add M2, M6
  advanced: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // All intervals
};

/**
 * Get intervals used in common chord types
 */
export const CHORD_INTERVALS: Record<string, number[]> = {
  'major': [0, 4, 7],
  'minor': [0, 3, 7],
  'diminished': [0, 3, 6],
  'augmented': [0, 4, 8],
  'major7': [0, 4, 7, 11],
  'minor7': [0, 3, 7, 10],
  'dominant7': [0, 4, 7, 10],
  'diminished7': [0, 3, 6, 9],
  'half-diminished7': [0, 3, 6, 10],
  'sus2': [0, 2, 7],
  'sus4': [0, 5, 7],
};
