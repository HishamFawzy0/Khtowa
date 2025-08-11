import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyProposalsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  constructor() {}

 getInstructorProposals(instructorId: string, page: number, pageSize: number): Observable<any> {
  return this.http.get(
    `${this.baseUrl}Proposal/instructor?InstructorId=${instructorId}&PageNumber=${page}&PageSize=${pageSize}`
  );
}
}
