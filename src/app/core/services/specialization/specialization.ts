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

  createSpecialization(specializationName: any): Observable<any> {
    return this.http.post(this.apiURL + 'Specialization', { specializationName });
  }

  updateSpecializationName(specializationId: number, specializationName: string): Observable<any> {
    return this.http.patch(this.apiURL + 'Specialization/' + specializationId, { name: specializationName });
  }

  deleteSpecialization(specializationId: number): Observable<any> {
    return this.http.patch(this.apiURL + 'Specialization/delete' + specializationId, {});
  }
}
