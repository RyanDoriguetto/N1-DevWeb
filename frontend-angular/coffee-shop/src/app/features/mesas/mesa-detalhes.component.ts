import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MesasService, MesaDetalhes } from '../../core/mesas.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="detalhes">
      <header class="topbar">
        <h2>Mesa {{ detalhes.numeroMesa }}</h2>
        <button class="btn-danger" (click)="encerrarMesa()" [disabled]="loading">
          {{ loading ? 'Encerrando...' : 'Encerrar Mesa' }}
        </button>
      </header>

      <div class="produtos-section">
        <h3>Produtos</h3>

        <div *ngIf="detalhes.produtos.length === 0" class="empty-message">
          Nenhum produto nesta mesa
        </div>

        <table *ngIf="detalhes.produtos.length > 0" class="produtos-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let produto of detalhes.produtos">
              <td>{{ produto.nomeProduto }}</td>
              <td>{{ produto.quantidade }}</td>
              <td>{{ produto.precoUnitario | currency:'BRL' }}</td>
              <td>{{ produto.subtotal | currency:'BRL' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total-section" *ngIf="detalhes.produtos.length > 0">
        <h3>Total: {{ detalhes.total | currency:'BRL' }}</h3>
      </div>
    </div>

    <div *ngIf="!detalhes && !error" class="loading">Carregando...</div>
    <div *ngIf="error" class="error">Erro ao carregar mesa</div>
  `,
  styles: [`
    .container { padding: 16px; }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
    }
    .btn-danger {
      background: #d32f2f;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-danger:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .produtos-section { margin-bottom: 24px; }
    .produtos-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    .produtos-table th,
    .produtos-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .produtos-table th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .total-section {
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      text-align: right;
    }
    .empty-message {
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
    }
    .loading, .error {
      text-align: center;
      padding: 40px;
      font-size: 18px;
    }
    .error { color: #d32f2f; }
  `]
})
export class MesaDetalhesComponent implements OnInit {
  detalhes: MesaDetalhes | null = null;
  loading = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mesasService: MesasService
  ) { }

  ngOnInit(): void {
    this.carregarDetalhesMesa();
  }

  carregarDetalhesMesa(): void {
    const mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));

    this.mesasService.getDetalhesMesa(mesaId).subscribe({
      next: (detalhes) => {
        this.detalhes = detalhes;
        this.error = false;
      },
      error: () => {
        this.error = true;
        this.detalhes = null;
      }
    });
  }

  encerrarMesa(): void {
    if (!this.detalhes || !confirm('Deseja realmente encerrar esta mesa?')) {
      return;
    }

    this.loading = true;
    this.mesasService.encerrarMesa(this.detalhes.numeroMesa).subscribe({
      next: () => {
        this.loading = false;
        alert('Mesa encerrada com sucesso!');
        this.router.navigate(['/mesas']);
      },
      error: () => {
        this.loading = false;
        alert('Erro ao encerrar mesa');
      }
    });
  }
}
