import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/auth/login/login-service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, from, switchMap, throwError } from 'rxjs';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService);
  const router = inject(Router);

  const token = localStorage.getItem('authToken');

  // لو مفيش توكن
  if (!token) return next(req);

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.exp;

    const isExpired = exp < now;
    const isExpiringSoon = exp - now < 60; // أقل من دقيقة

    if (isExpired) {
      authService.clearUserData();
      router.navigate(['/login']);
      return throwError(() => new Error('Token expired'));
    }

    if (isExpiringSoon) {
     return from(authService.refreshToken()).pipe(
       switchMap((res: any) => {
         if (!res.token) {
           throw new Error('No token returned from refresh endpoint');
         }

         authService.saveNewTokens(res);

         const newReq = req.clone({
           setHeaders: {
             Authorization: `Bearer ${res.token}`,
           },
         });

         return next(newReq);
       }),
       catchError((err) => {
         authService.clearUserData();
         localStorage.clear();
         router.navigate(['/login']);
         return throwError(() => err);
       })
     );
    }

    // التوكن سليم → نرسله مع الطلب
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq);
  } catch (err) {
    // لو حصل مشكلة في decode
    authService.clearUserData();
    localStorage.clear();
    router.navigate(['/login']);
    return throwError(() => new Error('Invalid token'));
  }
};
