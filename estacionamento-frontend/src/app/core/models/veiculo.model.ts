export type TipoVeiculo = 'CARRO' | 'MOTO' | 'CAMINHONETE' | 'OUTRO';

export interface Veiculo {
  id: number;
  placa: string;
  marca?: string;
  modelo?: string;
  cor?: string;
  tipo: TipoVeiculo;
  fotoUrl?: string;
  mensalistaId?: number;
  mensalistaNome?: string;
  mensalista: boolean;
}

export interface VeiculoRequest {
  placa: string;
  marca?: string;
  modelo?: string;
  cor?: string;
  tipo: TipoVeiculo;
  mensalistaId?: number | null;
}
