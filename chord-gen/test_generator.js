import { generateProgression } from './src/logic/chordGenerator.js';

try {
    console.log("Generating for Key: C");
    const progC = generateProgression('C');
    console.log(progC.map(c => c.displayName).join(' - '));

    console.log("\nGenerating for Key: F#");
    const progFSharp = generateProgression('F#');
    console.log(progFSharp.map(c => c.displayName).join(' - '));

    if (progFSharp[0].displayName.includes('F#') || progFSharp[0].displayName.includes('G#') || progFSharp[0].displayName.includes('C#')) {
        console.log("\nSUCCESS: F# key seems to be working.");
    } else {
        console.log("\nFAILURE: F# key produced unexpected chords.");
    }

} catch (e) {
    console.error(e);
}
