import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export interface PagedResponse<T> {
  items: T[];
  metadata: PaginationMetadata;
}
export interface Proposal {
  id: number;
  message: string;
  instructorDisplayName: string;
  videoUrl: string;
  publicId: string;
  priceOffered: number;
  availableDateTimeList: string[];
  status: number; // 0..3
  sessionId: number | null; // من الـ Swagger راجع رقم، نخليها رقم/نَل
}

@Injectable({ providedIn: 'root' })
export class MyProposalsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl.endsWith('/')
    ? environment.apiUrl
    : environment.apiUrl + '/';

  getInstructorProposals(
    instructorId: string,
    page: number,
    pageSize: number,
    proposalStatus?: number
  ): Observable<PagedResponse<Proposal>> {
    let params = new HttpParams()
      .set('InstructorId', instructorId)
      .set('PageNumber', page.toString())
      .set('PageSize', pageSize.toString());

    if (proposalStatus !== undefined && proposalStatus !== null) {
      params = params.set('ProposalStatus', proposalStatus.toString());
    }

    return this.http.get<PagedResponse<Proposal>>(
      `${this.baseUrl}Proposal/instructor`,
      {
        params,
        responseType: 'json' as const, // نتأكد إن البودي هيتفَك JSON حتى لو السيرفر مرجع text/plain
      }
    );
  }
}
