import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ou FontAwesome5 para mais opções de ícones
import { LinearGradient } from 'expo-linear-gradient';

// Cores do gradiente e cor sólida
const gradientColors = ['#0C4B8E', '#116EB0']; // Azul escuro para azul mais claro
const cardBackgroundColor = '#FFFFFF'; // Fundo branco para os cards
const primaryTextColor = '#2c3e50'; // Cor de texto principal (escuro)
const secondaryTextColor = '#7f8c8d'; // Cor de texto secundária (cinza)
const iconColor = '#116EB0'; // Azul para os ícones dos cards

// Dados dos relatórios disponíveis
const DADOS_RELATORIOS = [
  {
    id: 'rel_vendas_geral',
    titulo: 'Relatório de Vendas',
    descricao: 'Analise o desempenho geral das suas vendas, totais por período e produtos mais vendidos.',
    icone: 'bar-chart', // MaterialIcons
    // rota: 'RelatorioVendasScreen', // Exemplo de rota para navegação futura
  },
  {
    id: 'rel_estoque_posicao',
    titulo: 'Posição de Estoque',
    descricao: 'Consulte a quantidade atual de cada produto em stock e o valor total do inventário.',
    icone: 'inventory-2', // MaterialIcons
  },
  {
    id: 'rel_mov_estoque',
    titulo: 'Movimentações de Estoque',
    descricao: 'Acompanhe todas as entradas e saídas de produtos do seu stock num período específico.',
    icone: 'compare-arrows', // MaterialIcons
  },
  {
    id: 'rel_financeiro_resumo',
    titulo: 'Resumo Financeiro',
    descricao: 'Veja um balanço simplificado das suas receitas (saídas) vs. despesas (entradas).',
    icone: 'account-balance-wallet', // MaterialIcons (ou 'attach-money')
  },
  {
    id: 'rel_comissoes_usuario', // ID atualizado para refletir usuário
    titulo: 'Comissões de Usuários', // Título atualizado
    descricao: 'Calcule e visualize as comissões a pagar para cada usuário com base nas suas atividades ou vendas.', // Descrição atualizada
    icone: 'payments', // MaterialIcons (mantido, pois ainda se refere a pagamentos)
  },
  {
    id: 'rel_analise_clientes',
    titulo: 'Análise de Clientes',
    descricao: 'Identifique os seus clientes mais valiosos, frequência de compras e histórico.',
    icone: 'people-alt', // MaterialIcons
  },
  {
    id: 'rel_desempenho_usuarios', // ID atualizado para refletir usuário
    titulo: 'Desempenho de Usuários', // Título atualizado
    descricao: 'Compare o desempenho (ex: vendas, tarefas) entre os seus usuários, metas atingidas e mais.', // Descrição atualizada
    icone: 'leaderboard', // MaterialIcons (mantido, pois ainda se refere a desempenho)
  },
];

// Componente para o card de cada relatório
const RelatorioCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardRelatorioContainer} onPress={() => onPress(item)}>
      <View style={styles.cardRelatorioIconeContainer}>
        <MaterialIcons name={item.icone} size={36} color={iconColor} />
      </View>
      <View style={styles.cardRelatorioTextoContainer}>
        <Text style={styles.cardRelatorioTitulo}>{item.titulo}</Text>
        <Text style={styles.cardRelatorioDescricao}>{item.descricao}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={28} color={secondaryTextColor} style={styles.cardRelatorioSeta} />
    </TouchableOpacity>
  );
};

// Tela Principal de Relatórios
export default function RelatoriosScreen({ navigation }) {

  const handleVoltar = () => {
    navigation.goBack();
  };

  const handleSelecionarRelatorio = (relatorio) => {
    Alert.alert(
      "Relatório Selecionado",
      `Você selecionou: ${relatorio.titulo}.\n\nNuma aplicação completa, você seria direcionado para as opções ou visualização deste relatório.`,
      [{ text: "OK" }]
    );

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
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
          <Text style={styles.headerTitulo}>Central de Relatórios</Text>
          <View style={{ width: 28 }} /> {/* Espaçador */}
        </View>

        {/* Área de Conteúdo Principal */}
        <View style={styles.contentArea}>
          <FlatList
            data={DADOS_RELATORIOS}
            renderItem={({ item }) => (
              <RelatorioCard
                item={item}
                onPress={handleSelecionarRelatorio}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listaRelatoriosContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.introducaoRelatorios}>
                Selecione um relatório abaixo para visualizar as análises e dados correspondentes.
              </Text>
            }
          />
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
    paddingTop: Platform.OS === 'android' ? 35 : 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)', // Linha subtil no header
  },
  headerTitulo: {
    color: '#FFFFFF',
    fontSize: 21, // Ligeiramente ajustado
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#f4f6f8', 
  },
  introducaoRelatorios: {
    fontSize: 15,
    color: secondaryTextColor,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25, // Mais espaço vertical
    lineHeight: 22,
  },
  listaRelatoriosContainer: {
    paddingHorizontal: 16, // Padding lateral para a lista
    paddingBottom: 20,
  },
  // Estilos para o Card de Relatório
  cardRelatorioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cardBackgroundColor,
    borderRadius: 12, // Bordas mais arredondadas
    padding: 18, // Padding interno do card
    marginBottom: 16, // Espaço entre os cards
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, // Sombra mais subtil
    shadowRadius: 6,
    elevation: 4, // Sombra para Android
    borderWidth: 1,
    borderColor: '#e0e0e0', // Borda muito leve
  },
  cardRelatorioIconeContainer: {
    backgroundColor: 'rgba(17, 110, 176, 0.1)', // Fundo levemente azulado para o ícone
    padding: 12,
    borderRadius: 25, // Círculo para o ícone
    marginRight: 18, // Espaço entre ícone e texto
  },
  cardRelatorioTextoContainer: {
    flex: 1, // Para o texto ocupar o espaço disponível
  },
  cardRelatorioTitulo: {
    fontSize: 17, // Tamanho do título do relatório
    fontWeight: 'bold', // Destaque para o título
    color: primaryTextColor,
    marginBottom: 6, // Espaço abaixo do título
  },
  cardRelatorioDescricao: {
    fontSize: 13.5, // Tamanho da descrição
    color: secondaryTextColor,
    lineHeight: 19, // Espaçamento entre linhas da descrição
  },
  cardRelatorioSeta: {
    marginLeft: 10, // Espaço para a seta à direita
  },
});
