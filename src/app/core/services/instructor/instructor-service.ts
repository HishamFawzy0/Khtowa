import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  constructor() {}

  http: HttpClient = inject(HttpClient);
  apiURL: any = environment.apiUrl;

  getInstructorByProposalID(id: number): Observable<any> {
    return this.http.get<any>(this.apiURL + 'Instructor/proposal/' + id);
  }
  
}
