import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}
  http: HttpClient = inject(HttpClient);
  apiURL: any = environment.apiUrl;

  createChat(chatObj: any): Observable<string> {
    return this.http.post(this.apiURL + 'Chat/create', chatObj, {
      responseType: 'text',
    });
  }

  getChatBetween(id1: string, id2: string): Observable<any> {
    let params = new HttpParams().set('userId1', id1).set('userId2', id2);

    return this.http.get<any>(this.apiURL + 'Chat/between', {
      params,
    });
  }
}
