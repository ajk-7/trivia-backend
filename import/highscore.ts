import HighscoreEntry from "../db/highscore";

export default async function() {
    // await HighscoreEntry.collection.drop();
    const countDocuments = await HighscoreEntry.countDocuments()
    if (countDocuments === 0) {
        console.log(`No highscore entries found in DB... importing initial highscore entries...`);

        const entries = [
            new HighscoreEntry({
                name: 'Alex Parker',
                score: 10
            }),
            new HighscoreEntry({
                name: 'Taylor Morgan',
                score: 15
            }),
            new HighscoreEntry({
                name: 'Jamie Ellis',
                score: 20
            }),
            new HighscoreEntry({
                name: 'Sage Collins',
                score: 25
            }),
        ]
        await HighscoreEntry.collection.insertMany(entries);
    }

}