import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProdutosScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('todos');
  
  // Dados de exemplo
  const produtos = [
    { id: 1, nome: 'Cachaça Pittu', codigo: 'PIT001', quantidade: 95 },
    { id: 2, nome: 'Vodka Smirnoff', codigo: 'SMK002', quantidade: 42 },
    { id: 3, nome: 'Whisky Jack Daniels', codigo: 'JD003', quantidade: 18 },
    { id: 4, nome: 'Cerveja Heineken', codigo: 'HEI004', quantidade: 120 },
    { id: 5, nome: 'Vinho Tinto', codigo: 'VIN005', quantidade: 35 },
    { id: 6, nome: 'Cachaça 51', codigo: 'CAC006', quantidade: 8 },
  ];

  // Filtrar produtos
  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchText.toLowerCase()) || 
                         produto.codigo.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter === 'todos' || 
                         (filter === 'alto' && produto.quantidade > 50) ||
                         (filter === 'baixo' && produto.quantidade <= 50);
    return matchesSearch && matchesFilter;
  });

  // Componente de item de produto
  const ProdutoItem = ({ produto }) => (
    <View style={styles.produtoCard}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{produto.nome}</Text>
        <Text style={styles.produtoCodigo}>Cód: {produto.codigo}</Text>
      </View>
      <Text style={[
        styles.produtoQuantidade,
        produto.quantidade <= 10 && styles.lowQuantity
      ]}>
        {produto.quantidade} un.
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0C4B8E', '#116EB0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Cabeçalho simplificado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produtos</Text>
        <View style={{ width: 28 }} /> {/* Espaço para alinhamento */}
      </View>

      {/* Corpo principal */}
      <View style={styles.content}>
        <Text style={styles.subHeader}>Loja Principal</Text>
        
        {/* Barra de pesquisa integrada */}
        <View style={styles.searchContainer}>
          <MaterialIcons 
            name="search" 
            size={20} 
            color="#666" 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por nome ou código..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilter(filter === 'todos' ? 'alto' : filter === 'alto' ? 'baixo' : 'todos')}
          >
            <MaterialIcons 
              name={filter === 'todos' ? "filter-list" : filter === 'alto' ? "trending-up" : "trending-down"} 
              size={22} 
              color="#116EB0" 
            />
            <Text style={styles.filterText}>
              {filter === 'todos' ? 'Todos' : filter === 'alto' ? 'Alto' : 'Baixo'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Lista de produtos */}
        <ScrollView style={styles.produtosContainer}>
          {filteredProdutos.length > 0 ? (
            filteredProdutos.map(produto => (
              <ProdutoItem key={produto.id} produto={produto} />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          )}
        </ScrollView>

        {/* Botão flutuante para adicionar */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroProduto')}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#116EB0',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#333',
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  filterText: {
    color: '#116EB0',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  produtosContainer: {
    flex: 1,
    marginBottom: 20,
  },
  produtoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 110, 176, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  produtoCodigo: {
    fontSize: 14,
    color: '#566573',
  },
  produtoQuantidade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#116EB0',
    minWidth: 70,
    textAlign: 'right',
  },
  lowQuantity: {
    color: '#E74C3C',
  },
  emptyText: {
    textAlign: 'center',
    color: '#566573',
    marginTop: 20,
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#116EB0',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});