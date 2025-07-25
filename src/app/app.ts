import { FlowbiteService } from './core/services/flowbite/flowbite-service';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layouts/navbar/navbar";
import { initFlowbite } from 'flowbite';
import { LoginService } from './core/services/auth/login/login-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'iti-graduation';
  constructor(private FlowbiteService: FlowbiteService) {}
  loginService = inject(LoginService);
  get readyToRender() {
    return this.loginService.isInitialized; 
  }
  ngOnInit(): void {
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
