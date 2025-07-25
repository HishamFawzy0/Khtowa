import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  baseURL:any=environment.apiUrl;

  registerStudent(studentObj: any): Observable<any> {
    return this.http.post(`${this.baseURL}Account/student-register`, studentObj);
  }

  registerInstructor(instructorObj: any): Observable<any> {
    return this.http.post(`${this.baseURL}Account/instructor-register`, instructorObj);
  }
}
