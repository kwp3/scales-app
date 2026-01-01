'use client';

import { useState, useMemo, useCallback } from 'react';
import { NoteName, NOTE_NAMES, Scale } from '@/types/music';
import { FretboardNote } from '@/types/fretboard';
import { Tuning } from '@/types/fretboard';
import { SCALES, getScaleById } from '@/lib/music/scales';
import { getScaleNotesOnFretboard } from '@/lib/fretboard/layout';
import { getStandardTuning } from '@/lib/fretboard/tunings';

interface UseScaleOptions {
  initialRoot?: NoteName;
  initialScaleId?: string;
  tuning?: Tuning;
  startFret?: number;
  endFret?: number;
}

interface UseScaleReturn {
  root: NoteName;
  setRoot: (root: NoteName) => void;
  scale: Scale | undefined;
  setScaleId: (id: string) => void;
  scaleId: string;
  notes: FretboardNote[];
  availableScales: Scale[];
  availableRoots: NoteName[];
}

export function useScale(options: UseScaleOptions = {}): UseScaleReturn {
  const {
    initialRoot = 'C',
    initialScaleId = 'minor-pentatonic',
    tuning = getStandardTuning(),
    startFret = 0,
    endFret = 15,
  } = options;

  const [root, setRoot] = useState<NoteName>(initialRoot);
  const [scaleId, setScaleId] = useState(initialScaleId);

  const scale = useMemo(() => getScaleById(scaleId), [scaleId]);

  const notes = useMemo(() => {
    if (!scale) return [];
    return getScaleNotesOnFretboard(
      root,
      scale.intervals,
      tuning.strings,
      startFret,
      endFret
    );
  }, [root, scale, tuning.strings, startFret, endFret]);

  const handleSetRoot = useCallback((newRoot: NoteName) => {
    setRoot(newRoot);
  }, []);

  const handleSetScaleId = useCallback((id: string) => {
    setScaleId(id);
  }, []);

  return {
    root,
    setRoot: handleSetRoot,
    scale,
    setScaleId: handleSetScaleId,
    scaleId,
    notes,
    availableScales: SCALES,
    availableRoots: NOTE_NAMES,
  };
}
