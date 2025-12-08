import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MesasService, MesaDetalhes, ProdutoMesa } from '../../core/mesas.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" *ngIf="detalhes">
      <header class="topbar">
        <div class="topbar-info">
          <h2>Mesa {{ detalhes.numeroMesa }}</h2>
          <p class="subtitle">Resumo dos itens e total da mesa</p>
        </div>

        <!-- Encerrar mesa só aparece se tiver item -->
        <button
          class="btn-danger"
          *ngIf="detalhes.produtos.length > 0"
          (click)="encerrarMesa()"
          [disabled]="loading"
        >
          {{ loading ? 'Encerrando...' : 'Encerrar Mesa' }}
        </button>
      </header>

      <div class="produtos-section card">
        <div class="card-header">
          <h3>Produtos na mesa</h3>
        </div>

        <div class="card-body">
          <div *ngIf="detalhes.produtos.length === 0" class="empty-message">
            Nenhum produto nesta mesa.
          </div>

          <table *ngIf="detalhes.produtos.length > 0" class="produtos-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th class="col-center">Qtd.</th>
                <th class="col-right">Preço Unit.</th>
                <th class="col-right">Subtotal</th>
                <th class="col-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let produto of detalhes.produtos">
                <td>
                  <div class="produto-nome">{{ produto.nomeProduto }}</div>
                </td>
                <td class="col-center">{{ produto.quantidade }}</td>
                <td class="col-right">{{ produto.precoUnitario | currency:'BRL' }}</td>
                <td class="col-right">{{ produto.subtotal | currency:'BRL' }}</td>
                <td class="col-acoes">
                  <button
                    class="btn-link btn-cancelar"
                    (click)="cancelarProduto(produto)"
                    [disabled]="loading"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="total-section" *ngIf="detalhes.produtos.length > 0">
        <div class="total-card">
          <span>Total da mesa</span>
          <strong>{{ detalhes.total | currency:'BRL' }}</strong>
        </div>
      </div>
    </div>

    <div *ngIf="!detalhes && !error" class="loading">Carregando...</div>
    <div *ngIf="error" class="error">Erro ao carregar mesa</div>
  `,
  styles: [`
    .container {
      padding: 16px;
      max-width: 960px;
      margin: 0 auto;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
      gap: 12px;
      flex-wrap: wrap;
    }

    .topbar-info h2 {
      margin: 0;
      font-size: 22px;
    }

    .subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: #6b7280;
    }

    .btn-danger {
      background: #d32f2f;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-danger:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .card {
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
      margin-bottom: 20px;
    }

    .card-header {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .card-body {
      padding: 12px 16px 16px;
    }

    .produtos-section {
      margin-bottom: 16px;
    }

    .produtos-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 14px;
    }

    .produtos-table th,
    .produtos-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    .produtos-table th {
      background: #f9fafb;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7280;
    }

    .produto-nome {
      font-weight: 500;
      color: #111827;
    }

    .col-center {
      text-align: center;
      width: 60px;
    }

    .col-right {
      text-align: right;
      white-space: nowrap;
    }

    .col-acoes {
      text-align: right;
      width: 110px;
    }

    .btn-link {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 13px;
      text-decoration: underline;
    }

    .btn-cancelar {
      color: #d32f2f;
      font-weight: 500;
    }

    .btn-cancelar:hover {
      opacity: 0.8;
    }

    .total-section {
      display: flex;
      justify-content: flex-end;
    }

    .total-card {
      background: #111827;
      color: #f9fafb;
      padding: 12px 18px;
      border-radius: 10px;
      display: inline-flex;
      align-items: baseline;
      gap: 8px;
      font-size: 14px;
    }

    .total-card strong {
      font-size: 18px;
    }

    .empty-message {
      text-align: center;
      padding: 32px 8px;
      color: #666;
      font-style: italic;
    }

    .loading,
    .error {
      text-align: center;
      padding: 40px;
      font-size: 18px;
    }

    .error {
      color: #d32f2f;
    }

    @media (max-width: 600px) {
      .produtos-table th:nth-child(3),
      .produtos-table td:nth-child(3) {
        display: none; /* esconde Preço Unit. no super pequeno */
      }
    }
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
  ) {}

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

        // zera da lista de ocupadas no localStorage (se você estiver usando isso em algum lugar)
        try {
          const raw = localStorage.getItem('mesasOcupadas');
          const arr: number[] = raw ? JSON.parse(raw) : [];
          const filtrado = arr.filter(n => n !== this.detalhes!.numeroMesa);
          localStorage.setItem('mesasOcupadas', JSON.stringify(filtrado));
        } catch {
          // se der erro no parse, ignora
        }

        alert('Mesa encerrada com sucesso!');
        this.router.navigate(['/mesas']);
      },
      error: () => {
        this.loading = false;
        alert('Erro ao encerrar mesa');
      }
    });
  }

  cancelarProduto(produto: ProdutoMesa): void {
    if (!this.detalhes) return;

    const ok = confirm(`Deseja cancelar o produto "${produto.nomeProduto}" desta mesa?`);
    if (!ok) return;

    this.loading = true;
    this.mesasService.cancelarItem(produto.itemId).subscribe({
      next: () => {
        this.loading = false;
        this.carregarDetalhesMesa(); // recarrega lista e total
      },
      error: () => {
        this.loading = false;
        alert('Erro ao cancelar item');
      }
    });
  }
}
