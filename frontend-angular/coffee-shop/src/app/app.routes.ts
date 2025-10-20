import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'produtos' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent),
  },

  {
    path: 'produtos',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'CAIXA', 'ATENDENTE'] },
    loadComponent: () =>
      import('./features/produtos/produtos-home.component').then(m => m.ProdutosHomeComponent),
  },

  // estática ANTES da rota com parâmetro
  {
    path: 'produtos/novo',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/produtos/produtos-novo.component').then(m => m.ProdutosNovoComponent),
  },

  {
    path: 'produtos/:id/editar',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () =>
      import('./features/produtos/produtos-editar.component').then(m => m.ProdutosEditarComponent),
  },

  {
    path: 'mesas',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'CAIXA', 'ATENDENTE'] },
    loadComponent: () =>
      import('./features/mesas/mesas.component').then(m => m.MesasComponent),
  },

  {
    path: 'cardapio/:mesaId',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'CAIXA', 'ATENDENTE'] },
    loadComponent: () =>
      import('./features/cardapio/cardapio.component').then(m => m.CardapioComponent),
  },

  {
    path: 'mesas/:mesaId/pedido',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'CAIXA', 'ATENDENTE'] },
    loadComponent: () =>
      import('./features/pedido/pedido-mesa.component').then(m => m.PedidoMesaComponent),
  },



  { path: '**', redirectTo: 'produtos' },
];
