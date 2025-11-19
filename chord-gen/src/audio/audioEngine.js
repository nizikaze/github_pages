// src/audio/audioEngine.js
import * as Tone from 'tone';

let synth = null;
let reverb = null;
let chorus = null;

export async function initAudio() {
    if (synth) return;

    await Tone.start();

    // Create effects for a "dreamy" / "lo-fi" sound
    reverb = new Tone.Reverb({
        decay: 4,
        wet: 0.5,
    }).toDestination();

    chorus = new Tone.Chorus({
        frequency: 2.5,
        delayTime: 3.5,
        depth: 0.7,
        wet: 0.3,
    }).connect(reverb);

    // PolySynth for chords
    synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: "fatsawtooth",
            count: 3,
            spread: 30
        },
        envelope: {
            attack: 0.05,
            decay: 0.3,
            sustain: 0.4,
            release: 1.5
        }
    }).connect(chorus);

    // Lower the volume a bit to avoid clipping with polyphony
    synth.volume.value = -10;
}

export function playChord(chord, duration = "1n", time) {
    if (!synth) return;

    const { notes, type } = chord;
    const voicedNotes = [];

    // Helper to check if we should omit 5th
    // Omit 5th if it's a complex chord (9, 11, 13) AND not a diminished/half-diminished type where 5th is altered
    const shouldOmit5th = (type.includes('9') || type.includes('11') || type.includes('13')) && !type.includes('b5') && !type.includes('dim');

    notes.forEach((note, index) => {
        // Index 0: Root
        // Index 1: 3rd
        // Index 2: 5th
        // Index 3: 7th
        // Index 4+: Tensions

        if (index === 2 && shouldOmit5th) return; // Skip 5th

        let octave = 3; // Default

        if (index === 0) {
            octave = 2; // Root deep (Lowered from 3)
        } else if (index >= 4) {
            octave = 4; // Tensions high (Lowered from 5)
        } else {
            octave = 3; // 3rd, 5th, 7th middle (Lowered from 4)
        }

        // If note already has octave, use it (safety)
        if (/\d/.test(note)) {
            voicedNotes.push(note);
        } else {
            voicedNotes.push(`${note}${octave}`);
        }
    });

    if (time) {
        synth.triggerAttackRelease(voicedNotes, duration, time);
    } else {
        synth.triggerAttackRelease(voicedNotes, duration);
    }
}

export function stopAudio() {
    if (synth) {
        synth.releaseAll();
    }
}
