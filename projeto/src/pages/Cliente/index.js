import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation} from '@react-navigation/native';


export default function ClientesScreen({ navigation }) {
  const clientes = [
    { id: 1, nome: 'Fulano', telefone: '(11) 9999-9999', cpf: '12345678900' },
    { id: 2, nome: 'Ciclano', telefone: '(11) 8888-8888', cpf: '31345676920' },
    { id: 3, nome: 'Beltrano', telefone: '(11) 7777-7777', cpf: '66645658902' },
  ];

  // Função para navegar para edição
  const handleEditarCliente = (cliente) => {
    navigation.navigate('CadastroCliente', { 
      clienteExistente: cliente,
      onSalvar: (clienteAtualizado) => {
        // Atualiza a lista de clientes
        setClientes(clientes.map(c => 
          c.id === clienteAtualizado.id ? clienteAtualizado : c
        ));
      }
    });
  };

    // Função para adicionar novo cliente
  const handleNovoCliente = () => {
    navigation.navigate('CadastroCliente', {
      onSalvar: (novoCliente) => {
        setClientes([...clientes, { ...novoCliente, id: Date.now() }]);
      }
    });
  };

  // Função para deletar cliente
  const handleDeletarCliente = (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          onPress: () => setClientes(clientes.filter(c => c.id !== id))
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#0C4B8E', '#116EB0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Cabeçalho - Tudo dentro de Text ou componentes que aceitam texto */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clientes</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Corpo principal */}
      <View style={styles.content}>
        <Text style={styles.subHeader}>Loja Principal</Text>
        
        <ScrollView style={styles.clientesContainer}>
          {clientes.map(cliente => (
            <View key={cliente.id} style={styles.clienteCard}>
              <View style={styles.clienteInfo}>
                <Text style={styles.clienteNome}>{cliente.nome}</Text>
                <Text style={styles.clienteTelefone}>{cliente.telefone}</Text>
              </View>
              <TouchableOpacity 
              style={styles.clienteAction}
              onPress={() => navigation.navigate('CadastroCliente', { 
              clienteExistente: cliente 
              })}
              >
                <MaterialIcons name="edit" size={22} color="#116EB0" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Botão de ação */}
        <TouchableOpacity 
        style={styles.addButton}
        onPress={ () => navigation.navigate('CadastroCliente')}
        >
          <MaterialIcons name="add" size={28} color="white" />
          <Text style={styles.addButtonText}>Novo Cliente</Text>
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
  clientesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  clienteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 110, 176, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  clienteTelefone: {
    fontSize: 14,
    color: '#566573',
  },
  clienteAction: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#116EB0',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});