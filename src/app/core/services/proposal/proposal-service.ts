import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  constructor() {}

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  createProposal(proposalObj: any): Observable<any> {
    return this.http.post(this.baseUrl + 'Proposal', proposalObj);
  }

  changeProposalStatus(propId: number, status: number): Observable<any> {
    const params = new HttpParams().set('propId', propId).set('status', status);
    return this.http.patch(
      this.baseUrl + 'Proposal',
      {},
      { params,responseType: 'text' }
    );
  }
}
