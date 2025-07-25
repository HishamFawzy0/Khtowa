import { Routes } from '@angular/router';
import { Tutors } from './pages/tutors/tutors';
import { Services } from './pages/services/services';
import { Login } from './pages/login/login';
import { Registertype } from './pages/registertype/registertype';
import { authGuard } from './core/guards/auth/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tutors', pathMatch: 'full' },
  { path: 'tutors', component: Tutors, canActivate: [authGuard] }, // Add guards if needed
  { path: 'services', component: Services, canActivate: [authGuard] },

  { path: 'login', component: Login },
  { path: 'register', component: Registertype },
  
  { path: '**', redirectTo: 'tutors', pathMatch: 'full' },

];
