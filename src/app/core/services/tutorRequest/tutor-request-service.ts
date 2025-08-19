import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginationResult } from '../../../shared/interfaces/pagination';
import { TutorRequest } from '../../../shared/interfaces/tutor-request';
import { PagingParams } from '../../../shared/interfaces/paging-params';
import { TutorRequestFilter } from '../../../pages/services/services';

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

  GetTutorRequests(
    filter: TutorRequestFilter
  ): Observable<PaginationResult<TutorRequest>> {
    let params = new HttpParams()
      .set('PageNumber', filter.pageNumber)
      .set('PageSize', filter.pageSize);

    if (filter.title) {
      params = params.set('Title', filter.title);
    }

    if (filter.categoryIds && filter.categoryIds.length > 0) {
      for (const id of filter.categoryIds) {
        params = params.append('CategoryIds', id); // as array
      }
    }

    if (filter.minBudget !== undefined) {
      params = params.set('MinBudget', filter.minBudget);
    }

    if (filter.maxBudget !== undefined) {
      params = params.set('MaxBudget', filter.maxBudget);
    }

    return this.http.get<PaginationResult<TutorRequest>>(
      this.baseUrl + 'TutorRequest',
      {
        params,
      }
    );
  }
}
