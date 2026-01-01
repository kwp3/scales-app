// Note names using sharps (no flats for simplicity)
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

// All 12 notes in chromatic order
export const NOTE_NAMES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Enharmonic equivalents for display
export const ENHARMONIC_MAP: Record<NoteName, string> = {
  'C': 'C',
  'C#': 'Db',
  'D': 'D',
  'D#': 'Eb',
  'E': 'E',
  'F': 'F',
  'F#': 'Gb',
  'G': 'G',
  'G#': 'Ab',
  'A': 'A',
  'A#': 'Bb',
  'B': 'B',
};

// Scale categories for organization
export type ScaleCategory =
  | 'major'
  | 'minor'
  | 'pentatonic'
  | 'blues'
  | 'mode'
  | 'harmonic'
  | 'melodic'
  | 'exotic';

// Scale definition
export interface Scale {
  id: string;
  name: string;
  intervals: number[];  // Semitones from root (e.g., major = [0, 2, 4, 5, 7, 9, 11])
  category: ScaleCategory;
  description?: string;
  relatedScales?: string[];  // IDs of related scales
}

// Interval names for display
export interface IntervalInfo {
  semitones: number;
  name: string;
  shortName: string;
  quality: 'perfect' | 'major' | 'minor' | 'augmented' | 'diminished';
}

// A note with its position context
export interface ScaleNote {
  note: NoteName;
  interval: number;        // Semitones from root
  intervalName: string;    // e.g., "1", "b3", "5", "b7"
  degree: number;          // Scale degree (1-7 typically)
  isRoot: boolean;
}

// CAGED position shape names
export type CAGEDShape = 'C' | 'A' | 'G' | 'E' | 'D';

// Scale position/pattern
export interface ScalePosition {
  id: string;
  name: string;
  shape?: CAGEDShape;
  fretRange: {
    start: number;
    end: number;
  };
  // Pattern per string: array of fret offsets relative to root position
  pattern: number[][];  // [string][frets]
}

// Practice session stats
export interface PracticeStats {
  totalAttempts: number;
  correctAnswers: number;
  averageTime: number;  // milliseconds
  lastPracticed: Date;
}
