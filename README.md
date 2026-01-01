# Scales App

A guitar scale visualizer and practice tool built with Next.js, React, and TypeScript.

## Features

- **Scale Explorer** - Visualize 30+ scales on an interactive fretboard
- **Multiple Tunings** - Standard, Drop D, DADGAD, Open G, and more
- **Note/Interval Toggle** - View scale notes or interval patterns
- **Scale Categories** - Pentatonic, Blues, Modes, Harmonic, Melodic, Exotic
- **Related Scales** - Quick navigation to similar scales

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Language**: TypeScript 5

## Project Structure

```
src/
├── app/           # Next.js pages
├── components/    # React components (Fretboard, UI)
├── hooks/         # Custom hooks (useScale, useFretboard)
├── lib/           # Music theory & fretboard logic
└── types/         # TypeScript definitions
```

## Scale Library

| Category | Scales |
|----------|--------|
| Pentatonic | Major Pentatonic, Minor Pentatonic |
| Blues | Blues, Major Blues |
| Modes | Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian |
| Harmonic | Harmonic Minor, Phrygian Dominant |
| Melodic | Melodic Minor, Lydian Dominant, Super Locrian |
| Exotic | Hungarian Minor, Whole Tone, Diminished, Japanese, Arabic |

## License

MIT
