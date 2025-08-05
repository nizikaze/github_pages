import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import type { ChordProgression, Chord } from './chordProgressions';

interface ChordCardProps {
  progression: ChordProgression;
}

const ChordCard: React.FC<ChordCardProps> = ({ progression }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChord, setCurrentChord] = useState<Chord | null>(null);
  const sampler = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    sampler.current = new Tone.Sampler({
      urls: {
        A1: 'A1.mp3',
        A2: 'A2.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/casio/',
      onload: () => {
        sampler.current?.toDestination();
      }
    }).toDestination();

    return () => {
      sampler.current?.dispose();
    };
  }, []);

  const playChordProgression = async () => {
    if (isPlaying) {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setIsPlaying(false);
      setCurrentChord(null);
      return;
    }

    await Tone.start();
    setIsPlaying(true);

    const part = new Tone.Part(
      (time, chordValue) => {
        const chord = chordValue as Chord; // 明示的にChord型にキャスト
        setCurrentChord(chord);
        const lowerOctaveNotes = chord.notes.map(note => {
          const pitch = note.slice(0, -1);
          const octave = parseInt(note.slice(-1), 10);
          return `${pitch}${octave - 1}`;
        });
        sampler.current?.triggerAttackRelease(lowerOctaveNotes, '2n', time);
      },
      progression.chords.map((chord, i) => [i * 1, chord]) // 1秒ごとにコードを再生
    ).start(0);

    part.loop = false;
    Tone.Transport.start();

    // Schedule stop at the end of the progression
    const totalDuration = progression.chords.length * 1; // Each chord is 1 second apart, and the last one plays for 1 second ('2n' at 120bpm)
    Tone.Transport.scheduleOnce(() => {
      Tone.Transport.stop();
    }, totalDuration);

    Tone.Transport.on('stop', () => {
      setIsPlaying(false);
      setCurrentChord(null);
      part.dispose();
    });
  };

  return (
    <div className="chord-card">
      <h3>{progression.name}</h3>
      <div className="chord-display">
        {progression.chords.map((chord, index) => (
          <span
            key={index}
            className={`chord ${currentChord?.name === chord.name ? 'active' : ''}`}>
            {chord.name}
          </span>
        ))}
      </div>
      <button onClick={playChordProgression} className={isPlaying ? 'playing' : ''}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

export default ChordCard;