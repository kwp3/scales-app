import { Scale, ScaleCategory } from '@/types/music';

/**
 * Comprehensive scale library
 */
export const SCALES: Scale[] = [
  // Basic Major/Minor
  {
    id: 'major',
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    category: 'major',
    description: 'The most common scale in Western music. Bright and happy sounding.',
    relatedScales: ['natural-minor', 'major-pentatonic'],
  },
  {
    id: 'natural-minor',
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    category: 'minor',
    description: 'The relative minor of major scale. Sad and melancholic.',
    relatedScales: ['major', 'minor-pentatonic', 'harmonic-minor'],
  },

  // Pentatonics
  {
    id: 'major-pentatonic',
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    category: 'pentatonic',
    description: 'Five-note scale derived from major. Great for rock, country, and blues.',
    relatedScales: ['major', 'minor-pentatonic'],
  },
  {
    id: 'minor-pentatonic',
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10],
    category: 'pentatonic',
    description: 'The most popular scale for rock and blues guitar solos.',
    relatedScales: ['natural-minor', 'blues', 'major-pentatonic'],
  },

  // Blues
  {
    id: 'blues',
    name: 'Blues Scale',
    intervals: [0, 3, 5, 6, 7, 10],
    category: 'blues',
    description: 'Minor pentatonic with added blue note (b5). Essential for blues.',
    relatedScales: ['minor-pentatonic'],
  },
  {
    id: 'major-blues',
    name: 'Major Blues',
    intervals: [0, 2, 3, 4, 7, 9],
    category: 'blues',
    description: 'Major pentatonic with chromatic passing tone between 2 and 3.',
    relatedScales: ['major-pentatonic', 'blues'],
  },

  // Modes of Major Scale
  {
    id: 'ionian',
    name: 'Ionian',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    category: 'mode',
    description: 'First mode of major scale. Same as major scale.',
  },
  {
    id: 'dorian',
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    category: 'mode',
    description: 'Second mode. Minor with raised 6th. Jazz, funk, and rock.',
  },
  {
    id: 'phrygian',
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    category: 'mode',
    description: 'Third mode. Dark, Spanish/Flamenco sound.',
  },
  {
    id: 'lydian',
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    category: 'mode',
    description: 'Fourth mode. Dreamy, floating quality with raised 4th.',
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    category: 'mode',
    description: 'Fifth mode. Dominant sound, great for blues-rock.',
  },
  {
    id: 'aeolian',
    name: 'Aeolian',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    category: 'mode',
    description: 'Sixth mode. Same as natural minor scale.',
  },
  {
    id: 'locrian',
    name: 'Locrian',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    category: 'mode',
    description: 'Seventh mode. Diminished quality, rarely used as tonal center.',
  },

  // Harmonic Minor and its modes
  {
    id: 'harmonic-minor',
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    category: 'harmonic',
    description: 'Natural minor with raised 7th. Classical and neoclassical metal.',
    relatedScales: ['natural-minor', 'phrygian-dominant'],
  },
  {
    id: 'phrygian-dominant',
    name: 'Phrygian Dominant',
    intervals: [0, 1, 4, 5, 7, 8, 10],
    category: 'harmonic',
    description: 'Fifth mode of harmonic minor. Middle Eastern, Spanish sound.',
    relatedScales: ['harmonic-minor', 'phrygian'],
  },
  {
    id: 'locrian-natural-6',
    name: 'Locrian Natural 6',
    intervals: [0, 1, 3, 5, 6, 9, 10],
    category: 'harmonic',
    description: 'Second mode of harmonic minor.',
  },
  {
    id: 'ionian-augmented',
    name: 'Ionian Augmented',
    intervals: [0, 2, 4, 5, 8, 9, 11],
    category: 'harmonic',
    description: 'Third mode of harmonic minor.',
  },
  {
    id: 'dorian-sharp-4',
    name: 'Dorian #4',
    intervals: [0, 2, 3, 6, 7, 9, 10],
    category: 'harmonic',
    description: 'Fourth mode of harmonic minor.',
  },

  // Melodic Minor and some modes
  {
    id: 'melodic-minor',
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    category: 'melodic',
    description: 'Natural minor with raised 6th and 7th. Jazz essential.',
    relatedScales: ['natural-minor', 'harmonic-minor'],
  },
  {
    id: 'lydian-dominant',
    name: 'Lydian Dominant',
    intervals: [0, 2, 4, 6, 7, 9, 10],
    category: 'melodic',
    description: 'Fourth mode of melodic minor. #4 and b7. Jazz fusion.',
    relatedScales: ['lydian', 'mixolydian'],
  },
  {
    id: 'super-locrian',
    name: 'Super Locrian (Altered)',
    intervals: [0, 1, 3, 4, 6, 8, 10],
    category: 'melodic',
    description: 'Seventh mode of melodic minor. Used over altered dominant chords.',
  },
  {
    id: 'lydian-augmented',
    name: 'Lydian Augmented',
    intervals: [0, 2, 4, 6, 8, 9, 11],
    category: 'melodic',
    description: 'Third mode of melodic minor. Lydian with #5.',
  },

  // Exotic Scales
  {
    id: 'hungarian-minor',
    name: 'Hungarian Minor',
    intervals: [0, 2, 3, 6, 7, 8, 11],
    category: 'exotic',
    description: 'Gypsy/Hungarian scale with two augmented seconds.',
  },
  {
    id: 'whole-tone',
    name: 'Whole Tone',
    intervals: [0, 2, 4, 6, 8, 10],
    category: 'exotic',
    description: 'All whole steps. Dreamlike, unresolved quality.',
  },
  {
    id: 'diminished-hw',
    name: 'Diminished (Half-Whole)',
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    category: 'exotic',
    description: 'Symmetrical scale alternating half and whole steps.',
  },
  {
    id: 'diminished-wh',
    name: 'Diminished (Whole-Half)',
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    category: 'exotic',
    description: 'Symmetrical scale alternating whole and half steps.',
  },
  {
    id: 'japanese',
    name: 'Japanese (In Sen)',
    intervals: [0, 1, 5, 7, 10],
    category: 'exotic',
    description: 'Traditional Japanese pentatonic scale.',
  },
  {
    id: 'hirajoshi',
    name: 'Hirajoshi',
    intervals: [0, 2, 3, 7, 8],
    category: 'exotic',
    description: 'Another Japanese pentatonic. Haunting, melancholic.',
  },
  {
    id: 'arabic',
    name: 'Arabic (Double Harmonic)',
    intervals: [0, 1, 4, 5, 7, 8, 11],
    category: 'exotic',
    description: 'Middle Eastern scale with two augmented seconds.',
  },
  {
    id: 'persian',
    name: 'Persian',
    intervals: [0, 1, 4, 5, 6, 8, 11],
    category: 'exotic',
    description: 'Persian/Middle Eastern scale.',
  },
  {
    id: 'byzantine',
    name: 'Byzantine',
    intervals: [0, 1, 4, 5, 7, 8, 11],
    category: 'exotic',
    description: 'Same as Double Harmonic/Arabic. Greek Orthodox music.',
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    category: 'exotic',
    description: 'All 12 notes. Every semitone.',
  },
];

