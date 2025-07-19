import { Schema, model } from 'mongoose';

interface IQuestion {
    title: string,
    icon: string,
    type: string,
    correctAnswer: string,
    incorrectAnswers: string[]
}

const questionSchema = new Schema<IQuestion>({
    title: String,
    icon: String,
    type: String,
    correctAnswer: String,
    incorrectAnswers: [String]
});

const Question = model<IQuestion>("Question", questionSchema);

export default Question;