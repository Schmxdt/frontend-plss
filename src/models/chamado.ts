export type Chamado = {
  id?: number;
  titulo?: string;
  descricao?: string;
  situacao_id?: number | string;
  categoria_id?: number | string;
  data_criacao?: Date;
  data_solucao?: Date;
}