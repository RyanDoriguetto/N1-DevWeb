import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1>Coffee Shop</h1>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>E-mail
          <input type="email" formControlName="email" />
        </label>

        <label>Senha
          <input type="password" formControlName="password" />
        </label>

        <button type="submit" [disabled]="form.invalid">Entrar</button>
      </form>

      <p *ngIf="error" class="err">Falha no login. Confira e-mail/senha.</p>
    </div>
  `,
  styles: [`
    .container{max-width:360px;margin:60px auto;display:flex;flex-direction:column;gap:12px}
    form{display:flex;flex-direction:column;gap:8px}
    label{display:flex;flex-direction:column;gap:4px;font-size:14px}
    input{padding:8px;border:1px solid #ccc;border-radius:8px}
    button{padding:10px;border:0;border-radius:8px;cursor:pointer;background:#111;color:#fff}
    .err{color:#b00020}
  `]
})
export class LoginComponent {
  error = false;

  form: FormGroup = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  submit() {
    if (this.form.invalid) return;
    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigateByUrl('/produtos'),
      error: () => this.error = true,
    });
  }
}
