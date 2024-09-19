import { Answer } from './Answer';

interface Question {
    id: number;
    title: string;
    description: string;
    status: boolean;
    createdAt: string;
    answers: Answer[];
    answerCounts: number;
}

export type { Question };