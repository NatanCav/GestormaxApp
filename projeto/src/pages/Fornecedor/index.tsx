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
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api'; 

const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

const FornecedorCard = ({ fornecedor, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <View style={styles.cardInfo}>
      <MaterialIcons name="business" size={24} color={solidBlue} style={styles.cardIcon} />
      <View>
        <Text style={styles.cardName}>{fornecedor.nome}</Text>
        {/* Usando o campo 'telefone' do seu backend */}
        {fornecedor.telefone && <Text style={styles.cardContact}>{fornecedor.telefone}</Text>}
      </View>
    </View>
    <MaterialIcons name="chevron-right" size={24} color="#B0B0B0" />
  </TouchableOpacity>
);

const EmptyListComponent = () => (
  <View style={styles.emptyContainer}>
    <MaterialIcons name="storefront" size={100} color="#D0D0D0" />
    <Text style={styles.emptyText}>Nenhum fornecedor encontrado.</Text>
    <Text style={styles.emptySubText}>Toque no botão 'Novo Fornecedor' para adicionar o primeiro!</Text>
  </View>
);

export default function FornecedoresScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  // EFEITO PARA BUSCAR DADOS QUANDO A TELA ENTRA EM FOCO
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFornecedores();
    });
    return unsubscribe;
  }, [navigation]);

  // EFEITO PARA FILTRAR LOCALMENTE
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (supplier.telefone && supplier.telefone.includes(searchQuery))
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchQuery, suppliers]);

  const fetchFornecedores = async () => {
    try {
      // --- ENDPOINT: GET /fornecedores/consultar ---
      const response = await api.get('/fornecedores/consultar');
      setSuppliers(response.data);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de fornecedores.");
    }
  };

  const handleAddSupplier = () => {
    navigation.navigate('CadastroFornecedor', {
      onSalvar: (novoFornecedor) => {
        setSuppliers(prev => [novoFornecedor, ...prev]);
      }
    });
  };

  const handleSupplierPress = (fornecedor) => {
    navigation.navigate('CadastroFornecedor', {
      fornecedorExistente: fornecedor,
      onSalvar: (fornecedorAtualizado) => {
        setSuppliers(prevSuppliers =>
          prevSuppliers.map(s =>
            // Seu backend usa 'id_fornecedor'
            s.id_fornecedor === fornecedorAtualizado.id_fornecedor ? fornecedorAtualizado : s
          )
        );
      },
      onExcluir: (fornecedorId) => {
        setSuppliers(prevSuppliers =>
          prevSuppliers.filter(s => s.id_fornecedor !== fornecedorId)
        );
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
      <LinearGradient colors={gradientColors} style={styles.gradientContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
              placeholder="Pesquisar por nome ou telefone..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredSuppliers}
            renderItem={({ item }) => (
              <FornecedorCard
                fornecedor={item}
                onPress={() => handleSupplierPress(item)}
              />
            )}
            // Seu backend usa 'id_fornecedor' como chave
            keyExtractor={item => item.id_fornecedor.toString()}
            ListEmptyComponent={<EmptyListComponent />}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
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
  gradientContainer: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 25 : 15 },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  contentContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 20 },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: '#333' },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(17, 110, 176, 0.1)', borderRadius: 10, padding: 15, marginBottom: 10 },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardIcon: { marginRight: 15 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 2 },
  cardContact: { fontSize: 14, color: '#566573' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#555555', textAlign: 'center' },
  emptySubText: { marginTop: 8, fontSize: 14, color: '#888888', textAlign: 'center' },
  addButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: solidBlue, borderRadius: 10, padding: 15, marginTop: 10, marginBottom: 20 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 10 },
});