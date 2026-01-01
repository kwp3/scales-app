'use client';

import { useMemo } from 'react';
import { FretboardNote, FretboardDisplayOptions } from '@/types/fretboard';
import { NoteName } from '@/types/music';
import { Tuning } from '@/types/fretboard';
import {
  DEFAULT_DIMENSIONS,
  getFretXPositions,
  getStringYPosition,
  getFretMarkers,
  getNoteCenterX,
} from '@/lib/fretboard/layout';

interface FretboardProps {
  tuning: Tuning;
  startFret?: number;
  endFret?: number;
  notes?: FretboardNote[];
  displayOptions?: Partial<FretboardDisplayOptions>;
  onNoteClick?: (note: FretboardNote) => void;
  className?: string;
}

const defaultDisplayOptions: FretboardDisplayOptions = {
  showNoteNames: true,
  showIntervals: false,
  showFretNumbers: true,
  showFretMarkers: true,
  highlightRoot: true,
  noteSize: 'medium',
};

export function Fretboard({
  tuning,
  startFret = 0,
  endFret = 15,
  notes = [],
  displayOptions = {},
  onNoteClick,
  className = '',
}: FretboardProps) {
  const options = { ...defaultDisplayOptions, ...displayOptions };
  const dimensions = DEFAULT_DIMENSIONS;

  // Calculate fret positions
  const fretPositions = useMemo(() => {
    const availableWidth = dimensions.width - dimensions.fretboardPadding.left - dimensions.fretboardPadding.right;
    return getFretXPositions(startFret, endFret, availableWidth);
  }, [startFret, endFret, dimensions]);

  // Get fret markers
  const fretMarkers = useMemo(() => getFretMarkers(startFret, endFret), [startFret, endFret]);

  // Note size based on option
  const noteRadius = options.noteSize === 'small' ? 10 : options.noteSize === 'large' ? 16 : 13;

  return (
    <svg
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      className={`w-full h-auto ${className}`}
      style={{ maxHeight: '250px' }}
    >
      {/* Fretboard background */}
      <defs>
        <linearGradient id="fretboardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--fretboard-wood-light)" />
          <stop offset="100%" stopColor="var(--fretboard-wood)" />
        </linearGradient>
      </defs>

      <rect
        x={dimensions.fretboardPadding.left}
        y={dimensions.fretboardPadding.top - 5}
        width={dimensions.width - dimensions.fretboardPadding.left - dimensions.fretboardPadding.right}
        height={dimensions.height - dimensions.fretboardPadding.top - dimensions.fretboardPadding.bottom + 10}
        fill="url(#fretboardGradient)"
        rx={4}
      />

      {/* Nut (if showing from fret 0) */}
      {startFret === 0 && (
        <rect
          x={dimensions.fretboardPadding.left - 4}
          y={dimensions.fretboardPadding.top - 5}
          width={dimensions.nutWidth}
          height={dimensions.height - dimensions.fretboardPadding.top - dimensions.fretboardPadding.bottom + 10}
          fill="#d4c5a9"
          rx={2}
        />
      )}

      {/* Fret markers (dots) */}
      {options.showFretMarkers && fretMarkers.map(({ fret, isDouble }) => {
        const fretIndex = fret - startFret;

        // Validate array bounds
        if (fretIndex < 0 || fretIndex >= fretPositions.length) return null;

        const prevFretX = fretIndex > 0 ? fretPositions[fretIndex - 1] : 0;
        const currentFretX = fretPositions[fretIndex];
        const centerX = dimensions.fretboardPadding.left + (prevFretX + currentFretX) / 2;
        const centerY = dimensions.height / 2;

        if (isDouble) {
          // Double dot at 12th, 24th fret
          return (
            <g key={`marker-${fret}`}>
              <circle
                cx={centerX}
                cy={centerY - 30}
                r={6}
                fill="var(--fret-marker)"
              />
              <circle
                cx={centerX}
                cy={centerY + 30}
                r={6}
                fill="var(--fret-marker)"
              />
            </g>
          );
        }

        return (
          <circle
            key={`marker-${fret}`}
            cx={centerX}
            cy={centerY}
            r={6}
            fill="var(--fret-marker)"
          />
        );
      })}

      {/* Frets */}
      {fretPositions.map((x, i) => {
        const fretNum = startFret + i;
        if (fretNum === 0) return null; // No fret at nut position

        return (
          <line
            key={`fret-${fretNum}`}
            x1={dimensions.fretboardPadding.left + x}
            y1={dimensions.fretboardPadding.top - 5}
            x2={dimensions.fretboardPadding.left + x}
            y2={dimensions.height - dimensions.fretboardPadding.bottom + 5}
            stroke="var(--fret-color)"
            strokeWidth={3}
          />
        );
      })}

      {/* Strings */}
      {tuning.strings.map((_, stringIndex) => {
        const y = getStringYPosition(stringIndex, dimensions);
        // Thicker strings for bass, thinner for treble
        const strokeWidth = 1 + (5 - stringIndex) * 0.3;

        return (
          <line
            key={`string-${stringIndex}`}
            x1={dimensions.fretboardPadding.left - (startFret === 0 ? 4 : 0)}
            y1={y}
            x2={dimensions.width - dimensions.fretboardPadding.right}
            y2={y}
            stroke="var(--string-color)"
            strokeWidth={strokeWidth}
          />
        );
      })}

      {/* Notes */}
      {notes.map((note, index) => {
        const x = getNoteCenterX(note.fret, fretPositions, startFret, endFret, dimensions.fretboardPadding.left);

        // Skip notes outside visible range or with invalid coordinates
        if (x === null) return null;

        const y = getStringYPosition(note.string, dimensions);
        const isRoot = note.isRoot && options.highlightRoot;

        // Determine what to display on the note
        let displayText = '';
        if (options.showIntervals && note.intervalName) {
          displayText = note.intervalName;
        } else if (options.showNoteNames) {
          displayText = note.note;
        }

        return (
          <g
            key={`note-${note.string}-${note.fret}-${index}`}
            onClick={() => onNoteClick?.(note)}
            style={{ cursor: onNoteClick ? 'pointer' : 'default' }}
          >
            {/* Note circle */}
            <circle
              cx={x}
              cy={y}
              r={noteRadius}
              fill={isRoot ? 'var(--root-note)' : 'var(--scale-note)'}
              stroke={isRoot ? 'var(--primary-foreground)' : 'var(--accent-foreground)'}
              strokeWidth={2}
            />

            {/* Note label */}
            {displayText && (
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={noteRadius * 0.9}
                fontWeight="600"
                fontFamily="var(--font-mono)"
                fill={isRoot ? 'var(--primary-foreground)' : '#1c2433'}
              >
                {displayText}
              </text>
            )}

            {/* Sequence number (for melody mode) */}
            {note.sequenceNumber !== undefined && (
              <text
                x={x}
                y={y - noteRadius - 8}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fontFamily="var(--font-mono)"
                fill="var(--primary)"
              >
                {note.sequenceNumber}
              </text>
            )}
          </g>
        );
      })}

      {/* Fret numbers */}
      {options.showFretNumbers && fretPositions.map((x, i) => {
        const fretNum = startFret + i;
        if (fretNum === 0) return null;

        const prevX = i > 0 ? fretPositions[i - 1] : 0;
        const centerX = dimensions.fretboardPadding.left + (prevX + x) / 2;

        return (
          <text
            key={`fret-num-${fretNum}`}
            x={centerX}
            y={dimensions.height - 8}
            textAnchor="middle"
            fontSize={12}
            fontFamily="var(--font-mono)"
            fill="var(--muted-foreground)"
          >
            {fretNum}
          </text>
        );
      })}

      {/* String labels (tuning) */}
      {tuning.strings.map((note, stringIndex) => {
        const y = getStringYPosition(stringIndex, dimensions);

        return (
          <text
            key={`tuning-${stringIndex}`}
            x={12}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="500"
            fontFamily="var(--font-mono)"
            fill="var(--muted-foreground)"
          >
            {note}
          </text>
        );
      })}
    </svg>
  );
}
