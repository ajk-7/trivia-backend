import express from "express"
import questionRouter from "./questions"
import highscoreRouter from "./highscore"

const router = express.Router();
router.use("/questions", questionRouter);
router.use("/highscore", highscoreRouter);

export default router;