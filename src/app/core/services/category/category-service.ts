import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  http: HttpClient = inject(HttpClient);
  baseUrl: any = environment.apiUrl;

  constructor() {}


  getCategories():Observable<any> {
    return this.http.get(`${this.baseUrl}Category`);
  }

}
