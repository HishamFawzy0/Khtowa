import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private decodedToken: any = null;
  private refreshInterval: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUserFromToken();

    if (isPlatformBrowser(this.platformId)) {
      this.startAutoRefresh(); // ✅ فقط في المتصفح
    }
  }

  isInitialized: boolean = false;
  http: HttpClient = inject(HttpClient);
  baseURL: any = environment.apiUrl;

  get isLoggedIn(): boolean {
    return (
      isPlatformBrowser(this.platformId) && !!localStorage.getItem('authToken')
    );
  }

  get userData(): any {
    return this.decodedToken;
  }

  login(loginObj: any): Observable<any> {
    return this.http.post(`${this.baseURL}Account/login`, loginObj);
  }

  refreshToken(): Observable<any> {
    return this.http.post(
      `${this.baseURL}Account/refresh-token`,
      {},
      {
        headers: this.getAuthHeaders(),
        withCredentials: true,
      }
    );
  }

  saveNewTokens(data: any): void {
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    this.refreshUserData();
  }

  clearUserData(): void {
    this.decodedToken = null;
    this.stopAutoRefresh();
    localStorage.removeItem('authToken');
  }

  refreshUserData(): void {
    this.loadUserFromToken();
  }

  private loadUserFromToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          this.decodedToken = jwtDecode(token);
        } catch (e) {
          this.decodedToken = null;
        }
      }
      this.isInitialized = true;
    }
  }

  startAutoRefresh(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const decoded: any = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp;
        const remaining = exp - now;

        // ✅ جدد التوكن لو باقي أقل من دقيقتين
        if (remaining < 120 && remaining > 0) {
          this.refreshToken().subscribe({
            next: (res) => {
              if (res?.token) {
                this.saveNewTokens(res);
                console.log('[AUTO-REFRESH] Token renewed ✅');
              }
            },
            error: (err) => {
              console.error('[AUTO-REFRESH] Failed:', err);
              this.clearUserData();
              localStorage.clear();
              location.href = '/login';
            },
          });
        }
      } catch (err) {
        this.clearUserData();
        localStorage.clear();
        location.href = '/login';
      }
    }, 5 * 60 * 1000); // ⏱️ كل 5 دقايق
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
