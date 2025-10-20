import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../core/pedidos.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <h2>Pedido da Mesa {{ mesaId }}</h2>
    </header>

    <section *ngIf="loading" class="msg">Carregando pedido...</section>
    <section *ngIf="erro" class="msg err">Falha ao carregar pedido.</section>

    <ng-container *ngIf="!loading && !erro">
      <div *ngIf="!pedido" class="msg">Nenhum pedido aberto para esta mesa.</div>

      <div *ngIf="pedido" class="box">
        <div class="row"><b>Status:</b> {{ pedido.status ?? '—' }}</div>
        <div class="row"><b>Pago:</b> {{ (pedido.paid ?? pedido.pago) ? 'Sim' : 'Não' }}</div>
        <div class="row"><b>Método:</b> {{ pedido.paymentMethod ?? '—' }}</div>
        <div class="row"><b>Criado em:</b> {{ (pedido.createdAt ?? pedido.created_at) | date:'dd/MM/yyyy HH:mm' }}</div>

        <h3>Itens</h3>
        <ul class="lista" *ngIf="itens.length; else vazio">
          <li *ngFor="let it of itens">
            <div class="nome">{{ it.nome }}</div>
            <div class="qtdxpreco">{{ it.qtd }} × R$ {{ it.preco | number:'1.2-2' }}</div>
            <div class="sub">R$ {{ (it.qtd * it.preco) | number:'1.2-2' }}</div>
          </li>
        </ul>
        <ng-template #vazio><div class="msg">Sem itens.</div></ng-template>

        <div class="total">
          Total: <b>R$ {{ total | number:'1.2-2' }}</b>
        </div>

        <!-- ===== DEBUG ===== -->
        <details class="debug">
          <summary>Debug: ver JSON do pedido</summary>
          <pre>{{ pedido | json }}</pre>
        </details>
        <!-- ================= -->
      </div>
    </ng-container>
  `,
  styles: [`
    .topbar{padding:12px 16px;border-bottom:1px solid #eee}
    .msg{padding:16px}.err{color:#b00020}
    .box{padding:16px}
    .row{margin:4px 0}
    .lista{list-style:none;padding:0;margin:8px 0;display:grid;gap:8px}
    .lista li{border:1px solid #eee;border-radius:12px;padding:10px;display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center}
    .nome{font-weight:600}
    .qtdxpreco{opacity:.9}
    .total{margin-top:12px;font-size:18px}
    .debug{margin-top:16px;background:#fafafa;border:1px dashed #ddd;padding:8px;border-radius:8px}
    .debug pre{white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.3}
  `]
})
export class PedidoMesaComponent implements OnInit {
  mesaId!: number;
  loading = true; erro = false;
  pedido: any = null;

  itens: { nome: string; qtd: number; preco: number }[] = [];
  total = 0;

  ngOnInit(): void {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.pedidos.buscarPorMesa(this.mesaId).subscribe({
      next: (p) => {
        this.pedido = p;
        console.debug('[PedidoMesa] pedido recebido:', p); // <-- LOG
        this.mapearItens();
        this.loading = false;
      },
      error: (e) => { console.error('[PedidoMesa] erro:', e); this.erro = true; this.loading = false; }
    });
  }

  constructor(private route: ActivatedRoute, private pedidos: PedidosService) {}

  private mapearItens() {
    const itemsArr =
      this.pedido?.items ??
      this.pedido?.itens ??
      this.pedido?.orderItems ??
      this.pedido?.order_items ??
      [];

    console.debug('[PedidoMesa] items fonte:', itemsArr); // <-- LOG

    this.itens = (Array.isArray(itemsArr) ? itemsArr : []).map((it: any) => {
      const nome =
        it?.product?.nome ?? it?.product?.name ??
        it?.productName ?? it?.nome ?? it?.name ?? 'Produto';
      const qtd = Number(it?.quantity ?? it?.qtd ?? it?.quantidade ?? 0);
      const preco = Number(
        it?.unitPrice ?? it?.unit_price ??
        it?.price ?? it?.preco ??
        it?.product?.preco ?? it?.product?.price ?? 0
      );
      return { nome, qtd, preco };
    });

    this.total = Number(this.pedido?.total ??
      this.itens.reduce((s, x) => s + x.qtd * x.preco, 0));

    console.debug('[PedidoMesa] itens mapeados:', this.itens, 'total:', this.total); // <-- LOG
  }
}
