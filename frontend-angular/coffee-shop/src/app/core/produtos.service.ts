import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map, catchError, throwError } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  descricao?: string;
  ativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  // se o seu backend for /api/products, troque para '/api/products'
  private base = `${environment.API_URL}/api/produtos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<any[]>(this.base).pipe(
      map(items => (items ?? []).map(i => ({
        id: i.id,
        nome: i.nome ?? i.name,
        preco: i.preco ?? i.price,
        descricao: i.descricao ?? i.description,
        ativo: i.ativo ?? i.active ?? i.available, // <- cobre 'available'
      })))
    );
  }

  create(input: {
    nome: string;
    preco: number;
    descricao?: string;
    ativo?: boolean;
    categoria: string;
    preparoMin?: number;
  }) {
    const body = {
      name: (input.nome ?? '').trim(),
      price: Number(input.preco ?? 0),
      description: (input.descricao ?? '').trim(),
      available: input.ativo ?? true,
      category: (input.categoria ?? '').trim().toUpperCase(), // CAFE | BEBIDA | COMIDA | SOBREMESA
      prepTimeMin: Number(input.preparoMin ?? 0),
    };
    return this.http.post(`${this.base}`, body);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  // Fallback: se 405/404 em GET /:id, busca a lista e encontra localmente
  buscarPorId(id: number) {
    return this.http.get<any>(`${this.base}/${id}`, { observe: 'response' }).pipe(
      map(res => res.body),
      catchError(err => {
        if (err.status === 405 || err.status === 404) {
          return this.http.get<any[]>(this.base).pipe(
            map(list => {
              const found = (list ?? []).find(p => p.id === id);
              if (!found) throw err;
              return found;
            })
          );
        }
        return throwError(() => err);
      })
    );
  }

  atualizar(id: number, input: {
    nome: string; preco: number; descricao?: string; ativo?: boolean;
    categoria: string; preparoMin?: number;
  }) {
    const body = {
      name: (input.nome ?? '').trim(),
      price: Number(input.preco ?? 0),
      description: (input.descricao ?? '').trim(),
      available: input.ativo ?? true,
      category: (input.categoria ?? '').trim().toUpperCase(),
      prepTimeMin: Number(input.preparoMin ?? 0),
    };
    return this.http.put(`${this.base}/${id}`, body);
  }
}
