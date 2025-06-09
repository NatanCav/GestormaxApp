import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api'; // Certifique-se de que o caminho está correto

// Importando os tipos que acabamos de criar/atualizar
import { Movimentacao, MovimentacaoEntrada, MovimentacaoSaida, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

// Tipando as props do Card
const MovimentacaoCard = ({ movimentacao, onPress }: { movimentacao: Movimentacao, onPress: () => void }) => {
  // Usamos um "type guard" para o TypeScript saber qual tipo de movimentação estamos renderizando
  const ehEntrada = movimentacao.tipo === 'entrada';

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardHeader}>
        <MaterialIcons
          name={ehEntrada ? "arrow-downward" : "arrow-upward"}
          size={24}
          color={ehEntrada ? '#27ae60' : '#c0392b'}
        />
        <Text style={styles.cardData}>{movimentacao.data}</Text>
        <Text style={[styles.cardTipo, { color: ehEntrada ? '#27ae60' : '#c0392b' }]}>
          {ehEntrada ? 'ENTRADA' : 'SAÍDA'}
        </Text>
      </View>

      {/* Renderização condicional com type guard */}
      {movimentacao.tipo === 'entrada' ? (
        <View style={styles.cardConteudo}>
          <Text style={styles.cardTituloProduto}>{movimentacao.produtoNome}</Text>
          <Text style={styles.cardSubtitulo}>Fornecedor: <Text style={styles.cardSubtituloDestaque}>{movimentacao.fornecedorNome}</Text></Text>
          <View style={styles.detalhesValorContainer}>
            <Text style={styles.cardLabel}>Qtde: <Text style={styles.cardValorDestaque}>{movimentacao.quantidade}</Text></Text>
            <Text style={styles.cardValorPrincipalEntrada}>R$ {movimentacao.valorTotal.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.cardConteudo}>
          <Text style={styles.cardTituloPedido}>Pedido: {movimentacao.pedidoId}</Text>
          <Text style={styles.cardSubtituloProeminente}>Cliente: <Text style={styles.cardSubtituloDestaque}>{movimentacao.clienteNome}</Text></Text>
          <Text style={styles.cardSubtituloProeminente}>Usuário: <Text style={styles.cardSubtituloDestaque}>{movimentacao.vendedorNome}</Text></Text>
          <Text style={styles.cardValorPrincipalSaida}>R$ {movimentacao.valorTotal.toFixed(2).replace('.', ',')}</Text>
        </View>
      )}
      {movimentacao.observacao && <Text style={styles.cardObservacao}>Obs: {movimentacao.observacao}</Text>}
    </TouchableOpacity>
  );
};

const ListaVaziaComponente = ({ tipoFiltro }: { tipoFiltro: 'entrada' | 'saida' }) => (
  <View style={styles.listaVaziaContainer}>
    <MaterialIcons name="receipt-long" size={100} color="#D0D0D0" />
    <Text style={styles.listaVaziaTexto}>Nenhuma movimentação de {tipoFiltro} encontrada.</Text>
    <Text style={styles.listaVaziaSubtexto}>Use o botão '+' para adicionar uma nova movimentação.</Text>
  </View>
);

type Props = NativeStackScreenProps<RootStackParamList, 'Movimentacoes'>;

