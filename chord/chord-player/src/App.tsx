import React from 'react';
import ChordCard from './ChordCard';
import { chordProgressions } from './chordProgressions';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chord Progression Player</h1>
      </header>
      <main>
        {chordProgressions.map((progression, index) => (
          <ChordCard key={index} progression={progression} />
        ))}
      </main>
    </div>
  );
};

export default App;