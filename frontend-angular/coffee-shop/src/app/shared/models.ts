export type Role = 'ADMIN' | 'CAIXA' | 'ATENDENTE';

export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { accessToken: string; role: Role; }

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
  descricao?: string;
  ativo?: boolean;
}
