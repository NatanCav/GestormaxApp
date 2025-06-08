import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api'; // Ajuste o caminho conforme necessário

export default function ClientesScreen({ navigation }) {
  // ... (estados: searchText, clientes, clientesFiltrados) ...
  const [searchText, setSearchText] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  useEffect(() => {
    // Função para ser chamada toda vez que a tela entra em foco
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClientes();
    });

    // Retorna a função de limpeza para remover o listener
    return unsubscribe;
  }, [navigation]);

  // EFEITO PARA FILTRAR A LISTA
  useEffect(() => {
    if (searchText.trim() === '') {
      setClientesFiltrados(clientes);
    } else {
      const filtrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchText.toLowerCase())
      );
      setClientesFiltrados(filtrados);
    }
  }, [searchText, clientes]);


  const fetchClientes = async () => {
    try {
      // --- ENDPOINT ATUALIZADO: GET /clientes/consultar ---
      console.log("Buscando clientes do backend...");
      const response = await api.get('/clientes/consultar');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de clientes.");
    }
  };
  
    const handleNovoCliente = () => {
    navigation.navigate('CadastroCliente', {
      onSalvar: (novoCliente) => {
        setClientes(prevClientes => [novoCliente, ...prevClientes]);
      },
    });
  };

  const handleEditarCliente = (cliente) => {
    navigation.navigate('CadastroCliente', {
      clienteExistente: cliente,
      onSalvar: (clienteAtualizado) => {
        setClientes(prevClientes =>
          prevClientes.map(c =>
            c.id_cliente === clienteAtualizado.id_cliente ? clienteAtualizado : c
          )
        );
      },
      onExcluir: (clienteId) => {
        setClientes(prevClientes =>
          prevClientes.filter(c => c.id_cliente !== clienteId)
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
        <Text style={styles.headerTitle}>Clientes</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
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
          data={clientesFiltrados}
          keyExtractor={item => item.id_cliente.toString()}
          style={styles.clientesContainer}
          renderItem={({ item }) => (
            <View style={styles.clienteCard}>
              <View style={styles.clienteInfo}>
                <Text style={styles.clienteNome}>{item.nome}</Text>
                <Text style={styles.clienteTelefone}>{item.telefone}</Text>
              </View>
              <TouchableOpacity
                style={styles.clienteAction}
                onPress={() => handleEditarCliente(item)}
              >
                <MaterialIcons name="edit" size={22} color="#116EB0" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleNovoCliente}>
          <MaterialIcons name="add" size={28} color="white" />
          <Text style={styles.addButtonText}>Novo Cliente</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 40 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'white' 


  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 20 

  },
  searchIcon: { 
    marginRight: 10 

  },
  searchInput: { 
    flex: 1, 
    height: 45, 
    color: '#333', 
    fontSize: 16 

  },
  content: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    paddingTop: 30 

  }
  ,
  clientesContainer: { 
    flex: 1, 
    marginBottom: 20 

  },
  clienteCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'rgba(17, 110, 176, 0.1)', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 10 

  },
  clienteInfo: { 
    flex: 1 

  },
  clienteNome: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#2C3E50', 
    marginBottom: 5 

  },

  clienteTelefone: { 
    fontSize: 14, 
    color: '#566573' 

  },
  clienteAction: { 
    padding: 5 

  },
  addButton: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#116EB0', 
    borderRadius: 10, 
    padding: 15, 
    marginTop: 20, 
    marginBottom: 20 

  },
  addButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 10 

  },
});