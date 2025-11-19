// src/logic/chordGenerator.js

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Basic intervals for chord types
const CHORD_TYPES = {
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  m7b5: [0, 3, 6, 10], // Half-diminished
  dim7: [0, 3, 6, 9],
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
  dom9: [0, 4, 7, 10, 14],
  min11: [0, 3, 7, 10, 14, 17],
  maj13: [0, 4, 7, 11, 14, 21],
  dom13: [0, 4, 7, 10, 14, 21],
  dom7b9: [0, 4, 7, 10, 13],
  dom7s9: [0, 4, 7, 10, 15], // #9 (Sharp 9)
};

// Scale degrees mapped to likely chord types for a Major key (Jazz/Neo-Soul context)
const SCALE_DEGREES = {
  0: ['maj7', 'maj9', 'maj13'], // I
  2: ['min7', 'min9', 'min11'], // II
  4: ['min7', 'min11'],         // III
  5: ['maj7', 'maj9', 'maj13'], // IV
  7: ['dom7', 'dom9', 'dom13', 'dom7b9', 'dom7s9'], // V
  9: ['min7', 'min9', 'min11'], // VI
  11: ['m7b5'],        // VII
};

// Common Jazz/Neo-Soul Progressions (by scale degree intervals)
// Can be simple numbers (diatonic) or objects { interval, forcedType }
const PROGRESSIONS = [
  // Basic
  [2, 7, 0, 0], // II-V-I-I
  [2, 7, 0, 9], // II-V-I-VI
  [0, 9, 2, 7], // I-VI-II-V
  [5, 7, 4, 9], // IV-V-III-VI
  [2, 5, 0, 9], // II-IV-I-VI (Soulful)

  // Advanced / Extended Dominants
  [
    0,
    { interval: 2, forcedType: ['dom7', 'dom9', 'dom13'] }, // II7 (Double Dominant)
    7,
    0
  ],
  [
    { interval: 4, forcedType: ['dom7', 'dom7b9'] }, // III7 (Sec. Dom to VI)
    { interval: 9, forcedType: ['dom7', 'dom7b9'] }, // VI7 (Sec. Dom to II)
    2,
    7
  ],
  [
    2,
    { interval: 1, forcedType: ['dom7', 'dom7s9'] }, // bII7 (Tritone Sub)
    0,
    0
  ],
  [
    { interval: 7, forcedType: ['min7', 'min9'] }, // Vm7 (Modulation to IV)
    { interval: 0, forcedType: ['dom7', 'dom7b9'] }, // I7 (Sec. Dom to IV)
    5, // IV
    { interval: 1, forcedType: ['dom7'] } // bII7 back to I? or just IV
  ]
];

function getNoteIndex(note) {
  return NOTES.indexOf(note);
}

function getNoteFromIndex(index) {
  return NOTES[index % 12];
}

function generateChord(rootIndex, type) {
  const intervals = CHORD_TYPES[type];
  const notes = intervals.map(interval => getNoteFromIndex(rootIndex + interval));

  return {
    root: getNoteFromIndex(rootIndex),
    type: type,
    notes: notes,
    displayName: `${getNoteFromIndex(rootIndex)}${type.replace('maj', 'Maj').replace('min', 'm').replace('dom', '').replace('s9', '#9')}`
  };
}

export function generateProgression(key = 'C') {
  const keyIndex = getNoteIndex(key);
  if (keyIndex === -1) throw new Error('Invalid key');

  // Pick a random progression pattern
  const pattern = PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];

  return pattern.map(step => {
    let degreeInterval;
    let forcedTypes = null;

    if (typeof step === 'object') {
      degreeInterval = step.interval;
      forcedTypes = step.forcedType;
    } else {
      degreeInterval = step;
    }

    const rootIndex = (keyIndex + degreeInterval) % 12;
    let type = 'maj7';

    if (forcedTypes) {
      type = forcedTypes[Math.floor(Math.random() * forcedTypes.length)];
    } else {
      // Diatonic logic
      const possibleTypes = SCALE_DEGREES[degreeInterval];
      if (possibleTypes && possibleTypes.length > 0) {
        type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
      } else {
        type = 'dom7'; // Fallback
      }
    }

    return generateChord(rootIndex, type);
  });
}
