'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseMetronomeOptions {
  initialBpm?: number;
  initialBeatsPerMeasure?: number;
}

interface UseMetronomeReturn {
  bpm: number;
  setBpm: (bpm: number) => void;
  isPlaying: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  currentBeat: number;
  beatsPerMeasure: number;
  setBeatsPerMeasure: (beats: number) => void;
}

export function useMetronome(options: UseMetronomeOptions = {}): UseMetronomeReturn {
  const { initialBpm = 80, initialBeatsPerMeasure = 4 } = options;

  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(initialBeatsPerMeasure);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextNoteTimeRef = useRef(0);

  // Initialize audio context with error handling
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        // Check for AudioContext support
        const AudioContextClass = window.AudioContext ||
          (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
          console.warn('AudioContext not supported in this browser');
          return null;
        }

        audioContextRef.current = new AudioContextClass();
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  // Play a click sound
  const playClick = useCallback((isAccent: boolean) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Higher pitch for accent (first beat)
    oscillator.frequency.value = isAccent ? 1000 : 800;
    oscillator.type = 'sine';

    // Quick envelope
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }, [getAudioContext]);

  // Scheduler function
  const scheduler = useCallback(() => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const secondsPerBeat = 60.0 / bpm;

    while (nextNoteTimeRef.current < audioContext.currentTime + 0.1) {
      setCurrentBeat((prev) => {
        const nextBeat = (prev % beatsPerMeasure) + 1;
        // Schedule the click
        playClick(nextBeat === 1);
        return nextBeat;
      });

      nextNoteTimeRef.current += secondsPerBeat;
    }
  }, [bpm, beatsPerMeasure, getAudioContext, playClick]);

  const start = useCallback(() => {
    if (isPlaying) return;

    const audioContext = getAudioContext();
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    nextNoteTimeRef.current = audioContext.currentTime;
    setCurrentBeat(0);
    setIsPlaying(true);

    intervalRef.current = setInterval(scheduler, 25);
  }, [isPlaying, getAudioContext, scheduler]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Close AudioContext to free resources
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((error) => {
          console.warn('Error closing AudioContext:', error);
        });
        audioContextRef.current = null;
      }
    };
  }, []);

  // Restart if bpm changes while playing
  useEffect(() => {
    if (isPlaying) {
      stop();
      start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  return {
    bpm,
    setBpm,
    isPlaying,
    start,
    stop,
    toggle,
    currentBeat,
    beatsPerMeasure,
    setBeatsPerMeasure,
  };
}
