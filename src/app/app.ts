import { FlowbiteService } from './core/services/flowbite/flowbite-service';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layouts/navbar/navbar";
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'iti-graduation';
  constructor(private FlowbiteService: FlowbiteService) {}


  
  ngOnInit(): void {
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
