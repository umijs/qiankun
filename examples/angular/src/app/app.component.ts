import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <nav class="nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <span class="separator">|</span>
        <a routerLink="/about" routerLinkActive="active">About</a>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .nav {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .nav a {
      font-weight: bold;
      color: #2c3e50;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .nav a:hover {
      background-color: #f0f0f0;
    }
    
    .nav a.active {
      color: #42b983;
      background-color: #e8f5e9;
    }
    
    .separator {
      margin: 0 8px;
      color: #ccc;
    }
    
    .main-content {
      min-height: 400px;
    }
  `]
})
export class AppComponent {
  title = 'angular';
}
