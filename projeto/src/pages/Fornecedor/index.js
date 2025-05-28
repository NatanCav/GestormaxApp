import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Define as cores do gradiente e a cor sólida
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

// Dados de exemplo (mock)
const MOCK_SUPPLIERS = [
  { id: '1', name: 'Fornecedor Alpha Ltda.' },
  { id: '2', name: 'Distribuidora Beta S.A.' },
];

// Componente para o item da lista
const SupplierItem = ({ name, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Ionicons name="business-outline" size={24} color={solidBlue} style={styles.itemIcon} />
    <Text style={styles.itemText}>{name}</Text>
    <Ionicons name="chevron-forward" size={24} color="#B0B0B0" />
  </TouchableOpacity>
);

// Componente para o estado vazio
const EmptyListComponent = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="people-outline" size={100} color="#D0D0D0" />
    <Text style={styles.emptyText}>Nenhum fornecedor encontrado.</Text>
    <Text style={styles.emptySubText}>Toque no botão '+' para adicionar o primeiro!</Text>
  </View>
);


export default function FornecedoresScreen({ navigation }) { // Recebe navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [filteredSuppliers, setFilteredSuppliers] = useState(MOCK_SUPPLIERS);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchQuery, suppliers]);

  // Função para voltar
  const handleGoBack = () => {
      navigation.goBack();
  };

  const handleAddSupplier = () => {
    // Navega para a tela de CadastroFornecedorScreen
    navigation.navigate('CadastroFornecedor');
  };

  const handleSupplierPress = (supplier) => {
      console.log("Ver detalhes do fornecedor:", supplier.name);
      // Ex: navigation.navigate('DetalhesFornecedor', { supplierId: supplier.id });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header com Gradiente e Botão Voltar */}
      <LinearGradient
        colors={gradientColors}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Botão Voltar (Substituindo o Menu) */}
        <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Fornecedores</Text>

        {/* Ícone de Busca (Placeholder) */}
        <TouchableOpacity>
            <Ionicons name="search" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Container Principal */}
      <View style={styles.container}>
        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar por nome..."
                placeholderTextColor="#A9A9A9"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
             {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#888" style={styles.searchClearIcon} />
                </TouchableOpacity>
             )}
        </View>

        {/* Lista de Fornecedores */}
        <FlatList
          data={filteredSuppliers}
          renderItem={({ item }) => (
            <SupplierItem
                name={item.name}
                onPress={() => handleSupplierPress(item)}
            />
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyListComponent />}
          contentContainerStyle={{ flexGrow: 1 }}
        />

      </View>

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity style={styles.fabTouchable} onPress={handleAddSupplier}>
          <LinearGradient
              colors={gradientColors}
              style={styles.fab}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
          >
              <Ionicons name="add" size={36} color="#FFFFFF" />
          </LinearGradient>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// Estilos (mantidos os mesmos da versão anterior)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F0F0',
      borderRadius: 10,
      margin: 15,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#E0E0E0',
  },
  searchIcon: {
      marginRight: 10,
  },
  searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: '#333',
  },
  searchClearIcon: {
      marginLeft: 5,
  },
  itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
      backgroundColor: '#FFFFFF',
  },
  itemIcon: {
      marginRight: 15,
  },
  itemText: {
      flex: 1,
      fontSize: 16,
      color: '#333333',
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  emptyText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#555555',
      textAlign: 'center',
  },
  emptySubText: {
      marginTop: 8,
      fontSize: 14,
      color: '#888888',
      textAlign: 'center',
  },
  fabTouchable: {
      position: 'absolute',
      bottom: 25,
      right: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
      borderRadius: 30,
  },
  fab: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
  },
});