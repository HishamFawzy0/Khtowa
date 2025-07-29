import { TutorRequest } from '../../../shared/interfaces/tutor-request';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationResult } from '../../../shared/interfaces/pagination';
import { IProposal } from '../../../shared/interfaces/iproposal';
import { PagingParams } from '../../../shared/interfaces/paging-params';
@Injectable({
  providedIn: 'root'
})
export class STutorRequestDetails {
  constructor() {}
 requestId: number =0;
 http: HttpClient = inject(HttpClient);
  baseUrl: any = environment.apiUrl;
getTutorRequest(id: number): Observable<TutorRequest> {
  return this.http.get<TutorRequest>(`${this.baseUrl}TutorRequest/${id}`);
}
 getProposals(jobId: number, page: number, pageSize: number): Observable<PaginationResult<IProposal>> {
  let params = new HttpParams()
    .set('PageNumber', page.toString())
    .set('PageSize', pageSize.toString());

  return this.http.get<PaginationResult<IProposal>>(
    `${this.baseUrl}Proposal/tutor-request`,
    {
      params: params.set('tutorId', jobId.toString()) 
    }
  );
}
}


