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


  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}Category`);
  }

  createCategory(categoryName: any): Observable<any> {
    return this.http.post(this.baseUrl + 'Category', { categoryName });
  }

  updateCategoryName(categoryId: number, categoryName: string): Observable<any> {
    return this.http.patch(this.baseUrl + 'Category/' + categoryId, { name: categoryName });
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.patch(this.baseUrl + 'Category/delete' + categoryId, {});
  }

}
