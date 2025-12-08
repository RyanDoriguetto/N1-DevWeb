import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/dashboard.service';
import {
  DashboardResumo,
  DashboardVendaDia,
  DashboardVendaHora,
  DashboardTopProduto,
  DashboardUltimoPedido,
  DashboardStatusResumo,
  DashboardPagamentoResumo,
} from '../../shared/models';

// ng2-charts
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-root">
      <!-- CABEÇALHO DA PÁGINA -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Visão geral da sua cafeteria</p>
        </div>

        <div class="page-actions">
          <div class="period-filters">
            <span class="period-label">Período geral:</span>

            <button
              class="badge-pill"
              [class.badge-pill-active]="periodoDashboard === 1"
              (click)="alterarPeriodoDashboard(1)"
            >
              1 dia
            </button>

            <button
              class="badge-pill"
              [class.badge-pill-active]="periodoDashboard === 7"
              (click)="alterarPeriodoDashboard(7)"
            >
              7 dias
            </button>

            <button
              class="badge-pill"
              [class.badge-pill-active]="periodoDashboard === 15"
              (click)="alterarPeriodoDashboard(15)"
            >
              15 dias
            </button>

            <button
              class="badge-pill"
              [class.badge-pill-active]="periodoDashboard === 30"
              (click)="alterarPeriodoDashboard(30)"
            >
              30 dias
            </button>
          </div>

          <button
            class="btn btn-outline"
            (click)="reload()"
            [disabled]="loadingResumo || loadingVendas || loadingTop || loadingRecent || loadingStatus || loadingPagamento"
          >
            Recarregar
          </button>
        </div>
      </div>

      <!-- LINHA DE CARDS (RESUMO) -->
      <div class="cards-row" *ngIf="resumo && !loadingResumo; else loadingResumoTpl">
        <div class="card summary-card">
          <div class="card-body">
            <div class="card-label">Total de pedidos</div>
            <div class="card-value">{{ resumo.totalOrders }}</div>
            <div class="card-helper">Todos os pedidos registrados</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="card-body">
            <div class="card-label">Faturamento total</div>
            <div class="card-value">
              R$ {{ resumo.totalRevenue | number: '1.2-2' }}
            </div>
            <div class="card-helper">Somente pedidos encerrados</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="card-body">
            <div class="card-label">Ticket médio</div>
            <div class="card-value">
              R$ {{ resumo.averageTicket | number: '1.2-2' }}
            </div>
            <div class="card-helper">Média por pedido</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="card-body">
            <div class="card-label">Pedidos em aberto</div>
            <div class="card-value">{{ resumo.totalOpenOrders }}</div>
            <div class="badge badge-warning">Aguardando finalização</div>
          </div>
        </div>

        <div class="card summary-card">
          <div class="card-body">
            <div class="card-label">Produtos cadastrados</div>
            <div class="card-value">{{ resumo.totalProducts }}</div>
            <div class="card-helper">Itens no cardápio</div>
          </div>
        </div>
      </div>

      <ng-template #loadingResumoTpl>
        <div class="card full-width-card">
          <div class="card-body">
            Carregando dados do resumo...
          </div>
        </div>
      </ng-template>

      <div *ngIf="errorResumo" class="alert alert-danger">
        Ocorreu um erro ao carregar o resumo.
        <button class="btn btn-link" (click)="reloadResumo()">Tentar novamente</button>
      </div>

      <!-- CARD: STATUS DOS PEDIDOS -->
      <div class="card full-width-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Status dos pedidos</h2>
            <p class="card-subtitle">Distribuição dos pedidos por status</p>
          </div>
        </div>

        <div class="card-body">
          <div *ngIf="loadingStatus">
            Carregando status dos pedidos...
          </div>

          <div *ngIf="errorStatus && !loadingStatus" class="alert alert-danger">
            Erro ao carregar status dos pedidos.
            <button class="btn btn-link" (click)="carregarStatusPedidos()">
              Tentar novamente
            </button>
          </div>

          <div *ngIf="!loadingStatus && !errorStatus && statusResumo" class="status-grid">
            <div class="status-pill status-recebido">
              <div>
                <div class="status-label">Recebido</div>
                <div class="status-value">{{ statusResumo.recebido }}</div>
              </div>
            </div>
            <div class="status-pill status-preparo">
              <div>
                <div class="status-label">Em preparo</div>
                <div class="status-value">{{ statusResumo.emPreparo }}</div>
              </div>
            </div>
            <div class="status-pill status-pronto">
              <div>
                <div class="status-label">Pronto</div>
                <div class="status-value">{{ statusResumo.pronto }}</div>
              </div>
            </div>
            <div class="status-pill status-entregue">
              <div>
                <div class="status-label">Entregue</div>
                <div class="status-value">{{ statusResumo.entregue }}</div>
              </div>
            </div>
            <div class="status-pill status-cancelado">
              <div>
                <div class="status-label">Cancelado</div>
                <div class="status-value">{{ statusResumo.cancelado }}</div>
              </div>
            </div>
          </div>

          <p *ngIf="!loadingStatus && !errorStatus && !statusResumo">
            Nenhuma informação de status encontrada.
          </p>
        </div>
      </div>

      <!-- CARD: PAGAMENTOS POR MÉTODO -->
      <div class="card full-width-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Pagamentos por método</h2>
            <p class="card-subtitle">Quantidade e valor recebido por forma de pagamento</p>
          </div>
        </div>

        <div class="card-body">
          <div *ngIf="loadingPagamento">
            Carregando dados de pagamentos...
          </div>

          <div *ngIf="errorPagamento && !loadingPagamento" class="alert alert-danger">
            Erro ao carregar dados de pagamentos.
            <button class="btn btn-link" (click)="carregarPagamentos()">
              Tentar novamente
            </button>
          </div>

          <div *ngIf="!loadingPagamento && !errorPagamento && pagamentoResumo">

            <div class="payments-grid">
              <div class="payment-pill payment-pendente">
                <div class="payment-label">Pendente</div>
                <div class="payment-value">{{ pagamentoResumo.pendente }}</div>
              </div>

              <div class="payment-pill payment-dinheiro">
                <div class="payment-label">Dinheiro</div>
                <div class="payment-value">{{ pagamentoResumo.dinheiro }}</div>
                <div class="payment-helper">
                  R$ {{ pagamentoResumo.totalDinheiro | number:'1.2-2' }}
                </div>
              </div>

              <div class="payment-pill payment-cartao">
                <div class="payment-label">Cartão</div>
                <div class="payment-value">{{ pagamentoResumo.cartao }}</div>
                <div class="payment-helper">
                  R$ {{ pagamentoResumo.totalCartao | number:'1.2-2' }}
                </div>
              </div>

              <div class="payment-pill payment-pix">
                <div class="payment-label">PIX</div>
                <div class="payment-value">{{ pagamentoResumo.pix }}</div>
                <div class="payment-helper">
                  R$ {{ pagamentoResumo.totalPix | number:'1.2-2' }}
                </div>
              </div>
            </div>

            <!-- GRÁFICO DOUGHNUT -->
            <div class="chart-wrapper payments-chart-wrapper">
              <canvas
                baseChart
                [data]="paymentChartData"
                [options]="paymentChartOptions"
                [type]="'doughnut'">
              </canvas>
            </div>

            <div class="payment-total-row">
              <span>Total recebido (Dinheiro + Cartão + PIX)</span>
              <strong>R$ {{ pagamentoResumo.totalGeral | number:'1.2-2' }}</strong>
            </div>
          </div>

          <p *ngIf="!loadingPagamento && !errorPagamento && !pagamentoResumo">
            Nenhuma informação de pagamento encontrada.
          </p>
        </div>
      </div>

      <!-- LINHA: GRÁFICO + TOP PRODUTOS -->
      <div class="grid-two-cols">
        <!-- CARD: VENDAS POR DIA -->
        <div class="card full-height-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Vendas por dia</h2>
              <p class="card-subtitle">Faturamento de pedidos encerrados</p>
            </div>

            <div class="filters">
              <span class="period-label">Período:</span>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosVendas === 1"
                (click)="carregarVendas(1)"
              >
                1 dia
              </button>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosVendas === 7"
                (click)="carregarVendas(7)"
              >
                7 dias
              </button>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosVendas === 15"
                (click)="carregarVendas(15)"
              >
                15 dias
              </button>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosVendas === 30"
                (click)="carregarVendas(30)"
              >
                30 dias
              </button>
            </div>
          </div>

          <div class="card-body">
            <div *ngIf="loadingVendas">
              Carregando vendas por dia...
            </div>

            <div *ngIf="errorVendas && !loadingVendas" class="alert alert-danger">
              Erro ao carregar vendas por dia.
              <button class="btn btn-link" (click)="carregarVendas(diasSelecionadosVendas)">
                Tentar novamente
              </button>
            </div>

            <div *ngIf="!loadingVendas && !errorVendas && vendasPorDia.length">
              <div class="chart-wrapper">
                <canvas
                  baseChart
                  [data]="lineChartData"
                  [options]="lineChartOptions"
                  [type]="'line'">
                </canvas>
              </div>

              <table class="simple-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Total vendido (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let venda of vendasPorDia">
                    <td>{{ venda.date | date: 'dd/MM/yyyy' }}</td>
                    <td>{{ venda.total | number: '1.2-2' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p *ngIf="!loadingVendas && !errorVendas && !vendasPorDia.length">
              Não há vendas no período selecionado.
            </p>
          </div>
        </div>

        <!-- CARD: TOP PRODUTOS -->
        <div class="card full-height-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Top produtos mais vendidos</h2>
              <p class="card-subtitle">Com base em pedidos encerrados</p>
            </div>

            <div class="filters">
              <span class="period-label">Período:</span>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosTop === 1"
                (click)="carregarTopProdutos(1)"
              >
                1 dia
              </button>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosTop === 7"
                (click)="carregarTopProdutos(7)"
              >
                7 dias
              </button>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosTop === 15"
                (click)="carregarTopProdutos(15)"
              >
                15 dias
              </button>

              <button
                class="badge-pill"
                [class.badge-pill-active]="diasSelecionadosTop === 30"
                (click)="carregarTopProdutos(30)"
              >
                30 dias
              </button>
            </div>
          </div>

          <div class="card-body">
            <div *ngIf="loadingTop">
              Carregando top produtos...
            </div>

            <div *ngIf="errorTop && !loadingTop" class="alert alert-danger">
              Erro ao carregar top produtos.
              <button class="btn btn-link" (click)="carregarTopProdutos(diasSelecionadosTop)">
                Tentar novamente
              </button>
            </div>

            <table *ngIf="!loadingTop && !errorTop && topProdutos.length" class="simple-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th class="text-right">Quantidade vendida</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of topProdutos; let i = index">
                  <td>
                    <span class="rank-badge">{{ i + 1 }}</span>
                    {{ p.productName }}
                  </td>
                  <td class="text-right">{{ p.quantity }}</td>
                </tr>
              </tbody>
            </table>

            <p *ngIf="!loadingTop && !errorTop && !topProdutos.length">
              Não há vendas no período selecionado.
            </p>
          </div>
        </div>
      </div>

      <!-- CARD: ÚLTIMOS PEDIDOS -->
      <div class="card full-width-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Últimos pedidos</h2>
            <p class="card-subtitle">Pedidos mais recentes (todos os status)</p>
          </div>

          <div class="filters">
            <button class="badge-pill" (click)="carregarUltimosPedidos(5)">5</button>
            <button class="badge-pill" (click)="carregarUltimosPedidos(10)">10</button>
          </div>
        </div>

        <div class="card-body">
          <div *ngIf="loadingRecent">
            Carregando últimos pedidos...
          </div>

          <div *ngIf="errorRecent && !loadingRecent" class="alert alert-danger">
            Erro ao carregar últimos pedidos.
            <button class="btn btn-link" (click)="carregarUltimosPedidos(5)">
              Tentar novamente
            </button>
          </div>

          <table
            *ngIf="!loadingRecent && !errorRecent && ultimosPedidos.length"
            class="simple-table"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Data/Hora</th>
                <th>Tipo</th>
                <th>Mesa</th>
                <th>Status</th>
                <th class="text-right">Total (R$)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of ultimosPedidos">
                <td>{{ p.id }}</td>
                <td>{{ p.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ p.creationType }}</td>
                <td>{{ p.tableNumber || '-' }}</td>
                <td>{{ p.status }}</td>
                <td class="text-right">{{ p.total | number:'1.2-2' }}</td>
              </tr>
            </tbody>
          </table>

          <p *ngIf="!loadingRecent && !errorRecent && !ultimosPedidos.length">
            Nenhum pedido encontrado.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Layout geral */
    .dashboard-root {
      padding: 24px;
      background: #f5f7fb;
      min-height: 100vh;
      box-sizing: border-box;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1f2933;
    }

    .page-subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: #6b7280;
    }

    .page-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .period-filters {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }

    /* Botões / badges */
    .btn {
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid transparent;
      background: #1f2933;
      color: #fff;
    }

    .btn-outline {
      background: #fff;
      color: #374151;
      border-color: #d1d5db;
    }

    .btn-outline:disabled {
      opacity: 0.6;
      cursor: default;
    }

    .btn-link {
      background: transparent;
      border: none;
      padding: 0;
      color: #2563eb;
      cursor: pointer;
      font-size: 13px;
    }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      font-size: 11px;
      border-radius: 999px;
      background: #e5e7eb;
      color: #374151;
    }

    .badge-warning {
      background: #fbbf24;
      color: #92400e;
    }

    .badge-pill {
      border-radius: 999px;
      border: 1px solid #d1d5db;
      padding: 4px 10px;
      background: #fff;
      font-size: 12px;
      cursor: pointer;
      color: #4b5563;
    }

    .badge-pill-active {
      background: #2563eb;
      border-color: #2563eb;
      color: #fff;
      font-weight: 500;
    }

    .period-label {
      font-size: 12px;
      color: #6b7280;
      margin-right: 4px;
    }

    /* Cards */
    .cards-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .card-body {
      padding: 16px 18px;
    }

    .card-header {
      padding: 14px 18px 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }

    .card-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .card-subtitle {
      margin: 3px 0 12px;
      font-size: 12px;
      color: #6b7280;
    }

    .summary-card .card-body {
      padding: 14px 16px;
    }

    .card-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .card-value {
      font-size: 22px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .card-helper {
      font-size: 12px;
      color: #9ca3af;
    }

    .full-width-card {
      margin-top: 20px;
      margin-bottom: 24px;
    }

    .grid-two-cols {
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(0, 1.5fr);
      gap: 20px;
    }

    .full-height-card {
      display: flex;
      flex-direction: column;
      min-height: 320px;
    }

    .full-height-card .card-body {
      flex: 1;
    }

    /* Tabelas, gráfico, alerts */

    .chart-wrapper {
      margin-bottom: 16px;
    }

    .payments-chart-wrapper {
      max-width: 340px;
      height: 220px;
      margin-top: 8px;
    }

    .simple-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      font-size: 13px;
    }

    .simple-table th,
    .simple-table td {
      border-bottom: 1px solid #e5e7eb;
      padding: 6px 4px;
      text-align: left;
      color: #374151;
    }

    .simple-table th {
      font-weight: 600;
      background: #f9fafb;
      font-size: 12px;
      text-transform: uppercase;
    }

    .text-right {
      text-align: right;
    }

    .alert {
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      margin: 8px 0 16px;
    }

    .alert-danger {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .rank-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      margin-right: 6px;
      border-radius: 999px;
      background: #2563eb;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
    }

    /* Funil de status */
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 4px;
    }

    .status-pill {
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #374151;
    }

    .status-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .status-value {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }

    .status-recebido {
      border-left: 4px solid #3b82f6;
    }

    .status-preparo {
      border-left: 4px solid #f59e0b;
    }

    .status-pronto {
      border-left: 4px solid #22c55e;
    }

    .status-entregue {
      border-left: 4px solid #10b981;
    }

    .status-cancelado {
      border-left: 4px solid #ef4444;
    }

    /* Pagamentos */
    .payments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 10px;
    }

    .payment-pill {
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      padding: 10px 12px;
      font-size: 13px;
      color: #374151;
    }

    .payment-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 2px;
    }

    .payment-value {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }

    .payment-helper {
      font-size: 12px;
      color: #4b5563;
      margin-top: 2px;
    }

    .payment-pendente {
      border-left: 4px solid #9ca3af;
    }

    .payment-dinheiro {
      border-left: 4px solid #22c55e;
    }

    .payment-cartao {
      border-left: 4px solid #3b82f6;
    }

    .payment-pix {
      border-left: 4px solid #facc15;
    }

    .payment-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #374151;
      border-top: 1px dashed #e5e7eb;
      padding-top: 8px;
      margin-top: 4px;
    }

    .payment-total-row strong {
      font-size: 15px;
      color: #111827;
    }

    /* Responsivo */
    @media (max-width: 900px) {
      .grid-two-cols {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `],
})
export class DashboardComponent implements OnInit {

  resumo?: DashboardResumo;

  vendasPorDia: DashboardVendaDia[] = [];
  topProdutos: DashboardTopProduto[] = [];
  ultimosPedidos: DashboardUltimoPedido[] = [];
  statusResumo?: DashboardStatusResumo;
  pagamentoResumo?: DashboardPagamentoResumo;

  // período geral do dashboard
  periodoDashboard = 1;

  diasSelecionadosVendas = 1;
  diasSelecionadosTop = 1;

  loadingResumo = false;
  errorResumo = false;

  loadingVendas = false;
  errorVendas = false;

  loadingTop = false;
  errorTop = false;

  loadingRecent = false;
  errorRecent = false;

  loadingStatus = false;
  errorStatus = false;

  loadingPagamento = false;
  errorPagamento = false;

  // CONFIGURAÇÃO DO GRÁFICO DE LINHAS
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Faturamento (R$)',
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
      },
    },
  };

  // GRÁFICO DE PAGAMENTO (DOUGHNUT)
  paymentChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Sem dados'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['#d1d5db'],
      },
    ],
  };

  paymentChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.reload();
  }

  /** Altera o período geral do dashboard e recarrega os dados */
  alterarPeriodoDashboard(dias: number): void {
    if (this.periodoDashboard === dias) {
      return;
    }

    this.periodoDashboard = dias;

    // sincroniza os cards de vendas e top produtos
    this.diasSelecionadosVendas = dias;
    this.diasSelecionadosTop = dias;

    // recarrega tudo que depende do período
    this.reloadResumo();
    this.carregarPagamentos();
    this.carregarVendas(this.diasSelecionadosVendas);
    this.carregarTopProdutos(this.diasSelecionadosTop);
    this.carregarUltimosPedidos(5);
    // status continua geral (sem filtro de dias)
  }

  reload(): void {
    this.reloadResumo();
    this.carregarStatusPedidos(this.diasSelecionadosVendas);
    this.carregarPagamentos();
    this.carregarVendas(this.diasSelecionadosVendas);
    this.carregarTopProdutos(this.diasSelecionadosTop);
    this.carregarUltimosPedidos(5);
  }

  reloadResumo(): void {
    this.loadingResumo = true;
    this.errorResumo = false;

    this.dashboardService.getResumo(this.periodoDashboard).subscribe({
      next: (dados) => {
        this.resumo = dados;
        this.loadingResumo = false;
      },
      error: () => {
        this.errorResumo = true;
        this.loadingResumo = false;
      },
    });
  }

  carregarStatusPedidos(dias?: number): void {
    this.loadingStatus = true;
    this.errorStatus = false;

    this.dashboardService.getStatusPedidos(dias).subscribe({
      next: (dados) => {
        this.statusResumo = dados;
        this.loadingStatus = false;
      },
      error: () => {
        this.errorStatus = true;
        this.loadingStatus = false;
      },
    });
  }


  carregarPagamentos(): void {
    this.loadingPagamento = true;
    this.errorPagamento = false;

    this.dashboardService.getPagamentosPorMetodo(this.periodoDashboard).subscribe({
      next: (dados) => {
        this.pagamentoResumo = dados;
        this.loadingPagamento = false;

        const totalQtd = dados.pendente + dados.dinheiro + dados.cartao + dados.pix;

        if (totalQtd === 0) {
          this.paymentChartData = {
            labels: ['Sem dados'],
            datasets: [
              {
                data: [1],
                backgroundColor: ['#d1d5db'],
              },
            ],
          };
        } else {
          this.paymentChartData = {
            labels: ['Pendente', 'Dinheiro', 'Cartão', 'PIX'],
            datasets: [
              {
                data: [dados.pendente, dados.dinheiro, dados.cartao, dados.pix],
                backgroundColor: ['#9ca3af', '#22c55e', '#3b82f6', '#facc15'],
              },
            ],
          };
        }
      },
      error: () => {
        this.errorPagamento = true;
        this.loadingPagamento = false;
      },
    });
  }

  carregarVendas(dias: number): void {
    this.diasSelecionadosVendas = dias;
    this.loadingVendas = true;
    this.errorVendas = false;

    // atualiza o card de status sempre que trocar o período de vendas
    this.carregarStatusPedidos(dias);

    this.dashboardService.getVendasPorDia(dias).subscribe({
      next: (lista) => {
        this.vendasPorDia = lista;
        this.loadingVendas = false;

        const labels = lista.map((v) =>
          new Date(v.date).toLocaleDateString('pt-BR'),
        );
        const valores = lista.map((v) => v.total);

        this.lineChartData = {
          labels,
          datasets: [
            {
              data: valores,
              label: 'Faturamento (R$)',
              fill: false,
              tension: 0.3,
              pointRadius: 3,
            },
          ],
        };
      },
      error: () => {
        this.errorVendas = true;
        this.loadingVendas = false;
      },
    });
  }



  private atualizarGraficoPorDia(lista: DashboardVendaDia[]): void {
    const labels = lista.map((v) =>
      new Date(v.date).toLocaleDateString('pt-BR'),
    );
    const valores = lista.map((v) => v.total);

    this.lineChartData = {
      labels,
      datasets: [
        {
          data: valores,
          label: 'Faturamento (R$)',
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    };
  }

  private atualizarGraficoPorHora(lista: DashboardVendaHora[]): void {
    const labels = lista.map((v) => `${String(v.hour).padStart(2, '0')}:00`);
    const valores = lista.map((v) => v.total);

    this.lineChartData = {
      labels,
      datasets: [
        {
          data: valores,
          label: 'Faturamento por hora (R$)',
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    };
  }


  carregarTopProdutos(dias: number): void {
    this.diasSelecionadosTop = dias;
    this.loadingTop = true;
    this.errorTop = false;

    this.dashboardService.getTopProdutos(dias).subscribe({
      next: (lista) => {
        this.topProdutos = lista;
        this.loadingTop = false;
      },
      error: () => {
        this.errorTop = true;
        this.loadingTop = false;
      },
    });
  }

  carregarUltimosPedidos(limit: number): void {
    this.loadingRecent = true;
    this.errorRecent = false;

    this.dashboardService.getUltimosPedidos(limit).subscribe({
      next: (lista) => {
        this.ultimosPedidos = lista;
        this.loadingRecent = false;
      },
      error: () => {
        this.errorRecent = true;
        this.loadingRecent = false;
      },
    });
  }
}
