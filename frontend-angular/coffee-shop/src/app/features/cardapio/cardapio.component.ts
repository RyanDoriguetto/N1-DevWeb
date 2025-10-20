import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutosService, Produto } from '../../core/produtos.service';
import { PedidosService } from '../../core/pedidos.service';

type Item = { produto: Produto; qtd: number };

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <h2>Cardápio — Mesa {{ mesaId }}</h2>
    </header>

    <section *ngIf="loading" class="msg">Carregando produtos...</section>
    <section *ngIf="error" class="msg err">Falha ao carregar produtos.</section>

    <div class="layout" *ngIf="!loading && !error">
      <div class="col">
        <h3>Produtos</h3>

        <div *ngIf="produtosDisponiveis.length === 0" class="msg">
          Nenhum produto disponível no momento.
        </div>

        <ul class="lista" *ngIf="produtosDisponiveis.length > 0">
          <li *ngFor="let p of produtosDisponiveis">
            <div class="nome">{{ p.nome }}</div>
            <div class="preco">R$ {{ p.preco | number:'1.2-2' }}</div>
            <button (click)="add(p)">Adicionar</button>
          </li>
        </ul>
      </div>

      <div class="col">
        <h3>Pedido (local)</h3>

        <div *ngIf="itens.length === 0" class="msg">Nenhum item ainda.</div>

        <ul class="lista" *ngIf="itens.length">
          <li *ngFor="let it of itens; index as i">
            <div class="nome">{{ it.produto.nome }}</div>
            <div class="preco">R$ {{ it.produto.preco | number:'1.2-2' }}</div>
            <div class="qtd">
              <button (click)="dec(i)">-</button>
              <span>{{ it.qtd }}</span>
              <button (click)="inc(i)">+</button>
              <button class="danger" (click)="rm(i)">Remover</button>
            </div>
          </li>
        </ul>

        <div class="total" *ngIf="itens.length">
          Total: <b>R$ {{ total | number:'1.2-2' }}</b>
        </div>

        <div class="actions" *ngIf="itens.length">
          <button class="ghost" type="button" (click)="limpar()" [disabled]="confirmando">Limpar</button>

          <button class="primary" type="button"
                  (click)="confirmar()"
                  [disabled]="confirmando || !itens.length">
            {{ confirmando ? 'Enviando...' : 'Confirmar pedido' }}
          </button>

          <span *ngIf="ok" class="ok">Pedido enviado!</span>
          <span *ngIf="erroSalvar" class="err">Falha ao enviar pedido. {{ erroSalvarMsg }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .topbar{padding:12px 16px;border-bottom:1px solid #eee}
    .msg{padding:16px}.err{color:#b00020}
    .ok{color:#0a7;margin-left:8px}
    .layout{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px}
    .col h3{margin:0 0 8px 0}
    .lista{list-style:none;margin:0;padding:0;display:grid;gap:8px}
    .lista li{border:1px solid #eee;border-radius:12px;padding:12px;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}
    .nome{font-weight:600}
    .preco{opacity:.9}
    button{padding:6px 10px;border:0;border-radius:8px;background:#111;color:#fff;cursor:pointer}
    .qtd{display:flex;gap:8px;align-items:center;justify-content:flex-end}
    .qtd button{padding:4px 8px}
    .danger{background:#c62828}
    .primary{background:#0a7}
    .ghost{background:#f2f2f2;color:#111}
    .total{margin-top:12px;font-size:18px}
    .actions{margin-top:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    @media (max-width: 900px){ .layout{grid-template-columns:1fr} }
  `]
})
export class CardapioComponent implements OnInit {
  mesaId!: number;
  produtos: Produto[] = [];
  produtosDisponiveis: Produto[] = [];
  itens: Item[] = [];
  loading = true; error = false;
  total = 0;

  confirmando = false;
  erroSalvar = false;
  erroSalvarMsg = '';
  ok = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtosApi: ProdutosService,
    private pedidosApi: PedidosService
  ) {}

  ngOnInit(): void {
    this.mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    this.produtosApi.listar().subscribe({
      next: ps => {
        this.produtos = ps;
        // Só produtos ativos
        this.produtosDisponiveis = ps.filter(p => p.ativo !== false);
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  add(p: Produto) {
    const idx = this.itens.findIndex(it => it.produto.id === p.id);
    if (idx >= 0) this.itens[idx].qtd++;
    else this.itens.push({ produto: p, qtd: 1 });
    this.recalc();
  }
  inc(i: number) { this.itens[i].qtd++; this.recalc(); }
  dec(i: number) { this.itens[i].qtd = Math.max(1, this.itens[i].qtd - 1); this.recalc(); }
  rm(i: number) { this.itens.splice(i,1); this.recalc(); }
  limpar() { this.itens = []; this.recalc(); }

  confirmar() {
    if (!this.itens.length || this.confirmando) return;
    this.confirmando = true; this.erroSalvar = false; this.ok = false; this.erroSalvarMsg = '';

    const payload = this.itens
      .filter(it => (it.qtd ?? 0) > 0 && it.produto.id != null)
      .map(it => ({ productId: it.produto.id as number, quantity: it.qtd }));

    this.pedidosApi.criar(this.mesaId, payload).subscribe({
      next: () => {
        this.ok = true;
        this.confirmando = false;
        this.itens = [];
        this.recalc();
        // Marca otimista e volta para /mesas (para pintar a mesa como OCUPADA)
        localStorage.setItem('mesaOcupada', String(this.mesaId));
        this.router.navigateByUrl('/mesas');
      },
      error: (err) => {
        this.erroSalvar = true;
        // mostra mensagem detalhada do backend se existir
        this.erroSalvarMsg = err?.error?.message
          ?? (typeof err?.error === 'string' ? err.error : JSON.stringify(err?.error ?? ''));
        this.confirmando = false;
      }
    });
  }

  private recalc() {
    this.total = this.itens.reduce((s,it) => s + (it.produto.preco * it.qtd), 0);
  }
}
