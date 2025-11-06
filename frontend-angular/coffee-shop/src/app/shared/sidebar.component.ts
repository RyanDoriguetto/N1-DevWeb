import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar', // ← ADICIONE ESTA LINHA
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="logo">
        <h2>Coffee Shop</h2>
      </div>

      <ul class="nav-links">
        <li>
          <a routerLink="/mesas" routerLinkActive="active">
            🪑 Mesas
          </a>
        </li>
        <li>
          <a routerLink="/produtos" routerLinkActive="active">
            📦 Produtos
          </a>
        </li>
        <li>
          <a routerLink="/cardapio/1" routerLinkActive="active">
            📋 Cardápio
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
      border-bottom: 1px solid #34495e;
      text-align: center;
    }

    .logo h2 {
      margin: 0;
      font-size: 1.5rem;
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
      padding: 15px 20px;
      color: #ecf0f1;
      text-decoration: none;
      transition: all 0.3s;
      border-left: 4px solid transparent;
    }

    .nav-links a:hover {
      background: #34495e;
      color: white;
    }

    .nav-links a.active {
      background: #3498db;
      border-left-color: #2980b9;
      color: white;
    }

    .user-section {
      padding: 20px;
      border-top: 1px solid #34495e;
    }

    .logout-btn {
      width: 100%;
      padding: 10px;
      background: #e74c3c;
      color: white;
      border: none;
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
