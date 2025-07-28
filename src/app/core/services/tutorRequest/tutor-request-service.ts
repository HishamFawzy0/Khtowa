import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TutorRequestService {

  constructor() { }

  http:HttpClient=inject(HttpClient);
  baseUrl:any=environment.apiUrl


  CreateTutorRequest( tutorRequest: any):Observable<any> {
    return this.http.post(this.baseUrl + 'TutorRequest', tutorRequest);
  }


  GetTutorRequests(): Observable<any> {
    return this.http.get(this.baseUrl + 'TutorRequest');
  }


}
