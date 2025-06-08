// Este é o seu arquivo central de tipos.
// Manter todos os "contratos" de dados aqui ajuda a organizar e a manter a consistência do seu aplicativo.

// --- Tipos para os Modelos do seu Backend ---

/**
 * Representa a estrutura de um objeto Cliente,
 * correspondendo ao que o seu backend Java envia e recebe.
 */
export interface Cliente {
  id_cliente: number; // Chave primária
  nome: string;
  telefone?: string; // O '?' indica que o campo é opcional
  cpf?: string;
  endereco?: string;
}

/**
 * Representa a estrutura de um objeto Fornecedor.
 */
export interface Fornecedor {
  id_fornecedor: number;
  nome: string;
  telefone?: string;
  endereco?: string;
  cnpj?: string;
}

/**
 * Representa a estrutura de um objeto Produto.
 */
export interface Produto {
  id_produto: number;
  nome: string;
  codigo: string;
  quantidade: number;
  descricao?: string;
  categoria?: string;
  valor?: number;
}


// --- Tipo para a Navegação (React Navigation) ---

/**
 * Define todas as telas do seu navegador principal e quais parâmetros
 * cada uma delas espera receber. Isso tipa automaticamente as props
 * 'route' e 'navigation' em cada tela, eliminando o 'any'.
 *
 * `undefined` significa que a tela não recebe parâmetros.
 */
export type RootStackParamList = {
  Login: undefined;
  PrincipalMenu: undefined;
  Relatorios: undefined;

  // Rota de Clientes
  Clientes: undefined;
  CadastroCliente: {
    clienteExistente?: Cliente; // Parâmetro opcional para edição
    onSalvar: (cliente: Cliente) => void; // Callback obrigatório
    onExcluir?: (id: number) => void; // Callback opcional para exclusão
  };

  // Rota de Fornecedores
  Fornecedores: undefined;
  CadastroFornecedor: {
    fornecedorExistente?: Fornecedor;
    onSalvar: (fornecedor: Fornecedor) => void;
    onExcluir?: (id: number) => void;
  };

  // Rota de Produtos
  Produtos: undefined;
  CadastroProduto: {
    produtoExistente?: Produto;
    onSalvar: (produto: Produto) => void;
    onExcluir?: (id: number) => void;
  };

  // Adicione outras telas aqui...
  // Ex: Movimentacoes: undefined;
};
