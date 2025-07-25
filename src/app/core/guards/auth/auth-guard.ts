import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/auth/login/login-service';

export const authGuard: CanActivateFn = (route, state) => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
