import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MesasService, Mesa } from '../../core/mesas.service';
import { PedidosService } from '../../core/pedidos.service';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="topbar">
      <h2>Mesas</h2>
      <button class="ghost" (click)="reload()" [disabled]="loading">Recarregar</button>
    </header>

    <section *ngIf="loading" class="msg">Carregando...</section>
    <section *ngIf="error" class="msg err">Falha ao carregar mesas.</section>

    <div *ngIf="!loading && !error" class="grid">
      <div class="card" *ngFor="let m of mesas">
        <a [routerLink]="['/cardapio', m.id]" class="card-link">
          <div class="title">{{ m.nome }}</div>
          <div class="sub" [class.ocupada]="m.status==='OCUPADA'">{{ m.status ?? 'LIVRE' }}</div>
        </a>
        <div class="links">
          <a [routerLink]="['/mesas', m.id, 'detalhes']">Ver detalhes</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .topbar{padding:12px 16px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}
    .ghost{padding:6px 10px;border:0;border-radius:8px;background:#f2f2f2;cursor:pointer}
    .msg{padding:16px}.err{color:#b00020}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;padding:16px}
    .card{border:1px solid #eee;border-radius:12px;padding:12px;display:block}
    .card-link{text-decoration:none;color:inherit;display:block}
    .card-link:hover{background:#fafafa}
    .title{font-weight:600}
    .sub{opacity:.8;margin-top:6px}
    .sub.ocupada{color:#c62828}
    .links{margin-top:8px}
    .links a{font-size:13px;color:#1976d2;text-decoration:none}
  `]
})
export class MesasComponent implements OnInit {
  mesas: Mesa[] = [];
  loading = true; error = false;

  constructor(private api: MesasService, private pedidos: PedidosService) {}

  ngOnInit(): void {
    this.reload(true);
  }

  reload(fromInit = false) {
    this.loading = true;
    this.api.listar().subscribe({
      next: d => {
        this.mesas = d;
        this.loading = false;
        this.carregarStatus().then(() => {
          // marca otimista se viemos de um "confirmar pedido"
          const optimistic = Number(localStorage.getItem('mesaOcupada') ?? 0);
          if (optimistic) {
            this.mesas = this.mesas.map(m => m.id === optimistic ? { ...m, status: 'OCUPADA' } : m);
            localStorage.removeItem('mesaOcupada');
          }
        });
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  private async carregarStatus() {
    if (!this.mesas.length) return;
    const calls = this.mesas.map(m =>
      this.api.getDetalhesMesa(m.id).pipe(
        map(detalhes => {
          // Mesa está ocupada se tiver produtos (total > 0)
          const ocupado = detalhes.produtos.length > 0;
          return { id: m.id, ocupado };
        }),
        catchError(() => of({ id: m.id, ocupado: false }))
      )
    );
    return new Promise<void>(resolve => {
      forkJoin(calls).subscribe(results => {
        const occ = new Set(results.filter(r => r.ocupado).map(r => r.id));
        this.mesas = this.mesas.map(m => ({
          ...m,
          status: occ.has(m.id) ? 'OCUPADA' : 'LIVRE'
        }));
        resolve();
      });
    });
  }
}
