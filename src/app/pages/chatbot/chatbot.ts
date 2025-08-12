import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  DifficultyLevel,
  Quiz,
  QuizRequest,
  Question,
} from '../../shared/interfaces/chatbot';
import { QuizService } from '../../core/services/chatbot/chatbot';

interface DifficultyOption {
  value: DifficultyLevel;
  label: string;
  description: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {
  // State Management
  quiz: Quiz | null = null;
  isGenerating = signal(false);
  selectedAnswers: string[] = [];
  startTime: number = 0;
  endTime: number = 0;

  // Services
  private aiService = inject(QuizService);

  // Form Data
  formData: QuizRequest = {
    topic: '',
    difficulty: '' as DifficultyLevel,
  };

  // Difficulty levels configuration
  difficultyLevels: DifficultyOption[] = [
    {
      value: 'fundamental' as DifficultyLevel,
      label: 'Fundamental',
      description: 'Basic concepts',
      color: 'text-green-500',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>`,
    },
    {
      value: 'beginner' as DifficultyLevel,
      label: 'Beginner',
      description: 'Entry level',
      color: 'text-blue-500',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 0l4 4m-4-4L8 8m4-4v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>`,
    },
    {
      value: 'intermediate' as DifficultyLevel,
      label: 'Intermediate',
      description: 'Moderate level',
      color: 'text-orange-500',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>`,
    },
    {
      value: 'advanced' as DifficultyLevel,
      label: 'Advanced',
      description: 'Expert level',
      color: 'text-red-500',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>`,
    },
  ];

  /**
   * Submit form and generate quiz
   */
  onSubmit(): void {
    if (this.formData.topic && this.formData.difficulty) {
      this.setGenerating(true);
      this.startTime = Date.now();

      this.aiService.generateQuiz(this.formData).subscribe({
        next: (quiz: Quiz) => {
          this.quiz = quiz;
          this.selectedAnswers = new Array(quiz.questions.length).fill('');
          this.setGenerating(false);
          this.endTime = Date.now();
          console.log('Quiz generated successfully:', quiz);
        },
        error: (error) => {
          console.error('Error generating quiz:', error);
          this.setGenerating(false);
          // TODO: Add proper error handling and user notification
        },
      });
    }
  }

  /**
   * Select an answer for a question
   */
  selectAnswer(questionIndex: number, option: string): void {
    // Prevent changing answer after selection
    if (this.selectedAnswers[questionIndex]) {
      return;
    }

    this.selectedAnswers[questionIndex] = option;

    // Mark question as answered if quiz exists
    if (this.quiz?.questions?.[questionIndex]) {
      (this.quiz.questions[questionIndex] as any).isAnswered = true;
    }
  }

  /**
   * Start a new quiz
   */
  onNewQuiz(): void {
    this.quiz = null;
    this.selectedAnswers = [];
    this.formData = {
      topic: '',
      difficulty: '' as DifficultyLevel,
    };
    this.startTime = 0;
    this.endTime = 0;
  }

  /**
   * Set generating state
   */
  private setGenerating(generating: boolean): void {
    this.isGenerating.set(generating);
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (!this.quiz) return 0;
    const answered = this.selectedAnswers.filter(
      (answer) => answer !== ''
    ).length;
    return Math.round((answered / this.quiz.questions.length) * 100);
  }

  /**
   * Get number of correct answers
   */
  getCorrectAnswers(): number {
    if (!this.quiz) return 0;
    return this.selectedAnswers.filter(
      (answer, index) => answer === this.quiz!.questions[index].correctAnswer
    ).length;
  }

  /**
   * Get number of wrong answers
   */
  getWrongAnswers(): number {
    if (!this.quiz) return 0;
    return this.selectedAnswers.filter(
      (answer, index) =>
        answer !== '' && answer !== this.quiz!.questions[index].correctAnswer
    ).length;
  }

  /**
   * Get number of unanswered questions
   */
  getUnanswered(): number {
    if (!this.quiz) return 0;
    return this.selectedAnswers.filter((answer) => answer === '').length;
  }

  /**
   * Get score percentage
   */
  getScorePercentage(): number {
    if (!this.quiz) return 0;
    return Math.round(
      (this.getCorrectAnswers() / this.quiz.questions.length) * 100
    );
  }

  /**
   * Get option letter (A, B, C, D)
   */
  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  /**
   * Get score emoji based on percentage
   */
  getScoreEmoji(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 70) return '👏';
    if (percentage >= 60) return '👍';
    if (percentage >= 50) return '😊';
    return '💪';
  }

  /**
   * Get score message based on percentage
   */
  getScoreMessage(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90)
      return "Outstanding performance! You're a master of this topic!";
    if (percentage >= 80)
      return 'Excellent work! You have a strong grasp of the material!';
    if (percentage >= 70)
      return "Great job! You're doing well with this topic!";
    if (percentage >= 60)
      return 'Good effort! Keep studying to improve further!';
    if (percentage >= 50) return "Not bad! There's room for improvement!";
    return "Keep practicing! You'll get better with more study!";
  }

  /**
   * Get quiz duration in seconds
   */
  getQuizDuration(): number {
    if (this.startTime && this.endTime) {
      return Math.round((this.endTime - this.startTime) / 1000);
    }
    return 0;
  }

  /**
   * Format time duration
   */
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
