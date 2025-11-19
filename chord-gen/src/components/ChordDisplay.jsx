// src/components/ChordDisplay.jsx
import React from 'react';

const ChordDisplay = ({ progression, activeIndex, onChordClick }) => {
    if (!progression || progression.length === 0) {
        return <div className="chord-display-empty">Click Generate to start</div>;
    }

    return (
        <div className="chord-display">
            {progression.map((chord, index) => (
                <div
                    key={index}
                    className={`chord-card ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => onChordClick(index)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="chord-name">{chord.displayName}</div>
                    <div className="chord-notes">{chord.notes.join(' - ')}</div>
                </div>
            ))}
        </div>
    );
};

export default ChordDisplay;
