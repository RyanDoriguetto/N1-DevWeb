import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container">
      @if (isAuthenticated()) {
        <app-sidebar></app-sidebar>
      }
      <main class="main-content" [class.with-sidebar]="isAuthenticated()">
        @if (!isAuthenticated()) {
          <nav class="nav">
            <a routerLink="/login">Login</a>
          </nav>
        }
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 0;
    }

    .main-content.with-sidebar {
      margin-left: 250px;
      padding: 20px;
    }

    .nav{display:flex;gap:16px;align-items:center;padding:12px 16px;border-bottom:1px solid #eee}
    .nav a{text-decoration:none;color:#111}
  `]
})
export class AppComponent {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
