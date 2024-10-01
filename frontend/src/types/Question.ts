import Answer from './Answer';

export default interface Question {
    id: number;
    title: string;
    description: string;
    status: boolean;
    createdAt: string;
    answers: Answer[];
    answerCounts: number;
}