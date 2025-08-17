import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Review } from '../../../shared/interfaces/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  createReview(review: Review): Observable<any> {
    return this.http.post(`${this.baseUrl}review`, review);
  }

  getRatingsByInstructor(instructorId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/reviews/${instructorId}`);
  }
}
