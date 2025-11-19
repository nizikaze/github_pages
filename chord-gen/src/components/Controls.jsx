// src/components/Controls.jsx
import React from 'react';

const Controls = ({ onGenerate, onPlay, onStop, isPlaying, tempo, setTempo, isDoubleSpeed, setIsDoubleSpeed, selectedKey, setSelectedKey }) => {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    return (
        <div className="controls">
            <div className="control-row">
                <div className="key-control">
                    <label>Key</label>
                    <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                        {keys.map(key => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </select>
                </div>

                <div className="tempo-control">
                    <label>BPM: {tempo} {isDoubleSpeed ? '(x2)' : ''}</label>
                    <input
                        type="range"
                        min="40"
                        max="200"
                        value={tempo}
                        onChange={(e) => setTempo(Number(e.target.value))}
                    />
                    <button
                        className={`btn-toggle ${isDoubleSpeed ? 'active' : ''}`}
                        onClick={() => setIsDoubleSpeed(!isDoubleSpeed)}
                    >
                        x2 Speed
                    </button>
                </div>
            </div>

            <div className="button-group">
                <button className="btn-primary" onClick={onGenerate}>
                    Generate
                </button>

                {!isPlaying ? (
                    <button className="btn-secondary" onClick={onPlay}>
                        Play
                    </button>
                ) : (
                    <button className="btn-secondary" onClick={onStop}>
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default Controls;
