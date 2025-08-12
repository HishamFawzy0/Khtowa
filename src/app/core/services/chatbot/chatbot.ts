import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Quiz,
  QuizRequest,
  Question,
  DifficultyLevel,
  AIResponse,
} from '../../../shared/interfaces/chatbot';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly API_KEY =
    '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'; // Replace with your actual API key
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(private http: HttpClient) {}

  generateQuiz(request: QuizRequest): Observable<Quiz> {
    const prompt = this.createPrompt(request.topic, request.difficulty);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.API_KEY}`,
    });

    const body = {
      model: 'deepseek/deepseek-r1-0528:free',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert quiz generator. Generate exactly 10 multiple-choice questions with 4 options each. Return only valid JSON in the specified format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    return this.http.post(this.API_URL, body, { headers }).pipe(
      map((response: any) => {
        console.log('AI Response:', response);
        return this.parseAIResponse(response, request);
      }),
      catchError(this.handleError)
    );
  }

  private createPrompt(topic: string, difficulty: DifficultyLevel): string {
    return `Create a 10-question multiple choice quiz about "${topic}" at ${difficulty} level.

Requirements:
- Exactly 10 questions
- Each question has exactly 4 options (A, B, C, D)
- Include the correct answer
- Brief explanation for each answer
- Questions should be appropriate for ${difficulty} level

Return the response in this exact JSON format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A) Option 1",
      "explanation": "Brief explanation why this is correct"
    }
  ]
}`;
  }

  private parseAIResponse(response: any, request: QuizRequest): Quiz {
    try {
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const aiResponse: AIResponse = JSON.parse(jsonMatch[0]);

      const questions: Question[] = aiResponse.questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));

      return {
        id: Date.now().toString(),
        topic: request.topic,
        difficulty: request.difficulty,
        questions,
        createdAt: new Date(),
        isAnswered: false,
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('Quiz service error:', error);
    let errorMessage = 'Something went wrong generating the quiz';

    if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your configuration.';
    } else if (error.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.error?.error?.message) {
      errorMessage = error.error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
