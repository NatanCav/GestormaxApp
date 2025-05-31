import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Usando MaterialIcons consistentemente
import { LinearGradient } from 'expo-linear-gradient';

// Cores do gradiente e cor sólida (mantendo a consistência)
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

// Dados de exemplo (mock) para movimentações
const MOCK_MOVIMENTACOES = [
  {
    id: 'mov1',
    tipo: 'entrada', // 'entrada' ou 'saida'
    data: '30/05/2024',
    produtoNome: 'Vodka',
    fornecedorNome: 'Aluízio Bebidas',
    quantidade: 100,
    valorTotal: 1500,
    observacao: 'Reposição de estoque.'
  },
  {
    id: 'mov2',
    tipo: 'saida',
    data: '31/05/2024',
    pedidoId: 'PED-2024-00123',
    clienteNome: 'Pinga Indústria',
    vendedorNome: 'Mariana Silva',
    itensDescricao: ['Vodka (50 un)', 'Pitu (20 un)'],
    valorTotal: 950.00,
    observacao: 'Pedido urgente para cliente prioritário.'
  },
  {
    id: 'mov3',
    tipo: 'entrada',
    data: '01/06/2024',
    produtoNome: 'Mochila tática',
    fornecedorNome: 'Distribuidora Central',
    quantidade: 20,
    valorTotal: 780.50,
    observacao: 'Reposição de estoque'
  },
   {
    id: 'mov4',
    tipo: 'saida',
    data: '02/06/2024',
    pedidoId: 'PED-2024-00124',
    clienteNome: 'Jonas Oliveira.',
    vendedorNome: 'Ricardo Alves',
    itensDescricao: ['Pitu (10 un)'],
    valorTotal: 100.00,
    observacao: 'Venda balcão.'
  },
];

// Componente para o card de cada movimentação
const MovimentacaoCard = ({ movimentacao, onPress }) => {
  const ehEntrada = movimentacao.tipo === 'entrada';

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {/* Cabeçalho do Card com Ícone, Data e Tipo */}
      <View style={styles.cardHeader}>
        <MaterialIcons
          name={ehEntrada ? "arrow-downward" : "arrow-upward"} // Ícone de entrada ou saída
          size={24}
          color={ehEntrada ? '#27ae60' : '#c0392b'} // Verde para entrada, Vermelho para saída
        />
        <Text style={styles.cardData}>{movimentacao.data}</Text>
        <Text style={[styles.cardTipo, { color: ehEntrada ? '#27ae60' : '#c0392b' }]}>
          {ehEntrada ? 'ENTRADA' : 'SAÍDA'}
        </Text>
      </View>

      {/* Conteúdo específico para ENTRADA */}
      {ehEntrada && (
        <View style={styles.cardConteudo}>
          <Text style={styles.cardTituloProduto}>{movimentacao.produtoNome}</Text>
          <Text style={styles.cardSubtitulo}>Fornecedor: <Text style={styles.cardSubtituloDestaque}>{movimentacao.fornecedorNome}</Text></Text>
          <View style={styles.detalhesValorContainer}>
            <Text style={styles.cardLabel}>
              Qtde: <Text style={styles.cardValorDestaque}>{movimentacao.quantidade}</Text>
            </Text>
            <Text style={styles.cardValorPrincipalEntrada}>
              Valor: R$ {movimentacao.valorTotal.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>
      )}

      {/* Conteúdo específico para SAÍDA */}
      {!ehEntrada && (
        <View style={styles.cardConteudo}>
          <Text style={styles.cardTituloPedido}>Pedido: {movimentacao.pedidoId}</Text>
          <Text style={styles.cardSubtituloProeminente}>Cliente: <Text style={styles.cardSubtituloDestaque}>{movimentacao.clienteNome}</Text></Text>
          <Text style={styles.cardSubtituloProeminente}>Vendedor: <Text style={styles.cardSubtituloDestaque}>{movimentacao.vendedorNome}</Text></Text>
           <Text style={styles.cardValorPrincipalSaida}>
            Total: R$ {movimentacao.valorTotal.toFixed(2).replace('.', ',')}
          </Text>
          {/* <Text style={styles.cardLabelMenor}>Itens: {movimentacao.itensDescricao.join(', ')}</Text> */}
        </View>
      )}
      {/* Observação comum para ambos */}
      {movimentacao.observacao && <Text style={styles.cardObservacao}>Obs: {movimentacao.observacao}</Text>}
    </TouchableOpacity>
  );
};

