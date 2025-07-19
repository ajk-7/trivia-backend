import express from "express"
import HighscoreEntry from "../../db/highscore";

const router = express.Router()

router.get("/", async (_req: express.Request, res: express.Response) => {
    const highscoreEntries = await HighscoreEntry
        .find()
        .sort({score: 'desc'})
        .limit(10)
        .exec()
    res.send(highscoreEntries);
})

router.put("/", async (req: express.Request, res: express.Response) => {
    const name = req.body['name'];
    const score = req.body['score'];

    // Input validation
    if (typeof name !== 'string' || name.length < 1) {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
    }

    if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > 10000000) {
        return res.status(400).json({ error: 'Score must be an integer between 0 and 10000000' });
    }

    const highscoreEntry = new HighscoreEntry({
        name: name,
        score: score
    })
    highscoreEntry.save()
    res.send({success: true})
})

export default router;