export default function MovimentacoesScreen({ navigation }: Props) {
  const [filtroSelecionado, setFiltroSelecionado] = useState<'entrada' | 'saida'>('entrada');
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [movimentacoesFiltradas, setMovimentacoesFiltradas] = useState<Movimentacao[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMovimentacoes();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const filtradas = movimentacoes.filter(m => m.tipo === filtroSelecionado)
      .sort((a, b) => new Date(b.data.split('/').reverse().join('-')).getTime() - new Date(a.data.split('/').reverse().join('-')).getTime());
    setMovimentacoesFiltradas(filtradas);
  }, [filtroSelecionado, movimentacoes]);

  const fetchMovimentacoes = async () => {
    try {
      // --- ENDPOINT: GET /movimentacoes/consultar ---
      // O backend deve retornar uma lista de objetos Movimentacao
      const response = await api.get<Movimentacao[]>('/movimentacoes/consultar');
      setMovimentacoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
      Alert.alert("Erro", "Não foi possível carregar as movimentações.");
    }
  };

  const handleNovaMovimentacao = () => {
    navigation.navigate('CadastroMovimentacao', {
      onSalvar: (novaMovimentacao) => {
        setMovimentacoes(prev => [novaMovimentacao, ...prev]);
      }
    });
  };

  const handleVerMovimentacao = (movimentacao: Movimentacao) => {
    navigation.navigate('CadastroMovimentacao', {
      movimentacaoExistente: movimentacao,
      onSalvar: (movimentacaoAtualizada) => {
        setMovimentacoes(prev =>
          prev.map(m =>
            m.id_movimentacao === movimentacaoAtualizada.id_movimentacao ? movimentacaoAtualizada : m
          )
        );
      },
      onExcluir: (id) => {
        setMovimentacoes(prev => prev.filter(m => m.id_movimentacao !== id));
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
      <LinearGradient colors={gradientColors} style={styles.containerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Movimentações</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.contentArea}>
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

          <FlatList
            data={movimentacoesFiltradas}
            renderItem={({ item }) => (
              <MovimentacaoCard
                movimentacao={item}
                onPress={() => handleVerMovimentacao(item)}
              />
            )}
            keyExtractor={item => item.id_movimentacao.toString()}
            ListEmptyComponent={<ListaVaziaComponente tipoFiltro={filtroSelecionado} />}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          />

          <TouchableOpacity style={styles.botaoAdicionar} onPress={handleNovaMovimentacao}>
            <MaterialIcons name="add" size={28} color="white" />
            <Text style={styles.textoBotaoAdicionar}>Nova Movimentação</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Seus estilos aqui (mantidos)
const styles = StyleSheet.create({
  containerGradient: { flex: 1 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 35 : 15 },
  headerTitulo: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  contentArea: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 20 },
  filtroContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, backgroundColor: '#f0f0f0', borderRadius: 10, padding: 5 },
  botaoFiltro: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginHorizontal: 3 },
  botaoFiltroAtivo: { backgroundColor: solidBlue, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  textoBotaoFiltro: { fontSize: 16, fontWeight: '600', color: solidBlue, marginLeft: 8 },
  textoBotaoFiltroAtivo: { color: '#FFFFFF' },
  cardContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ECECEC', shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.10, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  cardData: { fontSize: 13, color: '#666666', marginLeft: 10 },
  cardTipo: { fontSize: 13, fontWeight: 'bold', marginLeft: 'auto', textTransform: 'uppercase' },
  cardConteudo: {},
  cardTituloProduto: { fontSize: 17, fontWeight: 'bold', color: '#333333', marginBottom: 6 },
  cardTituloPedido: { fontSize: 16, fontWeight: 'bold', color: '#333333', marginBottom: 6 },
  cardSubtitulo: { fontSize: 14, color: '#555555', marginBottom: 4 },
  cardSubtituloDestaque: { fontWeight: '600', color: '#2C3E50' },
  cardSubtituloProeminente: { fontSize: 15, color: '#444444', marginBottom: 5 },
  detalhesValorContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cardLabel: { fontSize: 14, color: '#666666' },
  cardLabelMenor: { fontSize: 13, color: '#777777', marginTop: 5 },
  cardValorDestaque: { fontWeight: 'bold', color: '#333333' },
  cardValorPrincipalEntrada: { fontSize: 16, fontWeight: 'bold', color: '#27ae60' },
  cardValorPrincipalSaida: { fontSize: 16, fontWeight: 'bold', color: '#c0392b', marginTop: 8, textAlign: 'right' },
  cardObservacao: { fontSize: 13, color: '#777777', marginTop: 10, fontStyle: 'italic', borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 8 },
  listaVaziaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  listaVaziaTexto: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#555555', textAlign: 'center' },
  listaVaziaSubtexto: { marginTop: 8, fontSize: 14, color: '#888888', textAlign: 'center' },
  botaoAdicionar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: solidBlue, borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, marginTop: 10, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  textoBotaoAdicionar: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 10 },
});
