import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DifficultyLevel,
  Quiz,
  QuizRequest,
} from '../../shared/interfaces/chatbot';
import { QuizService } from '../../core/services/chatbot/chatbot';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {
  quiz: Quiz | null = null;
  isGenerating = signal(false);
  protected AiService = inject(QuizService);

  selectedAnswers: string[] = [];
  $qIndex: any;
  $optIndex: any;

  onNewQuiz() {
    this.quiz = null;
    this.selectedAnswers = [];
  }

  selectAnswer(questionIndex: number, option: string) {
    // Prevent changing answer once selected
    if (!this.selectedAnswers[questionIndex]) {
      this.selectedAnswers[questionIndex] = option;
    }
  }

  formData: QuizRequest = {
    topic: '' as string,
    difficulty: '' as DifficultyLevel,
  };

  onSubmit() {
    if (this.formData.topic && this.formData.difficulty) {
      this.setGenerating(true);
      this.AiService.generateQuiz(this.formData).subscribe({
        next: (quiz) => {
          this.quiz = quiz;
          this.selectedAnswers = new Array(quiz.questions.length).fill('');
          this.setGenerating(false);
        },
        error: (error) => {
          console.error('Error generating quiz:', error);
          this.setGenerating(false);
        },
      });
    }
  }

  setGenerating(generating: boolean) {
    this.isGenerating.set(generating);
  }
}
