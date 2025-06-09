import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

// --- PASSO 1: MOVA AS CONSTANTES PARA CÁ ---
// As constantes agora estão no topo do arquivo, fora do componente.
const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

// A tipagem de navegação também pode ser movida para cá ou para o arquivo types.ts
// ...

export default function CadastroFornecedor({ navigation, route }) {
  const { fornecedorExistente, onSalvar, onExcluir } = route.params || {};
  const isEditando = !!fornecedorExistente;

  // Estados para cada campo do formulário
  const [nome, setNome] = useState(fornecedorExistente?.nome || '');
  const [endereco, setEndereco] = useState(fornecedorExistente?.endereco || '');
  const [telefone, setTelefone] = useState(fornecedorExistente?.telefone || '');
  const [cnpj, setCnpj] = useState(fornecedorExistente?.cnpj || '');

  // As constantes de cor não ficam mais aqui dentro.

  useEffect(() => {
    navigation.setOptions({
      title: isEditando ? 'Editar Fornecedor' : 'Novo Fornecedor'
    });
  }, [isEditando, navigation]);

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome do fornecedor é obrigatório.");
      return;
    }
    const dadosFornecedor = { nome, endereco, telefone, cnpj };

    try {
      let fornecedorSalvo;
      if (isEditando) {
        // --- ENDPOINT: PUT /fornecedores/editar/:id ---
        const response = await api.put(`/fornecedores/editar/${fornecedorExistente.id_fornecedor}`, dadosFornecedor);
        fornecedorSalvo = response.data;
      } else {
        // --- ENDPOINT: POST /fornecedores/cadastrar ---
        const response = await api.post('/fornecedores/cadastrar', dadosFornecedor);
        fornecedorSalvo = response.data;
      }

      if (typeof onSalvar === 'function') {
        onSalvar(fornecedorSalvo);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      Alert.alert("Erro", "Não foi possível salvar o fornecedor.");
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o fornecedor "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // --- ENDPOINT: DELETE /fornecedores/deletar/:id ---
              await api.delete(`/fornecedores/deletar/${fornecedorExistente.id_fornecedor}`);
              if (typeof onExcluir === 'function') {
                onExcluir(fornecedorExistente.id_fornecedor);
              }
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir fornecedor:", error);
              Alert.alert("Erro", "Não foi possível excluir o fornecedor.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={stylesCadastro.safeArea}>
      <LinearGradient colors={gradientColors} style={stylesCadastro.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={stylesCadastro.headerTitle}>{isEditando ? 'Editar Fornecedor' : 'Novo Fornecedor'}</Text>
        <TouchableOpacity onPress={handleSalvar}>
          <Ionicons name="checkmark" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={stylesCadastro.formContainer}>
        <View style={stylesCadastro.content}>
          <View style={stylesCadastro.section}>
            <Text style={stylesCadastro.sectionTitle}>Informações do Fornecedor</Text>
            <TextInput style={stylesCadastro.input} placeholder="Nome*" value={nome} onChangeText={setNome} placeholderTextColor="#999" />
            <TextInput style={stylesCadastro.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} placeholderTextColor="#999" />
            <TextInput style={stylesCadastro.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholderTextColor="#999" />
            <TextInput style={stylesCadastro.input} placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} keyboardType="numeric" placeholderTextColor="#999" />
          </View>
          
          {isEditando && (
            <TouchableOpacity style={stylesCadastro.deleteButton} onPress={handleExcluir}>
              <Ionicons name="trash-bin-outline" size={22} color="#FFFFFF" />
              <Text style={stylesCadastro.deleteButtonText}>Excluir Fornecedor</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// O StyleSheet agora consegue acessar a constante 'solidBlue' sem problemas.
const stylesCadastro = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, paddingTop: 45 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  formContainer: { flexGrow: 1 },
  content: { backgroundColor: 'white', padding: 20, paddingTop: 30, minHeight: '100%' },
  section: { marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: solidBlue, marginBottom: 15 }, // <-- LINHA 123 CORRIGIDA
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', color: '#333' },
  deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', padding: 16, borderRadius: 10, marginTop: 15 },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});
