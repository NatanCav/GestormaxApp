import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Platform // Added Platform import
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Define as cores do gradiente e a cor sólida
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

// Dados de exemplo (mock)
const MOCK_SUPPLIERS = [
  { id: '1', name: 'Fornecedor Alpha Ltda.', contact: 'contato@alpha.com' },
  { id: '2', name: 'Distribuidora Beta S.A.', contact: 'vendas@beta.com' },
  { id: '3', name: 'Importadora Gama e Filhos', contact: 'comercial@gama.com.br' },
];

// Componente para o item da lista (FornecedorCard)
const FornecedorCard = ({ name, contact, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <View style={styles.cardInfo}>
      <MaterialIcons name="business" size={24} color={solidBlue} style={styles.cardIcon} />
      <View>
        <Text style={styles.cardName}>{name}</Text>
        {contact && <Text style={styles.cardContact}>{contact}</Text>}
      </View>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#B0B0B0" />
  </TouchableOpacity>
);

// Componente para o estado vazio
const EmptyListComponent = () => (
  <View style={styles.emptyContainer}>
    <MaterialIcons name="storefront" size={100} color="#D0D0D0" />
    <Text style={styles.emptyText}>Nenhum fornecedor encontrado.</Text>
    <Text style={styles.emptySubText}>Toque no botão 'Novo Fornecedor' para adicionar o primeiro!</Text>
  </View>
);


export default function FornecedoresScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [filteredSuppliers, setFilteredSuppliers] = useState(MOCK_SUPPLIERS);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (supplier.contact && supplier.contact.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchQuery, suppliers]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddSupplier = () => {
    navigation.navigate('CadastroFornecedor', {
        onSalvar: (novoFornecedor) => {
            setSuppliers(prev => [...prev, { ...novoFornecedor, id: String(Date.now()) }]);
        }
    });
  };

  const handleSupplierPress = (supplier) => {
    console.log("Ver detalhes do fornecedor:", supplier.name);
    navigation.navigate('CadastroFornecedor', {
        fornecedorExistente: supplier,
        onSalvar: (fornecedorAtualizado) => {
            setSuppliers(prevSuppliers =>
                prevSuppliers.map(s =>
                    s.id === fornecedorAtualizado.id ? fornecedorAtualizado : s
                )
            );
        }
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fornecedores</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.searchSection}>
            <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por nome ou contato..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredSuppliers}
            renderItem={({ item }) => (
              <FornecedorCard
                name={item.name}
                contact={item.contact}
                onPress={() => handleSupplierPress(item)}
              />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={<EmptyListComponent />}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddSupplier}>
            <MaterialIcons name="add" size={28} color="white" />
            <Text style={styles.addButtonText}>Novo Fornecedor</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchSection: {
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
    fontSize: 16,
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 110, 176, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  cardContact: {
    fontSize: 14,
    color: '#566573',
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
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: solidBlue,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 50,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
