import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutosService } from '../../core/produtos.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <header class="topbar">
      <h2>Novo Produto</h2>
    </header>

    <form class="form" [formGroup]="form" (ngSubmit)="salvar()">
      <label>Nome
        <input type="text" formControlName="nome" />
      </label>

      <label>Preço (R$)
        <input type="number" step="0.01" formControlName="preco" />
      </label>

      <label>Descrição
        <textarea rows="3" formControlName="descricao"></textarea>
      </label>

      <label>Categoria
        <select formControlName="categoria">
          <option *ngFor="let c of categorias" [value]="c">{{ c }}</option>
        </select>
      </label>

      <label>Tempo de preparo (min)
        <input type="number" step="1" formControlName="preparoMin" />
      </label>

      <label class="chk">
        <input type="checkbox" formControlName="ativo" /> Ativo
      </label>

      <div class="actions">
        <button type="button" class="ghost" (click)="cancelar()">Cancelar</button>
        <button type="submit" [disabled]="form.invalid || salvando">Salvar</button>
      </div>

      <p *ngIf="erro" class="err">Falha ao salvar. Tente novamente.</p>
    </form>
  `,
  styles: [`
    .topbar{padding:12px 16px;border-bottom:1px solid #eee}
    .form{max-width:520px;margin:16px auto;display:flex;flex-direction:column;gap:12px}
    label{display:flex;flex-direction:column;gap:6px}
    input, textarea, select{padding:10px;border:1px solid #ddd;border-radius:10px}
    .chk{flex-direction:row;align-items:center;gap:8px}
    .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}
    button{padding:10px 14px;border:0;border-radius:10px;background:#111;color:#fff;cursor:pointer}
    .ghost{background:#f2f2f2;color:#111}
    .err{color:#b00020}
  `]
})
export class ProdutosNovoComponent {
  // Enum aceito pelo backend: CAFE, BEBIDA, COMIDA, SOBREMESA
  readonly categorias = ['CAFE', 'BEBIDA', 'COMIDA', 'SOBREMESA'] as const;

  salvando = false;
  erro = false;

  form: FormGroup = new FormGroup({
    nome: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    preco: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
    descricao: new FormControl<string>('', { nonNullable: true }),
    ativo: new FormControl<boolean>(true, { nonNullable: true }),
    categoria: new FormControl<string>('BEBIDA', { nonNullable: true, validators: [Validators.required] }),
    preparoMin: new FormControl<number | null>(0, { validators: [Validators.min(0)] }),
  });

  constructor(private api: ProdutosService, private router: Router) {}

  salvar() {
    if (this.form.invalid || this.salvando) return;
    this.salvando = true;
    this.erro = false;

    const v = this.form.value as {
      nome: string; preco: number; descricao?: string; ativo?: boolean;
      categoria: string; preparoMin?: number;
    };

    this.api.create(v).subscribe({
      next: () => this.router.navigateByUrl('/produtos'),
      error: () => { this.erro = true; this.salvando = false; },
    });
  }

  cancelar() { this.router.navigateByUrl('/produtos'); }
}
