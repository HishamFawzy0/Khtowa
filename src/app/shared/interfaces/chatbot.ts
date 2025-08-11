export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: Question[];
  createdAt: Date;
}

export type DifficultyLevel =
  | 'fundamental'
  | 'beginner'
  | 'intermediate'
  | 'advanced';

export interface QuizRequest {
  topic: string;
  difficulty: DifficultyLevel;
}

export interface AIResponse {
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }[];
}
