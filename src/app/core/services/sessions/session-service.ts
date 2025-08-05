import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  createSession(tutorRequestId: number, scheduleTime: string): Observable<any> {
    const body = {
      tutorRequestId,
      scheduleTime,
    };
    return this.http.post(this.baseUrl + 'Session', body);
  }

  getSession(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'Session/' + id);
  }

  getMeetToken(userId: string, sessionId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('sessionId', sessionId.toString());

    return this.http.get(this.baseUrl + 'MeetToken/token', { params });
  }
}
