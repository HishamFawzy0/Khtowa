import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/auth/login/login-service';

export const studentGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const currentUser = loginService.userData;

  if (currentUser.role === 'Student') {
    return true;
  } else {
    router.navigate(['/services']);
    return false;
  }
};
