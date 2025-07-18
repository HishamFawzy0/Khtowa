import { Routes } from '@angular/router';
import { Tutors } from './pages/tutors/tutors';
import { Services } from './pages/services/services';

export const routes: Routes = [
  { path: '', redirectTo: 'toturs', pathMatch: 'full' },
  { path: 'toturs', component: Tutors },
  { path: 'services', component: Services },
  { path: '**', redirectTo: 'Tutors', pathMatch: 'full' },
];
