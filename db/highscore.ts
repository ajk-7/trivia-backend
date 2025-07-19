import { Schema, model } from 'mongoose';

interface IHighscoreEntry {
    name: string,
    score: number,
}

const highscoreEntrySchema = new Schema<IHighscoreEntry>({
    name: String,
    score: Number
});

const HighscoreEntry = model<IHighscoreEntry>("HighscoreEntry", highscoreEntrySchema);
export default HighscoreEntry;