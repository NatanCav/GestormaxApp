import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// As anotações de tipo foram removidas
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

// Dados de exemplo (mock) como um array de objetos JavaScript
const DADOS_MOCK = [
  {
    id_movimentacao: 1,
    tipo: 'entrada',
    produtoNome: 'Vodka Smirnoff 1L',
    fornecedorNome: 'Atacadão Bebidas',
    quantidade: 50,
    valorTotal: 1500.00,
  },
  {
    id_movimentacao: 2,
    tipo: 'saida',
    pedidoId: 'PED-2024-001',
    clienteNome: 'Mercadinho do Bairro',
    vendedorNome: 'Carlos Silva',
    produtoNome: 'Vodka Smirnoff 1L',
    quantidade: 12,
    valorTotal: 780.00,
  },
  {
    id_movimentacao: 3,
    tipo: 'entrada',
    produtoNome: 'Whisky Jack Daniels 1L',
    fornecedorNome: 'Importadora Rápida',
    quantidade: 12,
    valorTotal: 1200.00,
  },
   {
    id_movimentacao: 4,
    tipo: 'saida',
    pedidoId: 'PED-2024-002',
    clienteNome: 'Joana Lima (Varejo)',
    vendedorNome: 'Maria Souza',
    produtoNome: 'Whisky Jack Daniels 1L',
    quantidade: 1,
    valorTotal: 150.00,
  },
  {
    id_movimentacao: 5,
    tipo: 'entrada',
    produtoNome: 'Pitu 1L',
    fornecedorNome: 'Atacadão Bebidas',
    quantidade: 120,
    valorTotal: 800.00,
  },
  {
    id_movimentacao: 6,
    tipo: 'saida',
    produtoNome: 'Pitu 1L',
    quantidade: 40,
    // ... outros campos de saida
  }
];

// Componente do card, agora sem tipos
const EstoqueCard = ({ item }) => (
    <View style={styles.cardContainer}>
        <View style={styles.cardIconContainer}>
            <MaterialIcons name="inventory-2" size={28} color={solidBlue} />
        </View>
        <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>{item.nome}</Text>
        </View>
        <View style={styles.cardQuantidadeContainer}>
            <Text style={[
                styles.cardQuantidade,
                item.quantidade <= 10 && styles.lowQuantity
            ]}>
                {item.quantidade}
            </Text>
            <Text style={styles.cardUnidadeLabel}>un.</Text>
        </View>
    </View>
);

export default function EstoqueScreen({ navigation }) {
    const [searchText, setSearchText] = useState('');
    const [estoque, setEstoque] = useState([]);
    const [estoqueFiltrado, setEstoqueFiltrado] = useState([]);

    useEffect(() => {
        const calcularEstoque = () => {
            const estoqueCalculado = {};

            DADOS_MOCK.forEach(mov => {
                // Lógica para obter o nome do produto de entradas ou saídas
                // No seu mock, o campo 'produtoNome' está em ambos, o que simplifica
                const nomeProduto = mov.produtoNome;
                if (!nomeProduto) return;

                // Subtrai se for saída, soma se for entrada
                const quantidade = (mov.tipo === 'entrada') ? mov.quantidade : -mov.quantidade;
                
                if (estoqueCalculado[nomeProduto]) {
                    estoqueCalculado[nomeProduto] += quantidade;
                } else {
                    estoqueCalculado[nomeProduto] = quantidade;
                }
            });

            // Converte o objeto de estoque para um array
            const estoqueArray = Object.keys(estoqueCalculado).map(nome => ({
                nome: nome,
                quantidade: estoqueCalculado[nome],
            }));

            setEstoque(estoqueArray);
            setEstoqueFiltrado(estoqueArray);
        };

        calcularEstoque();
    }, []);

    // Efeito para a busca
    useEffect(() => {
        if (searchText.trim() === '') {
            setEstoqueFiltrado(estoque);
        } else {
            const filtrados = estoque.filter(item =>
                item.nome.toLowerCase().includes(searchText.toLowerCase())
            );
            setEstoqueFiltrado(filtrados);
        }
    }, [searchText, estoque]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
            <LinearGradient colors={gradientColors} style={styles.containerGradient}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Estoque de Produtos</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.contentArea}>
                    <View style={styles.searchContainer}>
                        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar produto no estoque..."
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>

                    <FlatList
                        data={estoqueFiltrado}
                        renderItem={({ item }) => <EstoqueCard item={item} />}
                        keyExtractor={(item) => item.nome}
                        ListEmptyComponent={
                            <View style={styles.listaVaziaContainer}>
                                <MaterialIcons name="highlight-off" size={100} color="#D0D0D0" />
                                <Text style={styles.listaVaziaTexto}>Nenhum item em estoque.</Text>
                            </View>
                        }
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerGradient: { flex: 1 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 35 : 15 },
    headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
    contentArea: { flex: 1, backgroundColor: '#f4f6f8', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 20 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 45, color: '#333', fontSize: 16 },
    cardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
    cardIconContainer: { padding: 10, backgroundColor: 'rgba(17, 110, 176, 0.1)', borderRadius: 10, marginRight: 15 },
    cardInfo: { flex: 1 },
    cardNome: { fontSize: 17, fontWeight: '600', color: '#2C3E50' },
    cardQuantidadeContainer: { alignItems: 'flex-end' },
    cardQuantidade: { fontSize: 20, fontWeight: 'bold', color: solidBlue },
    lowQuantity: { color: '#e74c3c' },
    cardUnidadeLabel: { fontSize: 14, color: '#7f8c8d' },
    listaVaziaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 50 },
    listaVaziaTexto: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#555555', textAlign: 'center' },
});
