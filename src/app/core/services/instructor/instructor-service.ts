import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { InstructorAdminData } from '../../../shared/interfaces/instructor-admin-data';
import { PaginationResult } from '../../../shared/interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  http: HttpClient = inject(HttpClient);
  apiURL: any = environment.apiUrl;

  getInstructorByProposalID(id: number): Observable<any> {
    return this.http.get<any>(this.apiURL + 'Instructor/proposal/' + id);
  }

  getInstructorsForAdmin(
    pageSize: number = 10,
    pageNumber: number = 1,
    isVerified?: boolean | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('PageSize', pageSize)
      .set('PageNumber', pageNumber);

    if (isVerified !== null && isVerified !== undefined) {
      params = params.set('IsVerified', isVerified);
    }

    return this.http.get<PaginationResult<InstructorAdminData[]>>(
      this.apiURL + 'Instructor/instructors-for-admin',
      { params }
    );
  }

  acceptInstructor(id: string): Observable<any> {
    return this.http.patch<any>(
      this.apiURL + 'Instructor/update-instructor-true/' + id,
      {}
    );
  }

  rejectInstructor(id: string): Observable<any> {
    return this.http.patch<any>(
      this.apiURL + 'Instructor/update-instructor-false/' + id,
      {}
    );
  }

  toggleInstructorVerification(id: string): Observable<any> {
    return this.http.patch<any>(
      this.apiURL + 'Instructor/toggle-instructor-verification/' + id,
      {}
    );
  }

  getInstructorIsVerified(id: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiURL + 'Instructor/is-verified/' + id);
  }
}
