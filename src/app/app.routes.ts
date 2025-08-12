import { Routes } from '@angular/router';
import { Tutors } from './pages/tutors/tutors';
import { Services } from './pages/services/services';
import { Login } from './pages/login/login';
import { Registertype } from './pages/registertype/registertype';
import { authGuard } from './core/guards/auth/auth-guard';
import { StudentReq } from './pages/student-req/student-req';
import { ProposalForm } from './pages/proposal-form/proposal-form';
import { TutorRequestDetails } from './pages/tutor-request-details/tutor-request-details';
import { MyRequests } from './pages/my-requests/my-requests';
import { Chat } from './pages/chat/chat';
import { Meeting } from './pages/meeting/meeting';
import { MyProposals } from './pages/my-proposals/my-proposals';
import { Chatbot } from './pages/chatbot/chatbot';

export const routes: Routes = [
  { path: '', redirectTo: 'tutors', pathMatch: 'full' },
  { path: 'tutors', component: Tutors, canActivate: [authGuard] }, // Add guards if needed
  { path: 'services', component: Services, canActivate: [authGuard] },
  { path: 'student-req', component: StudentReq, canActivate: [authGuard] },
  { path: 'my-proposals', component: MyProposals, canActivate: [authGuard] },

  {
    path: 'TutorRequestDetails/:id',
    component: TutorRequestDetails,
    canActivate: [authGuard],
  },

  { path: 'my-chat/:id', component: Chat, canActivate: [authGuard] },

  {
    path: 'proposal-form/:id',
    component: ProposalForm,
    canActivate: [authGuard],
  },
  { path: 'my-requests/:id', component: MyRequests, canActivate: [authGuard] },
  { path: 'meeting/:id', component: Meeting, canActivate: [authGuard] },
  { path: 'quiz', component: Chatbot, canActivate: [authGuard] },

  { path: 'login', component: Login },
  { path: 'register', component: Registertype },

  { path: '**', redirectTo: 'tutors', pathMatch: 'full' },
];
