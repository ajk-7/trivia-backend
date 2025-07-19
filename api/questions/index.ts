import express from "express"
import Question from "../../db/question";

const router = express.Router()

router.get("/", async (_req: express.Request, res: express.Response) => {
    const questions = await Question
        .aggregate()
        .sample(4)
        .exec();
    res.send({'questions': questions});
})

export default router;