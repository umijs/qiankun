import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home">
      <h1>Home</h1>
      <p>Welcome to the Angular 17 micro-frontend example!</p>
      <p class="highlight">Upgraded from Angular 9 to Angular 17 + Vite</p>
    </div>
  `,
  styles: [`
    .home {
      padding: 20px;
      text-align: center;
    }
    
    h1 {
      color: #c3002f;
      margin-bottom: 20px;
    }
    
    .highlight {
      color: #dd0031;
      font-weight: bold;
      margin-top: 20px;
    }
  `]
})
export class HomeComponent {}
