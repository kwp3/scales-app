import { NoteName, NOTE_NAMES } from '@/types/music';

/**
 * Get the index of a note in the chromatic scale (0-11)
 */
export function getNoteIndex(note: NoteName): number {
  return NOTE_NAMES.indexOf(note);
}

/**
 * Get a note by its chromatic index (wraps around)
 */
export function getNoteByIndex(index: number): NoteName {
  // Handle negative indices and wrap around
  const normalizedIndex = ((index % 12) + 12) % 12;
  return NOTE_NAMES[normalizedIndex];
}

/**
 * Transpose a note by a number of semitones
 */
export function transposeNote(note: NoteName, semitones: number): NoteName {
  const currentIndex = getNoteIndex(note);
  return getNoteByIndex(currentIndex + semitones);
}

/**
 * Get the interval (in semitones) between two notes
 */
export function getInterval(from: NoteName, to: NoteName): number {
  const fromIndex = getNoteIndex(from);
  const toIndex = getNoteIndex(to);
  // Always return positive interval (ascending)
  return ((toIndex - fromIndex) + 12) % 12;
}

/**
 * Get all notes in a scale given root and intervals
 */
export function getScaleNotes(root: NoteName, intervals: number[]): NoteName[] {
  return intervals.map(interval => transposeNote(root, interval));
}

/**
 * Check if a note is in a scale
 */
export function isNoteInScale(note: NoteName, root: NoteName, intervals: number[]): boolean {
  const noteInterval = getInterval(root, note);
  return intervals.includes(noteInterval);
}

/**
 * Get the interval name for a note in a scale context
 */
export function getIntervalName(semitones: number): string {
  const intervalNames: Record<number, string> = {
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
  return intervalNames[semitones % 12] || '?';
}

/**
 * Get the full interval name (for display/education)
 */
export function getFullIntervalName(semitones: number): string {
  const names: Record<number, string> = {
    0: 'Unison',
    1: 'Minor 2nd',
    2: 'Major 2nd',
    3: 'Minor 3rd',
    4: 'Major 3rd',
    5: 'Perfect 4th',
    6: 'Tritone',
    7: 'Perfect 5th',
    8: 'Minor 6th',
    9: 'Major 6th',
    10: 'Minor 7th',
    11: 'Major 7th',
    12: 'Octave',
  };
  return names[semitones] || `${semitones} semitones`;
}

/**
 * Format note name for display (with optional flat preference)
 */
export function formatNoteName(note: NoteName, preferFlats: boolean = false): string {
  if (!preferFlats) return note;

  const flatNames: Record<NoteName, string> = {
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
  return flatNames[note];
}

/**
 * Parse a note string to NoteName (handles flats)
 */
export function parseNoteName(input: string): NoteName | null {
  const normalized = input.trim().toUpperCase();

  // Direct match
  if (NOTE_NAMES.includes(normalized as NoteName)) {
    return normalized as NoteName;
  }

  // Handle flats
  const flatToSharp: Record<string, NoteName> = {
    'DB': 'C#',
    'EB': 'D#',
    'GB': 'F#',
    'AB': 'G#',
    'BB': 'A#',
  };

  if (flatToSharp[normalized]) {
    return flatToSharp[normalized];
  }

  return null;
}
