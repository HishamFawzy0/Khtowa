import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { TutorRequestFilter } from '../../../pages/services/services';

@Injectable({
  providedIn: 'root',
})
export class MyRequestService {
  constructor() {}
  http: HttpClient = inject(HttpClient);
  baseUrl: any = environment.apiUrl;

  GetTutorRequests(filter: TutorRequestFilter , id:any): Observable<any> {
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

    return this.http.get(this.baseUrl + 'TutorRequest/student/'+id , {
      params,
    });
  }
}
