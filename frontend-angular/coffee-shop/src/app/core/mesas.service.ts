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

// ADICIONE ESTAS INTERFACES PARA OS NOVOS DADOS
export interface ProdutoMesa {
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

  constructor(private http: HttpClient) { }

  listar(): Observable<Mesa[]> {
    return this.http.get<any[]>(this.base).pipe(
      map(list => (list ?? []).map((m, i) => ({
        id: m.id ?? (i + 1),
        nome: m.nome ?? m.name ?? `Mesa ${m.id ?? (i + 1)}`,
        status: (m.status ?? 'LIVRE') as Mesa['status'],
      }))),
      // Fallback: se 404/405/500 ou sem backend, simula 50 mesas
      catchError(() => of([...Array(50)].map((_, i) => ({
        id: i + 1,
        nome: `Mesa ${i + 1}`,
        status: 'LIVRE' as const
      }))))
    );
  }

  // ADICIONE ESTES DOIS NOVOS MÉTODOS:

  getDetalhesMesa(numeroMesa: number): Observable<MesaDetalhes> {
    return this.http.get<MesaDetalhes>(`${this.base}/${numeroMesa}/detalhes`);
  }

  encerrarMesa(numeroMesa: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${numeroMesa}/encerrar`, {});
  }
}
