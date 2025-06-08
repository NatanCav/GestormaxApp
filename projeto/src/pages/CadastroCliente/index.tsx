import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

// 1. IMPORTAÇÕES DE TIPO (já estavam corretas)
import { Cliente, RootStackParamList } from '../../types/index';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 2. DEFINIÇÃO DO TIPO DAS PROPS
// Aqui dizemos que as props deste componente correspondem à tela 'CadastroCliente'
// definida no nosso RootStackParamList. Isso resolve o 'any' em route e navigation.
type Props = NativeStackScreenProps<RootStackParamList, 'CadastroCliente'>;


export default function CadastroCliente({ route, navigation }: Props) { // 3. APLICAÇÃO DO TIPO
  // Agora o TypeScript sabe que route.params pode ter 'clienteExistente', 'onSalvar', etc.
  const { clienteExistente, onSalvar, onExcluir } = route.params || {};
  const isEditando = !!clienteExistente;

  // O TypeScript agora infere os tipos dos estados a partir dos valores iniciais
  const [nome, setNome] = useState(clienteExistente?.nome || '');
  const [telefone, setTelefone] = useState(clienteExistente?.telefone || '');
  const [cpf, setCpf] = useState(clienteExistente?.cpf || '');
  const [endereco, setEndereco] = useState(clienteExistente?.endereco || '');

  useEffect(() => {
    navigation.setOptions({
      title: isEditando ? 'Editar Cliente' : 'Novo Cliente'
    });
  }, [isEditando, navigation]);

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome do cliente é obrigatório.");
      return;
    }
    // O TypeScript sabe que dadosCliente tem a mesma forma de Cliente, mas sem o id.
    const dadosCliente = { nome, telefone, cpf, endereco };

    try {
      let clienteSalvo: Cliente; // 4. GARANTE QUE A VARIÁVEL TERÁ O TIPO CERTO
      if (isEditando) {
        // --- ENDPOINT ATUALIZADO: PUT /clientes/editar/:id ---
        const response = await api.put<Cliente>(`/clientes/editar/${clienteExistente.id_cliente}`, dadosCliente);
        clienteSalvo = response.data;
      } else {
        // --- ENDPOINT ATUALIZADO: POST /clientes/cadastrar ---
        const response = await api.post<Cliente>('/clientes/cadastrar', dadosCliente);
        clienteSalvo = response.data;
      }

      if (typeof onSalvar === 'function' && clienteSalvo) {
        // O TypeScript agora sabe que onSalvar espera um parâmetro do tipo Cliente
        onSalvar(clienteSalvo);
      }
      navigation.goBack();

    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      Alert.alert("Erro", "Não foi possível salvar o cliente.");
    }
  };

  const handleExcluir = () => {
    // O TypeScript sabe que clienteExistente tem id_cliente porque é do tipo Cliente
    if (!clienteExistente?.id_cliente) return;
    
    Alert.alert("Confirmar Exclusão", `Deseja realmente excluir "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // --- ENDPOINT ATUALIZADO: DELETE /clientes/deletar/:id ---
              await api.delete(`/clientes/deletar/${clienteExistente.id_cliente}`);

              if (typeof onExcluir === 'function') {
                // O TypeScript sabe que onExcluir espera um parâmetro do tipo number
                onExcluir(clienteExistente.id_cliente);
              }
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir cliente:", error);
              Alert.alert("Erro", "Não foi possível excluir o cliente.");
            }
          },
        },
      ]
    );
  };
  
  return (
      <LinearGradient colors={['#0C4B8E', '#116EB0']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditando ? 'Editar Cliente' : 'Novo Cliente'}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              <TextInput style={styles.input} placeholder="Nome completo*" value={nome} onChangeText={setNome} placeholderTextColor="#999" />
              <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} placeholderTextColor="#999" />
              <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholderTextColor="#999" />
              <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" placeholderTextColor="#999" />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
              <Text style={styles.saveButtonText}>Salvar Cliente</Text>
            </TouchableOpacity>
            
            {isEditando && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
                <Text style={styles.deleteButtonText}>Excluir Cliente</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    );
}

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  formContainer: { flexGrow: 1 },
  content: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingTop: 30, minHeight: '100%' },
  section: { marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#116EB0', marginBottom: 15 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', color: '#333' },
  saveButton: { backgroundColor: '#27ae60', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  deleteButton: { backgroundColor: '#e74c3c', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});

