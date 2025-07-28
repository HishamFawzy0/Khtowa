import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginationResult } from '../../../shared/interfaces/pagination';
import { TutorRequest } from '../../../shared/interfaces/tutor-request';
import { PagingParams } from '../../../shared/interfaces/paging-params';

@Injectable({
  providedIn: 'root',
})
export class TutorRequestService {
  constructor() {}

  http: HttpClient = inject(HttpClient);
  baseUrl: any = environment.apiUrl;

  CreateTutorRequest(tutorRequest: any): Observable<any> {
    return this.http.post(this.baseUrl + 'TutorRequest', tutorRequest);
  }

  GetTutorRequests(pagingParams: PagingParams): Observable<any> {
    let params = new HttpParams();

    params = params.append('pageNumber', pagingParams.pageNumber);
    params = params.append('pageSize', pagingParams.pageSize);

    return this.http.get<PaginationResult<TutorRequest>>(
      this.baseUrl + 'TutorRequest'
    );
  }
}
