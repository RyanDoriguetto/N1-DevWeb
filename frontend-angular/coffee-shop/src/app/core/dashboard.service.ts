import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DashboardResumo,
  DashboardVendaDia,
  DashboardTopProduto,
  DashboardUltimoPedido,
  DashboardStatusResumo,
  DashboardPagamentoResumo,
} from '../shared/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private base = `${environment.API_URL}/api/dashboard`;

  constructor(private http: HttpClient) { }

  getResumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`${this.base}/resumo`);
  }

  getVendasPorDia(dias: number = 7): Observable<DashboardVendaDia[]> {
    return this.http.get<DashboardVendaDia[]>(`${this.base}/vendas-por-dia`, {
      params: { dias },
    });
  }

  getTopProdutos(dias: number = 7): Observable<DashboardTopProduto[]> {
    return this.http.get<DashboardTopProduto[]>(`${this.base}/top-produtos`, {
      params: { dias },
    });
  }

  getUltimosPedidos(limit: number = 5): Observable<DashboardUltimoPedido[]> {
    return this.http.get<DashboardUltimoPedido[]>(`${this.base}/ultimos-pedidos`, {
      params: { limit },
    });
  }

  getStatusPedidos(): Observable<DashboardStatusResumo> {
    return this.http.get<DashboardStatusResumo>(`${this.base}/status-pedidos`);
  }

  getPagamentosPorMetodo(): Observable<DashboardPagamentoResumo> {
    return this.http.get<DashboardPagamentoResumo>(`${this.base}/pagamentos-por-metodo`);
  }
}
