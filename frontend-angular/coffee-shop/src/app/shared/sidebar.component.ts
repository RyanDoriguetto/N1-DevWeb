import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="logo">
        <h2>Coffee Shop</h2>
      </div>

      <ul class="nav-links">


        <li>
          <a
            routerLink="/mesas"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            🪑 Mesas
          </a>
        </li>

        <li>
          <a
            routerLink="/produtos"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            📦 Produtos
          </a>
        </li>

        <li>
          <a
            routerLink="/cardapio/1"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            📋 Cardápio
          </a>
        </li>

         <!-- NOVO: link para o Dashboard / Estatísticas -->
        <li>
          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            📊 Dashboard
          </a>
        </li>
      </ul>

      <div class="user-section">
        <button class="logout-btn" (click)="logout()">
          🚪 Sair
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
    }

    .logo {
      padding: 20px;
      border-bottom: 1px solid #1c538aff;
    }

    .logo h2 {
      margin: 0;
      font-size: 20px;
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
      flex: 1;
    }

    .nav-links li {
      margin: 0;
    }

    .nav-links a {
      display: block;
      padding: 12px 20px;
      color: #ecf0f1;
      text-decoration: none;
      font-size: 15px;
    }

    .nav-links a:hover {
      background: #34495e;
    }

    .nav-links a.active {
      background: #1abc9c;
      color: #2c3e50;
      font-weight: bold;
    }

    .user-section {
      padding: 20px;
      border-top: 1px solid #34495e;
    }

    .logout-btn {
      width: 100%;
      padding: 10px 0;
      border: none;
      background: #e74c3c;
      color: white;
      font-size: 14px;
      border-radius: 5px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background: #c0392b;
    }
  `]
})
export class SidebarComponent {
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
