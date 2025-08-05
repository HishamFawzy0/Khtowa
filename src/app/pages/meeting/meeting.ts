import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../core/services/auth/login/login-service';
import { SessionService } from '../../core/services/sessions/session-service';

@Component({
  selector: 'app-meeting',
  imports: [],
  templateUrl: './meeting.html',
  styleUrl: './meeting.css',
})
export class Meeting {
   route = inject(ActivatedRoute);
  _loginService = inject(LoginService);
  _sessionService = inject(SessionService);
  userdata :any;

   sessionId!: number;
  ngOnInit(): void {
        this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
        this.userdata = this._loginService.userData
        console.log(this.sessionId);
      this._sessionService.getSession(this.sessionId).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error('Failed to load session:', err);
        },
      })


      this._sessionService.getMeetToken(this.userdata.nameid,this.sessionId).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error('Failed to load session:', err);
        },
      })
        
  }
}
