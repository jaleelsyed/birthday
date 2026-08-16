import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioEngine } from '../lib/audioEngine';

/**
 * useSound — one shared AudioEngine for the whole experience.
 * Returns play(name), the mute toggle, and started/muted state.
 */
export function useSound(music) {
  const engineRef = useRef(null);
  const [muted, setMuted] = useState(!!music?.startMuted);
  const [started, setStarted] = useState(false);

  if (!engineRef.current) engineRef.current = new AudioEngine();

  useEffect(() => {
    const engine = engineRef.current;
    return () => engine.destroy();
  }, []);

  // Kick everything off from a real user gesture.
  const start = useCallback(() => {
    const engine = engineRef.current;
    engine.start(music?.src, music?.startMuted);
    engine.resume();
    setStarted(true);
  }, [music]);

  const play = useCallback(
    (name) => {
      engineRef.current?.play(name);
    },
    []
  );

  const setIntensity = useCallback((v) => {
    engineRef.current?.setIntensity(v);
  }, []);

  // Keep this updater pure — StrictMode double-invokes updaters, so any
  // side effect in here fires twice and desyncs the state.
  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  // Keep the engine in sync with the React state (pure updater above).
  useEffect(() => {
    engineRef.current?.setMuted(muted);
  }, [muted]);

  return { start, play, setIntensity, toggleMute, muted, started };
}
