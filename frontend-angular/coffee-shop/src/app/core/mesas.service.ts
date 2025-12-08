// src/app/core/mesas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Mesa {
  id: number;
  nome: string;
  status?: 'LIVRE' | 'OCUPADA' | 'FECHADA';
}

export interface ProdutoMesa {
  itemId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface MesaDetalhes {
  numeroMesa: number;
  produtos: ProdutoMesa[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class MesasService {
  private base = `${environment.API_URL}/api/mesas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Mesa[]> {
    return this.http.get<any[]>(this.base).pipe(
      map(list => (list ?? []).map((m, i) => ({
        id: m.id ?? (i + 1),
        nome: m.nome ?? m.name ?? `Mesa ${m.id ?? (i + 1)}`,
        status: (m.status ?? 'LIVRE') as Mesa['status'],
      }))),
      catchError(() => of([...Array(50)].map((_, i) => ({
        id: i + 1,
        nome: `Mesa ${i + 1}`,
        status: 'LIVRE' as const
      }))))
    );
  }

  getDetalhesMesa(numeroMesa: number): Observable<MesaDetalhes> {
    return this.http.get<MesaDetalhes>(`${this.base}/${numeroMesa}/detalhes`);
  }

  encerrarMesa(numeroMesa: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${numeroMesa}/encerrar`, {});
  }

  cancelarItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/itens/${itemId}`);
  }

  /** 🔴 NOVO: mesas ocupadas vindas do backend */
  getMesasOcupadas(): Observable<number[]> {
    return this.http.get<number[]>(`${this.base}/ocupadas`);
  }
}
