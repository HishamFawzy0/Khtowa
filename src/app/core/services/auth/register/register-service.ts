import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  registerStudent(studentObj: any): Observable<any> {
    return this.http.post('https://localhost:7277/api/Account/student-register', studentObj);
  }

  registerInstructor(instructorObj: any): Observable<any> {
    return this.http.post('https://localhost:7277/api/Account/instructor-register', instructorObj);
  }
}
