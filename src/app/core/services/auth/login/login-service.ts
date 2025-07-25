import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private decodedToken: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUserFromToken(); // أول ما يتعمل service، نحاول نجيب بيانات اليوزر
  }

  http: HttpClient = inject(HttpClient);

  get isLoggedIn(): boolean {
    return (
      isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken')
    );
  }

  login(loginObj: any): Observable<any> {
    return this.http.post('https://localhost:7277/api/Account/login', loginObj);
  }

  get userData(): any {
    return this.decodedToken;
  }

  private loadUserFromToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          this.decodedToken = jwtDecode(token);
        } catch (e) {
          console.error('Invalid token:', e);
          this.decodedToken = null;
        }
      }
    }
  }

  clearUserData(): void {
    this.decodedToken = null;
  }

  refreshUserData(): void {
    this.loadUserFromToken();
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post('https://localhost:7277/api/Account/refresh-token', {
      refreshToken,
    });
  }

  saveNewTokens(data: any): void {
   if (data.token) {
    localStorage.setItem('authToken', data.token);
  }

  // ✅ لا نحاول تخزين refreshToken لأنه غير موجود في response
  // if (data.refreshToken) {
  //   localStorage.setItem('refreshToken', data.refreshToken);
  // }

  this.refreshUserData();
}
}
