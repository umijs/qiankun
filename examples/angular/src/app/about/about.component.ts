import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about">
      <h1>About</h1>
      <p>This is the About page of the Angular 17 micro-frontend.</p>
      <p>This example has been upgraded from Angular 9 to Angular 17 with:</p>
      <ul>
        <li>Angular 17 Standalone Components</li>
        <li>Vite 5 for fast development</li>
        <li>Modern Angular Router</li>
        <li>TypeScript support</li>
        <li>Modern qiankun v3 integration</li>
      </ul>
    </div>
  `,
  styles: [`
    .about {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    h1 {
      color: #c3002f;
      text-align: center;
      margin-bottom: 20px;
    }
    
    ul {
      text-align: left;
      margin-top: 20px;
    }
    
    li {
      margin: 8px 0;
      color: #333;
    }
  `]
})
export class AboutComponent {}
