export interface Mensalista {
  id: number;
  nome: string;
  cpfCnpj: string;
  telefone?: string;
  email?: string;
  dataInicio?: string;
  dataVencimento?: string;
  valorMensalidade?: number;
  ativo: boolean;
  placasVeiculos: string[];
}

export interface MensalistaRequest {
  nome: string;
  cpfCnpj: string;
  telefone?: string;
  email?: string;
  dataInicio?: string;
  dataVencimento?: string;
  valorMensalidade?: number;
}
