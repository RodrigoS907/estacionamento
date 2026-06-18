export type Papel = 'ADMIN' | 'OPERADOR';

export interface UsuarioLogado {
  nome: string;
  email: string;
  papel: Papel;
}
