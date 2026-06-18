export type StatusAcesso = 'ABERTO' | 'FECHADO';

export interface RegistroAcesso {
  id: number;
  placaDetectada: string;
  veiculoId?: number;
  modeloVeiculo?: string;
  mensalista: boolean;
  dataHoraEntrada: string;
  dataHoraSaida?: string;
  fotoEntradaUrl?: string;
  fotoSaidaUrl?: string;
  valorCobrado?: number;
  status: StatusAcesso;
}

export interface OcrResponse {
  placa: string | null;
  textoBruto: string;
  confianca: number;
}
