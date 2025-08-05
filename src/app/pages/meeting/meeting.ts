import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../core/services/auth/login/login-service';
import { SessionService } from '../../core/services/sessions/session-service';
import { IMeetingInfo } from '../../shared/interfaces/imeeting-info';

@Component({
  selector: 'app-meeting',
  imports: [],
  templateUrl: './meeting.html',
  styleUrl: './meeting.css',
})
export class Meeting implements OnInit {
  route = inject(ActivatedRoute);
  _loginService = inject(LoginService);
  _sessionService = inject(SessionService);
  router = inject(Router);
  userdata: any;
  meetingInfo: IMeetingInfo = {
    roomName: '',
    token: '',
    userId: '',
  };
  isReady: boolean = false;
  meetingURL: any;

  sessionId!: number;

  loadJitsi(): void {
    if (!this.isReady) {
      console.error('Meeting is not ready yet.');
      return;
    }
    this.loadJitsiScript().then(() => {
      const options = {
        roomName: this.meetingInfo.roomName, // unique room name
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#meet'),
        jwt: this.meetingInfo.token, // JWT token for authentication
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'desktop',
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'chat',
            'recording',
            'livestreaming',
            'etherpad',
            'sharedvideo',
            'settings',
            'raisehand',
            'videoquality',
            'filmstrip',
          ],
        },
        userInfo: {
          displayName: this.userdata.name,
          email: this.userdata.email,
        },
      };

      const api = new (window as any).JitsiMeetExternalAPI(
        'meet.local',
        options
      );

      api.addEventListener('videoConferenceJoined', () => {
        console.log('Meeting started!');
      });
      api.addEventListener('videoConferenceLeft', () => {
        console.log('Meeting ended!');
        this.router.navigate(['/']);
      });
    });
  }

  ngOnInit(): void {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    this.userdata = this._loginService.userData;
    console.log(this.sessionId);
    this._sessionService.getSession(this.sessionId).subscribe({
      next: (res) => {
        // console.log(res);
        this.meetingURL = res.meetingUrl;
        console.log(this.meetingURL);
      },
      error: (err) => {
        console.error('Failed to load session:', err);
      },
    });

    this._sessionService
      .getMeetToken(this.userdata.nameid, this.sessionId)
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.meetingInfo = res;
          this.isReady = true;
          this.loadJitsi();
          console.log(this.meetingInfo.token);
        },
        error: (err) => {
          console.error('Failed to load session:', err);
        },
      });
  }

  loadJitsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('jitsi-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'jitsi-script';
      script.src = `https://meet.local/external_api.js`;
      script.onload = () => resolve();
      script.onerror = () => reject('Jitsi script failed to load');
      document.body.appendChild(script);
    });
  }
}
