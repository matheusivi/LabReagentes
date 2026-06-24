export interface Reagente {
  id?: number;
  nome: string;
  fabricante: string;
  lote: string;
  validade: string;
  quantidade: string;
  localizacao: string;
  observacoes: string;
  foto: string | null;
}

export type StatusReagente = "ok" | "vencendo" | "vencido";

export type RootStackParamList = {
  Home: undefined;
  Form: { id?: number };
  Detail: { id: number };
};
