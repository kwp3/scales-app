import { FretboardConfig, FretboardDimensions, FretPosition, FretboardNote, FRET_MARKERS, DOUBLE_FRET_MARKERS } from '@/types/fretboard';
import { NoteName } from '@/types/music';
import { transposeNote } from '@/lib/music/notes';

/**
 * Default fretboard dimensions
 */
export const DEFAULT_DIMENSIONS: FretboardDimensions = {
  width: 1200,
  height: 200,
  nutWidth: 8,
  fretboardPadding: {
    top: 30,
    bottom: 30,
    left: 50,
    right: 20,
  },
  stringSpacing: 28,
};

/**
 * Calculate fret position using the "rule of 18" (actually 17.817)
 * This gives accurate logarithmic fret spacing like a real guitar
 */
export function calculateFretPosition(
  fret: number,
  scaleLength: number = 25.5 // inches, standard Fender scale
): number {
  if (fret === 0) return 0;
  // Distance from nut to fret
  return scaleLength - (scaleLength / Math.pow(2, fret / 12));
}

/**
 * Get all fret X positions for SVG rendering
 */
export function getFretXPositions(
  startFret: number,
  endFret: number,
  availableWidth: number
): number[] {
  const positions: number[] = [];
  const scaleLength = 25.5;

  // Calculate positions for visible frets
  const startPos = calculateFretPosition(startFret, scaleLength);
  const endPos = calculateFretPosition(endFret, scaleLength);
  const range = endPos - startPos;

  for (let fret = startFret; fret <= endFret; fret++) {
    const fretPos = calculateFretPosition(fret, scaleLength);
    const normalizedPos = (fretPos - startPos) / range;
    // Round to 2 decimal places to avoid SSR/CSR hydration mismatch
    positions.push(Math.round(normalizedPos * availableWidth * 100) / 100);
  }

  return positions;
}

/**
 * Get Y position for a string (0 = lowest, 5 = highest)
 */
export function getStringYPosition(
  stringIndex: number,
  dimensions: FretboardDimensions = DEFAULT_DIMENSIONS
): number {
  const totalStrings = 6;
  const playableHeight = dimensions.height - dimensions.fretboardPadding.top - dimensions.fretboardPadding.bottom;
  const stringSpacing = playableHeight / (totalStrings - 1);
  // Reverse so string 0 (low E) is at bottom
  return dimensions.fretboardPadding.top + ((totalStrings - 1 - stringIndex) * stringSpacing);
}

/**
 * Get note at a specific fret position
 */
export function getNoteAtPosition(
  position: FretPosition,
  tuning: NoteName[]
): NoteName {
  const openString = tuning[position.string];
  return transposeNote(openString, position.fret);
}

/**
 * Get all positions of a specific note on the fretboard
 */
export function findNotePositions(
  note: NoteName,
  tuning: NoteName[],
  startFret: number = 0,
  endFret: number = 22
): FretPosition[] {
  const positions: FretPosition[] = [];

  for (let string = 0; string < tuning.length; string++) {
    for (let fret = startFret; fret <= endFret; fret++) {
      if (getNoteAtPosition({ string, fret }, tuning) === note) {
        positions.push({ string, fret });
      }
    }
  }

  return positions;
}

/**
 * Get all scale notes on the fretboard
 */
export function getScaleNotesOnFretboard(
  root: NoteName,
  intervals: number[],
  tuning: NoteName[],
  startFret: number = 0,
  endFret: number = 22
): FretboardNote[] {
  const notes: FretboardNote[] = [];

  for (let string = 0; string < tuning.length; string++) {
    for (let fret = startFret; fret <= endFret; fret++) {
      const note = getNoteAtPosition({ string, fret }, tuning);
      const intervalFromRoot = getIntervalFromRoot(note, root);

      if (intervals.includes(intervalFromRoot)) {
        const isRoot = intervalFromRoot === 0;
        notes.push({
          string,
          fret,
          note,
          isRoot,
          intervalName: getIntervalDisplayName(intervalFromRoot),
        });
      }
    }
  }

  return notes;
}

/**
 * Get interval from root note (0-11)
 */
function getIntervalFromRoot(note: NoteName, root: NoteName): number {
  const notes: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteIndex = notes.indexOf(note);
  const rootIndex = notes.indexOf(root);
  return ((noteIndex - rootIndex) + 12) % 12;
}

/**
 * Get interval display name
 */
function getIntervalDisplayName(semitones: number): string {
  const names: Record<number, string> = {
    0: '1',
    1: 'b2',
    2: '2',
    3: 'b3',
    4: '3',
    5: '4',
    6: 'b5',
    7: '5',
    8: '#5',
    9: '6',
    10: 'b7',
    11: '7',
  };
  return names[semitones % 12] || '?';
}

/**
 * Get fret markers for display
 */
export function getFretMarkers(startFret: number, endFret: number) {
  return FRET_MARKERS
    .filter(fret => fret >= startFret && fret <= endFret)
    .map(fret => ({
      fret,
      isDouble: DOUBLE_FRET_MARKERS.includes(fret),
    }));
}

/**
 * Calculate center X position between two frets for note placement
 * Returns null if the note is outside the visible fret range
 */
export function getNoteCenterX(
  fret: number,
  fretPositions: number[],
  startFret: number,
  endFret: number,
  paddingLeft: number
): number | null {
  // Check if note is outside visible range
  if (fret < startFret || fret > endFret) {
    return null;
  }

  const fretIndex = fret - startFret;

  // Open string note when viewing from fret 0
  if (fret === 0 && startFret === 0) {
    return paddingLeft - 20;
  }

  // Validate array bounds
  if (fretIndex < 0 || fretIndex >= fretPositions.length) {
    return null;
  }

  // Center between this fret and the previous one
  const currentFretX = fretPositions[fretIndex];
  const prevFretX = fretIndex > 0 ? fretPositions[fretIndex - 1] : 0;

  // Guard against NaN
  if (typeof currentFretX !== 'number' || isNaN(currentFretX)) {
    return null;
  }

  // Round to 2 decimal places to avoid SSR/CSR hydration mismatch
  return Math.round((paddingLeft + (prevFretX + currentFretX) / 2) * 100) / 100;
}
