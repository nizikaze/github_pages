export interface Chord {
  name: string;
  notes: string[];
}

export interface ChordProgression {
  name: string;
  chords: Chord[];
}

export const chordProgressions: ChordProgression[] = [
  {
    name: 'Just the Two of Us進行',
    chords: [
      { name: 'Cmaj7', notes: ['C4', 'E4', 'G4', 'B4'] },
      { name: 'B7', notes: ['B3', 'D#4', 'F#4', 'A4'] },
      { name: 'Em7', notes: ['E4', 'G4', 'B4', 'D5'] },
      { name: 'A7', notes: ['A3', 'C#4', 'E4', 'G4'] },
      { name: 'Dm7', notes: ['D4', 'F4', 'A4', 'C5'] },
      { name: 'G7', notes: ['G3', 'B3', 'D4', 'F4'] },
    ],
  },
  {
    name: '丸の内サディスティック進行',
    chords: [
        { name: 'Fmaj7', notes: ['F4', 'A4', 'C5', 'E5'] },
        { name: 'E7', notes: ['E4', 'G#4', 'B4', 'D5'] },
        { name: 'Am7', notes: ['A4', 'C5', 'E5', 'G5'] },
        { name: 'G7', notes: ['G4', 'B4', 'D5', 'F5'] },
    ],
  },
  {
    name: 'カノン進行',
    chords: [
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
      { name: 'G', notes: ['G3', 'B3', 'D4'] },
      { name: 'Am', notes: ['A3', 'C4', 'E4'] },
      { name: 'Em', notes: ['E3', 'G3', 'B3'] },
      { name: 'F', notes: ['F3', 'A3', 'C4'] },
      { name: 'C', notes: ['C3', 'E3', 'G3'] },
      { name: 'F', notes: ['F3', 'A3', 'C4'] },
      { name: 'G', notes: ['G3', 'B3', 'D4'] },
    ],
  },
  {
    name: '小室進行',
    chords: [
      { name: 'Am', notes: ['A3', 'C4', 'E4'] },
      { name: 'F', notes: ['F3', 'A3', 'C4'] },
      { name: 'G', notes: ['G3', 'B3', 'D4'] },
      { name: 'C', notes: ['C4', 'E4', 'G4'] },
    ],
  },
];