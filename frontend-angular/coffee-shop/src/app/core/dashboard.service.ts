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
  DashboardVendaHora,
} from '../shared/models';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private base = `${environment.API_URL}/api/dashboard`;

  constructor(private http: HttpClient) { }

  getResumo(dias?: number): Observable<DashboardResumo> {
    const options = dias
      ? { params: { dias } as any }
      : {};

    return this.http.get<DashboardResumo>(`${this.base}/resumo`, options);
  }

  getVendasPorDia(dias: number = 7): Observable<DashboardVendaDia[]> {
    return this.http.get<DashboardVendaDia[]>(`${this.base}/vendas-por-dia`, {
      params: { dias },
    });
  }

  getVendasPorHora(): Observable<DashboardVendaHora[]> {
    return this.http.get<DashboardVendaHora[]>(`${this.base}/vendas-por-hora`);
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

  getStatusPedidos(dias?: number): Observable<DashboardStatusResumo> {
    if (dias && dias > 0) {
      return this.http.get<DashboardStatusResumo>(`${this.base}/status-pedidos`, {
        params: { dias },
      });
    }

    // se não passar dias, continua funcionando como antes (todos)
    return this.http.get<DashboardStatusResumo>(`${this.base}/status-pedidos`);
  }



  getPagamentosPorMetodo(dias?: number): Observable<DashboardPagamentoResumo> {
    const options = dias
      ? { params: { dias } as any }
      : {};

    return this.http.get<DashboardPagamentoResumo>(`${this.base}/pagamentos-por-metodo`, options);
  }
}
