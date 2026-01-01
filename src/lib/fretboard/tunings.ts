import { Tuning } from '@/types/fretboard';
import { NoteName } from '@/types/music';

/**
 * Common guitar tunings
 * Strings are ordered from lowest (6th) to highest (1st)
 */
export const TUNINGS: Tuning[] = [
  {
    id: 'standard',
    name: 'Standard',
    strings: ['E', 'A', 'D', 'G', 'B', 'E'] as NoteName[],
  },
  {
    id: 'drop-d',
    name: 'Drop D',
    strings: ['D', 'A', 'D', 'G', 'B', 'E'] as NoteName[],
  },
  {
    id: 'drop-c',
    name: 'Drop C',
    strings: ['C', 'G', 'C', 'F', 'A', 'D'] as NoteName[],
  },
  {
    id: 'half-step-down',
    name: 'Half Step Down (Eb)',
    strings: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'] as NoteName[],
  },
  {
    id: 'full-step-down',
    name: 'Full Step Down (D)',
    strings: ['D', 'G', 'C', 'F', 'A', 'D'] as NoteName[],
  },
  {
    id: 'dadgad',
    name: 'DADGAD',
    strings: ['D', 'A', 'D', 'G', 'A', 'D'] as NoteName[],
  },
  {
    id: 'open-g',
    name: 'Open G',
    strings: ['D', 'G', 'D', 'G', 'B', 'D'] as NoteName[],
  },
  {
    id: 'open-d',
    name: 'Open D',
    strings: ['D', 'A', 'D', 'F#', 'A', 'D'] as NoteName[],
  },
  {
    id: 'open-e',
    name: 'Open E',
    strings: ['E', 'B', 'E', 'G#', 'B', 'E'] as NoteName[],
  },
  {
    id: 'open-a',
    name: 'Open A',
    strings: ['E', 'A', 'E', 'A', 'C#', 'E'] as NoteName[],
  },
];

/**
 * Get tuning by ID
 */
export function getTuningById(id: string): Tuning | undefined {
  return TUNINGS.find(tuning => tuning.id === id);
}

/**
 * Get standard tuning
 */
export function getStandardTuning(): Tuning {
  return TUNINGS[0];
}

/**
 * Create custom tuning
 */
export function createCustomTuning(name: string, strings: NoteName[]): Tuning {
  return {
    id: `custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    strings,
  };
}
