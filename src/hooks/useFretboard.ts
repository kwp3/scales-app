'use client';

import { useState, useCallback } from 'react';
import { FretboardDisplayOptions } from '@/types/fretboard';
import { Tuning } from '@/types/fretboard';
import { getStandardTuning, getTuningById, TUNINGS } from '@/lib/fretboard/tunings';

interface UseFretboardOptions {
  initialTuning?: string;
  initialStartFret?: number;
  initialEndFret?: number;
}

interface UseFretboardReturn {
  tuning: Tuning;
  setTuningId: (id: string) => void;
  startFret: number;
  setStartFret: (fret: number) => void;
  endFret: number;
  setEndFret: (fret: number) => void;
  displayOptions: FretboardDisplayOptions;
  setDisplayOption: <K extends keyof FretboardDisplayOptions>(
    key: K,
    value: FretboardDisplayOptions[K]
  ) => void;
  availableTunings: Tuning[];
}

const defaultDisplayOptions: FretboardDisplayOptions = {
  showNoteNames: true,
  showIntervals: false,
  showFretNumbers: true,
  showFretMarkers: true,
  highlightRoot: true,
  noteSize: 'medium',
};

export function useFretboard(options: UseFretboardOptions = {}): UseFretboardReturn {
  const {
    initialTuning = 'standard',
    initialStartFret = 0,
    initialEndFret = 15,
  } = options;

  const [tuningId, setTuningId] = useState(initialTuning);
  const [startFret, setStartFret] = useState(initialStartFret);
  const [endFret, setEndFret] = useState(initialEndFret);
  const [displayOptions, setDisplayOptions] = useState<FretboardDisplayOptions>(
    defaultDisplayOptions
  );

  const tuning = getTuningById(tuningId) || getStandardTuning();

  const handleSetTuningId = useCallback((id: string) => {
    setTuningId(id);
  }, []);

  const handleSetStartFret = useCallback((fret: number) => {
    setStartFret(Math.max(0, Math.min(fret, 22)));
  }, []);

  const handleSetEndFret = useCallback((fret: number) => {
    setEndFret(Math.max(1, Math.min(fret, 24)));
  }, []);

  const handleSetDisplayOption = useCallback(
    <K extends keyof FretboardDisplayOptions>(
      key: K,
      value: FretboardDisplayOptions[K]
    ) => {
      setDisplayOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    tuning,
    setTuningId: handleSetTuningId,
    startFret,
    setStartFret: handleSetStartFret,
    endFret,
    setEndFret: handleSetEndFret,
    displayOptions,
    setDisplayOption: handleSetDisplayOption,
    availableTunings: TUNINGS,
  };
}
