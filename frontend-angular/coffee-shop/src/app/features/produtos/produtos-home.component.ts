import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProdutosService, Produto } from '../../core/produtos.service';
import { clearAuth } from '../../shared/utils';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="topbar">
      <h2>Produtos</h2>
      <div class="actions">
        <a routerLink="/produtos/novo" class="btn">Novo Produto</a>
        <a routerLink="/mesas" class="btn">Mesas</a>
        <button (click)="logout()">Sair</button>
      </div>
    </header>

    <section *ngIf="loading" class="msg">Carregando...</section>
    <section *ngIf="error" class="msg err">Falha ao carregar produtos.</section>

    <ul *ngIf="!loading && !error" class="lista">
      <li *ngFor="let p of produtos; trackBy: trackById">
        <div class="nome">{{ p.nome }}</div>
        <div class="preco">R$ {{ p.preco | number:'1.2-2' }}</div>
        <div class="desc" *ngIf="p.descricao">{{ p.descricao }}</div>
        <span class="tag" [class.off]="p.ativo === false">
          {{ p.ativo === false ? 'Inativo' : 'Ativo' }}
        </span>

        <div class="row-actions">
          <a class="secondary" [routerLink]="['/produtos', p.id, 'editar']">Editar</a>
          <button class="danger" (click)="remover(p)" [disabled]="removendoId === p.id">
            {{ removendoId === p.id ? 'Removendo...' : 'Excluir' }}
          </button>
        </div>
      </li>
    </ul>
  `,
  styles: [`
    .topbar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #eee}
    .actions{display:flex;gap:8px;align-items:center}
    .btn{padding:8px 12px;border-radius:10px;background:#0a7;color:#fff;text-decoration:none}
    .topbar button{padding:8px 12px;border:0;border-radius:10px;background:#111;color:#fff;cursor:pointer}
    .msg{padding:16px}.err{color:#b00020}
    .lista{list-style:none;margin:0;padding:16px;display:grid;gap:12px}
    li{border:1px solid #eee;border-radius:12px;padding:12px}
    .nome{font-weight:600}.desc{opacity:.8;margin-top:4px}
    .tag{display:inline-block;margin-top:8px;padding:2px 8px;border-radius:999px;background:#e6ffe6}
    .tag.off{background:#ffe6e6}
    .row-actions{margin-top:8px;display:flex;gap:8px;align-items:center}
    .secondary{padding:6px 10px;border-radius:8px;background:#1976d2;color:#fff;text-decoration:none}
    .danger{padding:6px 10px;border:0;border-radius:8px;background:#c62828;color:#fff;cursor:pointer}
  `]
})
export class ProdutosHomeComponent implements OnInit {
  produtos: Produto[] = [];
  loading = true;
  error = false;
  removendoId?: number;

  constructor(private api: ProdutosService, private router: Router) { }

  ngOnInit(): void { this.reload(); }

  trackById = (_: number, p: Produto) => p.id ?? p.nome;

  private reload() {
    this.loading = true;
    this.api.listar().subscribe({
      next: (data) => { this.produtos = data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  remover(p: Produto) {
    if (!p.id) return;
    const ok = confirm(`Excluir "${p.nome}"?`);
    if (!ok) return;

    this.removendoId = p.id;
    this.api.delete(p.id).subscribe({
      next: () => { this.removendoId = undefined; this.reload(); },
      error: () => { this.removendoId = undefined; this.error = true; }
    });
  }

  logout() {
    clearAuth();
    this.router.navigateByUrl('/login');
  }
}
