import { HttpClient } from '@angular/common/http';
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
}