/**
 * Get scale by ID
 */
export function getScaleById(id: string): Scale | undefined {
  return SCALES.find(scale => scale.id === id);
}

/**
 * Get scales by category
 */
export function getScalesByCategory(category: ScaleCategory): Scale[] {
  return SCALES.filter(scale => scale.category === category);
}

/**
 * Get all scale categories with their scales
 */
export function getScaleCategories(): Record<ScaleCategory, Scale[]> {
  return SCALES.reduce((acc, scale) => {
    if (!acc[scale.category]) {
      acc[scale.category] = [];
    }
    acc[scale.category].push(scale);
    return acc;
  }, {} as Record<ScaleCategory, Scale[]>);
}

/**
 * Category display names
 */
export const CATEGORY_NAMES: Record<ScaleCategory, string> = {
  major: 'Major Scales',
  minor: 'Minor Scales',
  pentatonic: 'Pentatonic Scales',
  blues: 'Blues Scales',
  mode: 'Modes',
  harmonic: 'Harmonic Minor Modes',
  melodic: 'Melodic Minor Modes',
  exotic: 'Exotic Scales',
};

/**
 * Search scales by name
 */
export function searchScales(query: string): Scale[] {
  const lowerQuery = query.toLowerCase();
  return SCALES.filter(scale =>
    scale.name.toLowerCase().includes(lowerQuery) ||
    scale.description?.toLowerCase().includes(lowerQuery)
  );
}