// Componente para quando a lista estiver vazia
const ListaVaziaComponente = ({ tipoFiltro }) => (
  <View style={styles.listaVaziaContainer}>
    <MaterialIcons name="receipt-long" size={100} color="#D0D0D0" />
    <Text style={styles.listaVaziaTexto}>Nenhuma movimentação de {tipoFiltro === 'entrada' ? 'entrada' : 'saída'} encontrada.</Text>
    <Text style={styles.listaVaziaSubtexto}>Use o botão '+' para adicionar uma nova movimentação.</Text>
  </View>
);

// Tela Principal de Movimentações
export default function MovimentacoesScreen({ navigation }) {

  const [filtroSelecionado, setFiltroSelecionado] = useState('entrada'); // 'entrada' ou 'saida'
  const [movimentacoes, setMovimentacoes] = useState(MOCK_MOVIMENTACOES); // Estado para todas as movimentações
  const [movimentacoesFiltradas, setMovimentacoesFiltradas] = useState([]); // Estado para movimentações após filtro

  // Efeito para filtrar as movimentações quando o filtro ou a lista principal mudam
  useEffect(() => {
    const filtradas = movimentacoes.filter(m => m.tipo === filtroSelecionado)
                                  .sort((a, b) => new Date(b.data.split('/').reverse().join('-')) - new Date(a.data.split('/').reverse().join('-'))); // Ordena por data mais recente
    setMovimentacoesFiltradas(filtradas);
  }, [filtroSelecionado, movimentacoes]);

  // Função para voltar para a tela anterior
  const handleVoltar = () => {
    navigation.goBack();
  };

  // Função para navegar para a tela de nova movimentação
  const handleNovaMovimentacao = () => {
    // Navega para a tela de CadastroMovimentacao (a ser criada)
    navigation.navigate('CadastroMovimentacao', {
      // Pode-se passar o tipo de movimentação padrão baseado no filtro atual
      // tipoInicial: filtroSelecionado,
      onSalvar: (novaMovimentacao) => {
        // Adiciona a nova movimentação à lista principal e reordena
        setMovimentacoes(prev => [
            { ...novaMovimentacao, id: String(Date.now()), data: new Date().toLocaleDateString('pt-BR') }, // Garante ID e data
            ...prev
        ]);
      }
    });
  };

  // Função para lidar com o clique em uma movimentação (para ver detalhes ou editar)
  const handleVerMovimentacao = (movimentacao) => {
    console.log("Detalhes da movimentação:", movimentacao.id);
    // Exemplo: navigation.navigate('DetalhesMovimentacao', { movimentacaoId: movimentacao.id });
    // Ou para editar:
    navigation.navigate('CadastroMovimentacao', {
        movimentacaoExistente: movimentacao,
        onSalvar: (movimentacaoAtualizada) => {
            setMovimentacoes(prevMovimentacoes =>
                prevMovimentacoes.map(m =>
                    m.id === movimentacaoAtualizada.id ? movimentacaoAtualizada : m
                )
            );
        }
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] /* Cor superior do gradiente */ }}>
      <LinearGradient
        colors={gradientColors}
        style={styles.containerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Cabeçalho da Tela */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleVoltar}>
            <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Movimentações</Text>
          <View style={{ width: 28 }} /> {/* Espaçador para centralizar o título */}
        </View>

        {/* Área de Conteúdo Principal (branca com bordas arredondadas) */}
        <View style={styles.contentArea}>
          {/* Container dos Botões de Filtro */}
          <View style={styles.filtroContainer}>
            <TouchableOpacity
              style={[styles.botaoFiltro, filtroSelecionado === 'entrada' && styles.botaoFiltroAtivo]}
              onPress={() => setFiltroSelecionado('entrada')}
            >
              <MaterialIcons name="arrow-downward" size={20} color={filtroSelecionado === 'entrada' ? '#FFFFFF' : solidBlue} />
              <Text style={[styles.textoBotaoFiltro, filtroSelecionado === 'entrada' && styles.textoBotaoFiltroAtivo]}>
                Entradas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoFiltro, filtroSelecionado === 'saida' && styles.botaoFiltroAtivo]}
              onPress={() => setFiltroSelecionado('saida')}
            >
              <MaterialIcons name="arrow-upward" size={20} color={filtroSelecionado === 'saida' ? '#FFFFFF' : solidBlue} />
              <Text style={[styles.textoBotaoFiltro, filtroSelecionado === 'saida' && styles.textoBotaoFiltroAtivo]}>
                Saídas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Movimentações */}
          <FlatList
            data={movimentacoesFiltradas}
            renderItem={({ item }) => (
              <MovimentacaoCard
                movimentacao={item}
                onPress={() => handleVerMovimentacao(item)}
              />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={<ListaVaziaComponente tipoFiltro={filtroSelecionado} />}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} // Garante que o empty state ocupe espaço
            showsVerticalScrollIndicator={false}
          />

          {/* Botão para Adicionar Nova Movimentação */}
          <TouchableOpacity style={styles.botaoAdicionar} onPress={handleNovaMovimentacao}>
            <MaterialIcons name="add" size={28} color="white" />
            <Text style={styles.textoBotaoAdicionar}>Nova Movimentação</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  containerGradient: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 35 : 15, // Ajuste para status bar do Android
  },
  headerTitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentArea: { // Área branca principal
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#f0f0f0', // Fundo sutil para o container dos botões
    borderRadius: 10,
    padding: 5,
  },
  botaoFiltro: {
    flex: 1, // Para ocupar espaço igual
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 3, // Pequeno espaço entre os botões
  },
  botaoFiltroAtivo: {
    backgroundColor: solidBlue, // Cor de fundo do botão ativo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBotaoFiltro: {
    fontSize: 16,
    fontWeight: '600',
    color: solidBlue, // Cor do texto do botão inativo
    marginLeft: 8,
  },
  textoBotaoFiltroAtivo: {
    color: '#FFFFFF', // Cor do texto do botão ativo
  },
  // Estilos para o Card de Movimentação
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15, // Espaço entre os cards
    borderWidth: 1,
    borderColor: '#ECECEC', // Borda sutil
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 2, // Sombra para Android
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  cardData: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 10,
  },
  cardTipo: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 'auto', // Alinha à direita
    textTransform: 'uppercase',
  },
  cardConteudo: {
    // Estilos gerais do conteúdo, se necessário
  },
  cardTituloProduto: { // Para nome do produto na entrada
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  cardTituloPedido: { // Para ID do pedido na saída
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  cardSubtitulo: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  cardSubtituloDestaque: { // Para nomes de fornecedor, cliente, vendedor
    fontWeight: '600',
    color: '#2C3E50',
  },
  cardSubtituloProeminente: { // Para Cliente e Vendedor em Saídas
    fontSize: 15,
    color: '#444444',
    marginBottom: 5,
  },
  detalhesValorContainer: { // Container para quantidade e valor na entrada
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666666',
  },
  cardLabelMenor: {
    fontSize: 13,
    color: '#777777',
    marginTop: 5,
  },
  cardValorDestaque: { // Para quantidade
    fontWeight: 'bold',
    color: '#333333'
  },
  cardValorPrincipalEntrada: { // Para valor total da entrada
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60', // Verde
  },
  cardValorPrincipalSaida: { // Para valor total da saída
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c0392b', // Vermelho
    marginTop: 8,
    textAlign: 'right', // Alinha valor da saída à direita
  },
  cardObservacao: {
    fontSize: 13,
    color: '#777777',
    marginTop: 10,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 8,
  },
  // Estilos para Lista Vazia
  listaVaziaContainer: {
    flex: 1, // Ocupa o espaço disponível
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listaVaziaTexto: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
    textAlign: 'center',
  },
  listaVaziaSubtexto: {
    marginTop: 8,
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  // Estilos para o Botão Adicionar
  botaoAdicionar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: solidBlue, // Cor sólida azul
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 10, // Espaço acima do botão
    marginBottom: 10, // Espaço abaixo do botão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBotaoAdicionar: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
