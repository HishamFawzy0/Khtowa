import { Routes } from '@angular/router';
import { Tutors } from './pages/tutors/tutors';
import { Services } from './pages/services/services';

export const routes: Routes = [
  { path: '', redirectTo: 'tutors', pathMatch: 'full' },
  { path: 'tutors', component: Tutors },
  { path: 'services', component: Services },
  { path: '**', redirectTo: 'tutors', pathMatch: 'full' },
];
