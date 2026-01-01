import { NoteName } from './music';

// Guitar tuning definition
export interface Tuning {
  id: string;
  name: string;
  strings: NoteName[];  // From lowest (6th) to highest (1st) string
}

// Fretboard configuration
export interface FretboardConfig {
  tuning: Tuning;
  fretCount: number;      // Total frets (typically 22 or 24)
  startFret: number;      // First visible fret (0 = nut)
  endFret: number;        // Last visible fret
  showOpenStrings: boolean;
}

// Position of a note on the fretboard
export interface FretPosition {
  string: number;         // 0 = lowest (6th string), 5 = highest (1st string)
  fret: number;           // 0 = open, 1-24 = frets
}

// A note displayed on the fretboard
export interface FretboardNote extends FretPosition {
  note: NoteName;
  isRoot: boolean;
  intervalName?: string;  // e.g., "1", "b3", "5"
  isHighlighted?: boolean;
  sequenceNumber?: number;  // For melody display (1, 2, 3...)
}

// SVG dimensions and spacing
export interface FretboardDimensions {
  width: number;
  height: number;
  nutWidth: number;
  fretboardPadding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  stringSpacing: number;
  // Fret positions are calculated logarithmically
}

// Display options
export interface FretboardDisplayOptions {
  showNoteNames: boolean;
  showIntervals: boolean;
  showFretNumbers: boolean;
  showFretMarkers: boolean;
  highlightRoot: boolean;
  noteSize: 'small' | 'medium' | 'large';
}

// Fret marker positions (standard guitar)
export const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
export const DOUBLE_FRET_MARKERS = [12, 24];

// Standard fret marker dots configuration
export interface FretMarker {
  fret: number;
  isDouble: boolean;
}

// Click/interaction event data
export interface FretboardClickEvent {
  position: FretPosition;
  note: NoteName;
  clientX: number;
  clientY: number;
}
