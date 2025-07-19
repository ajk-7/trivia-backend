import cityImport from "./cities";
import highscoreImport from "./highscore";

export default async function() {
    await highscoreImport();
    await cityImport();
}