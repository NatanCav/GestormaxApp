import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

import { Produto, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Produtos'>;

export default function ProdutosScreen({ navigation }: Props) {
    const [searchText, setSearchText] = useState('');
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProdutos();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setProdutosFiltrados(produtos);
        } else {
            const filtrados = produtos.filter(produto =>
                // Busca agora apenas por nome
                produto.nome.toLowerCase().includes(searchText.toLowerCase())
            );
            setProdutosFiltrados(filtrados);
        }
    }, [searchText, produtos]);

    const fetchProdutos = async () => {
        try {
            const response = await api.get<Produto[]>('/produtos/consultar');
            setProdutos(response.data);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de produtos.");
        }
    };

    const handleNovoProduto = () => {
        navigation.navigate('CadastroProduto', {
            onSalvar: (novoProduto) => {
                setProdutos(prevProdutos => [novoProduto, ...prevProdutos]);
            },
        });
    };

    const handleEditarProduto = (produto: Produto) => {
        navigation.navigate('CadastroProduto', {
            produtoExistente: produto,
            onSalvar: (produtoAtualizado) => {
                setProdutos(prevProdutos =>
                    prevProdutos.map(p =>
                        p.id_produto === produtoAtualizado.id_produto ? produtoAtualizado : p
                    )
                );
            },
            onExcluir: (produtoId) => {
                setProdutos(prevProdutos =>
                    prevProdutos.filter(p => p.id_produto !== produtoId)
                );
            },
        });
    };

    return (
        <LinearGradient colors={['#0C4B8E', '#116EB0']} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Produtos</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.subHeader}>Catálogo de Produtos</Text>
                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar por nome..."
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <FlatList
                    data={produtosFiltrados}
                    keyExtractor={item => item.id_produto.toString()}
                    style={styles.produtosContainer}
                    renderItem={({ item }: { item: Produto }) => (
                        <TouchableOpacity onPress={() => handleEditarProduto(item)}>
                            <View style={styles.produtoCard}>
                                <View style={styles.produtoInfo}>
                                    <Text style={styles.produtoNome}>{item.nome}</Text>
                                    <Text style={styles.produtoDescricao} numberOfLines={2}>
                                        {item.descricao || 'Sem descrição'}
                                    </Text>
                                    <View style={styles.valoresContainer}>
                                        <Text style={styles.produtoValor}>
                                            Compra: <Text style={styles.valorNumeroCompra}>R$ {item.valorCompra?.toFixed(2).replace('.', ',') || '0,00'}</Text>
                                        </Text>
                                        <Text style={styles.produtoValor}>
                                            Venda: <Text style={styles.valorNumeroVenda}>R$ {item.valorVenda?.toFixed(2).replace('.', ',') || '0,00'}</Text>
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons name="edit" size={24} color="#116EB0" style={{ marginLeft: 15 }} />
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado</Text>}
                />

                <TouchableOpacity style={styles.addButton} onPress={handleNovoProduto}>
                    <MaterialIcons name="add" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    content: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingTop: 30 },
    subHeader: { fontSize: 18, fontWeight: '600', color: '#116EB0', marginBottom: 20 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20 },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 45, color: '#333', fontSize: 16 },
    produtosContainer: { flex: 1, marginBottom: 20 },
    produtoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 10, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
    produtoInfo: { flex: 1, marginRight: 10 },
    produtoNome: { fontSize: 17, fontWeight: 'bold', color: '#2C3E50', marginBottom: 5 },
    produtoDescricao: { fontSize: 14, color: '#7f8c8d', marginBottom: 10, fontStyle: 'italic' },
    valoresContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    produtoValor: { fontSize: 14, color: '#566573' },
    valorNumeroCompra: { fontWeight: '600', color: '#e74c3c' },
    valorNumeroVenda: { fontWeight: '600', color: '#27ae60' },
    emptyText: { textAlign: 'center', color: '#566573', marginTop: 20, fontSize: 16 },
    addButton: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#116EB0', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});