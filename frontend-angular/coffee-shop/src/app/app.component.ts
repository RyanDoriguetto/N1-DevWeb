import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-container">
      <app-sidebar *ngIf="showSidebar"></app-sidebar>
      <main class="main-content" [class.with-sidebar]="showSidebar">
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
    /* quando a sidebar não estiver visível */
    margin-left: 0;
  }

  /* aplica espaço quando a sidebar estiver visível */
  .main-content.with-sidebar {
    margin-left: 250px; /* mesma largura da sidebar */
    padding: 20px;
    box-sizing: border-box;
  }
`]
})
export class AppComponent {
  constructor(private router: Router) {}

  get showSidebar(): boolean {
    return !this.router.url.startsWith('/login'); // esconde só no /login
  }
}
