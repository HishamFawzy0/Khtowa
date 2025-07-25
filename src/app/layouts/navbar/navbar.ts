import { Component, Inject, inject, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../core/services/auth/login/login-service';
import { isPlatformBrowser } from '@angular/common';
import { UserDecodedToken } from '../../shared/interfaces/user-decoded-token';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  auth: any = inject(LoginService);
  router = inject(Router);
  flag: boolean = false;
  userData!: UserDecodedToken  ;



  ngAfterContentChecked(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.flag = localStorage.getItem('authToken') !== null;
      if (this.auth.isLoggedIn) {
        this.userData = this.auth.userData;
      }
    }
  }
  ngOnInit(): void {
     
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('loginTime');
    } 
    this.auth.clearUserData(); 
    this.router.navigate(['/login']);
    this.flag = false;
  }
}
