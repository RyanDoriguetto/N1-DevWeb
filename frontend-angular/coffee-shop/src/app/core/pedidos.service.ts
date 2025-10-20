import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private base = `${environment.API_URL}/api/pedidos`;
  constructor(private http: HttpClient) {}

  // POST /api/pedidos
  // Body: { tableNumber, creationType, items: [{ productId, quantity }] }
  criar(mesaId: number, itens: { productId: number; quantity: number }[]) {
    const body = {
      tableNumber: Number(mesaId),
      creationType: 'MESA',
      items: itens.map(i => ({
        productId: Number(i.productId),
        quantity: Number(i.quantity),
      })),
    };
    return this.http.post(this.base, body);
  }

  // Tenta pegar o pedido ABERTO de uma mesa
  buscarPorMesa(tableNumber: number) {
    const t = Number(tableNumber);

    // 1) endpoint direto
    return this.http.get<any>(`${this.base}/mesa/${t}`, { observe: 'response' }).pipe(
      map(res => res.body),
      // 2) variação comum: /aberto/mesa/{t}
      catchError(_err1 =>
        this.http.get<any>(`${this.base}/aberto/mesa/${t}`, { observe: 'response' }).pipe(
          map(res => res.body),
          // 3) variação com query: ?tableNumber=t
          catchError(_err2 =>
            this.http.get<any>(`${this.base}`, { params: { tableNumber: String(t) }, observe: 'response' }).pipe(
              map(res => {
                const list = Array.isArray(res.body) ? (res.body as any[]) : [];
                return this.pickOpenFromList(list, t);
              }),
              // 4) último fallback: pega tudo e filtra localmente
              catchError(() =>
                this.http.get<any[]>(this.base).pipe(
                  map(list => this.pickOpenFromList(Array.isArray(list) ? list : [], t)),
                  catchError(() => of(null)) // se tudo falhar: mesa livre
                )
              )
            )
          )
        )
      )
    );
  }

  // helper: escolher o pedido aberto da mesa t na lista
  private pickOpenFromList(list: any[], t: number) {
    // reconhecer vários nomes possíveis para o número da mesa
    const getTable = (o: any) => Number(
      o?.tableNumber ??            // camel
      o?.table_number ??           // snake
      o?.mesaNumero ??             // pt-BR camel
      o?.mesa_numero ??            // pt-BR snake
      o?.mesaId ??                 // id da mesa
      o?.mesa ??                   // "mesa"
      o?.table_id ??               // id tabela
      o?.table?.id ??              // aninhado
      o?.table                     // "table"
    );

    // “aberto” = não pago e status NÃO é fechado/pago/cancelado
    const isOpen = (o: any) => {
      const paid = Boolean(o?.paid ?? o?.pago);
      const st = String(o?.status ?? '').toUpperCase();
      return !paid && !['PAGO','FECHADO','CANCELADO','PAID','CLOSED','CANCELED'].includes(st);
    };

    const ofThisTable = list.filter(o => getTable(o) === t);
    const open = ofThisTable
      .filter(isOpen)
      .sort((a: any, b: any) =>
        new Date(b?.createdAt ?? b?.created_at ?? 0).getTime()
        - new Date(a?.createdAt ?? a?.created_at ?? 0).getTime()
      )[0];

    return open ?? null;
  }
}
