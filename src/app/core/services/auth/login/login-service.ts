import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginObj: any): Observable<any> {
    return this.http.post('https://localhost:7277/api/Account/login', loginObj);
  }
}
