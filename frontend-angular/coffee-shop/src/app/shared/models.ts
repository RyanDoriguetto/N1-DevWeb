export type Role = 'ADMIN' | 'CAIXA' | 'ATENDENTE';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  role: Role;
}

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  descricao?: string;
  ativo?: boolean;
}

/**
 * Resumo geral do dashboard que o backend devolve em /api/dashboard/resumo
 */
export interface DashboardResumo {
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
  totalOpenOrders: number;
  totalProducts: number;
}

/**
 * Vendas agregadas por dia (endpoint /api/dashboard/vendas-por-dia)
 */
export interface DashboardVendaDia {
  date: string;   // "YYYY-MM-DD"
  total: number;  // valor vendido nesse dia
}

export interface DashboardTopProduto {
  productName: string;
  quantity: number;
}

export interface DashboardUltimoPedido {
  id: number;
  creationType: string;          // BALCAO | MESA
  tableNumber: number | null;
  total: number;
  status: string;
  createdAt: string;             // ISO string
}

export interface DashboardStatusResumo {
  recebido: number;
  emPreparo: number;
  pronto: number;
  entregue: number;
  cancelado: number;
}

export interface DashboardPagamentoResumo {
  pendente: number;
  dinheiro: number;
  cartao: number;
  pix: number;
  totalDinheiro: number;
  totalCartao: number;
  totalPix: number;
  totalGeral: number;
}

export interface DashboardVendaHora {
  hour: number;
  total: number;
}

