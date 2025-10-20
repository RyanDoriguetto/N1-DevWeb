import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav class="nav">
      <a routerLink="/login">Login</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .nav{display:flex;gap:16px;align-items:center;padding:12px 16px;border-bottom:1px solid #eee}
    .nav a{text-decoration:none;color:#111}
  `]
})
export class AppComponent {}
