import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Specialization {
  http: HttpClient = inject(HttpClient);
  apiURL: any = environment.apiUrl;

  getSpecialization(): Observable<any> {
    return this.http.get<any>(this.apiURL + 'Specialization');
  }
}
