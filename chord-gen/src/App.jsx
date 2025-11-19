// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { generateProgression } from './logic/chordGenerator';
import { initAudio, playChord, stopAudio } from './audio/audioEngine';
import ChordDisplay from './components/ChordDisplay';
import Controls from './components/Controls';
import './App.css';

function App() {
  const [progression, setProgression] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(144);
  const [isDoubleSpeed, setIsDoubleSpeed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('C');

  const loopRef = useRef(null);
  const playbackIndexRef = useRef(0);
  const progressionRef = useRef([]);

  useEffect(() => {
    // Initial generation
    handleGenerate();

    return () => {
      if (loopRef.current) {
        Tone.Transport.clear(loopRef.current);
      }
      stopAudio();
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = isDoubleSpeed ? tempo * 2 : tempo;
  }, [tempo, isDoubleSpeed]);

  // Keep ref in sync with state
  useEffect(() => {
    progressionRef.current = progression;
  }, [progression]);

  const handleGenerate = () => {
    console.log('Generating with key:', selectedKey);
    const newProgression = generateProgression(selectedKey);
    setProgression(newProgression);
    progressionRef.current = newProgression; // Update ref immediately for playback

    // Auto-play logic
    playbackIndexRef.current = 0;
    setActiveIndex(0);

    if (!isPlaying) {
      handlePlay();
    }
  };

  const handleChordClick = (index) => {
    playbackIndexRef.current = index;
    setActiveIndex(index);
    if (!isPlaying) {
      handlePlay();
    }
  };

  const handlePlay = async () => {
    await initAudio();

    if (isPlaying) return;

    setIsPlaying(true);

    Tone.Transport.stop();
    Tone.Transport.cancel();

    const loopDuration = "1n";

    loopRef.current = Tone.Transport.scheduleRepeat((time) => {
      const currentProgression = progressionRef.current;
      if (currentProgression.length === 0) return;

      const currentIndex = playbackIndexRef.current % currentProgression.length;
      const chord = currentProgression[currentIndex];

      Tone.Draw.schedule(() => {
        setActiveIndex(currentIndex);
      }, time);

      playChord(chord, loopDuration, time);

      playbackIndexRef.current++;
    }, loopDuration);

    Tone.Transport.start();
  };

  const handleStop = () => {
    setIsPlaying(false);
    setActiveIndex(-1);
    Tone.Transport.stop();
    if (loopRef.current) {
      Tone.Transport.clear(loopRef.current);
    }
    stopAudio();
    playbackIndexRef.current = 0;
  };

  return (
    <div className="app-container">
      <header>
        <h1>Chord Flow</h1>
        <p>AI-Powered Stylish Chord Progressions</p>
      </header>

      <main>
        <ChordDisplay
          progression={progression}
          activeIndex={activeIndex}
          onChordClick={handleChordClick}
        />
        <Controls
          onGenerate={handleGenerate}
          onPlay={handlePlay}
          onStop={handleStop}
          isPlaying={isPlaying}
          tempo={tempo}
          setTempo={setTempo}
          isDoubleSpeed={isDoubleSpeed}
          setIsDoubleSpeed={setIsDoubleSpeed}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
        />
      </main>
    </div>
  );
}

export default App;
