import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Adicionado MaterialIcons
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

export default function CadastroFornecedor({ navigation, route }) {
  const { fornecedorExistente, onSalvar, onExcluir } = route.params || {};
  const isEditando = !!fornecedorExistente;

  const [nome, setNome] = useState(fornecedorExistente?.nome || '');
  const [endereco, setEndereco] = useState(fornecedorExistente?.endereco || '');
  const [telefone, setTelefone] = useState(fornecedorExistente?.telefone || '');
  const [cnpj, setCnpj] = useState(fornecedorExistente?.cnpj || '');

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
        const response = await api.put(`/fornecedores/editar/${fornecedorExistente.id_fornecedor}`, dadosFornecedor);
        fornecedorSalvo = response.data;
      } else {
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
    if (!isEditando) return;
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
        {/* 1. BOTÃO DE SALVAR REMOVIDO DO CABEÇALHO */}
        <View style={{ width: 30 }} />
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
          
          {/* 2. BOTÃO DE SALVAR ADICIONADO AO FINAL DO FORMULÁRIO */}
          <TouchableOpacity style={stylesCadastro.saveButton} onPress={handleSalvar}>
            <MaterialIcons name="save" size={22} color="white" style={{ marginRight: 10 }} />
            <Text style={stylesCadastro.saveButtonText}>Salvar Fornecedor</Text>
          </TouchableOpacity>

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

const stylesCadastro = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, paddingTop: 45 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  formContainer: { flexGrow: 1 },
  content: { backgroundColor: 'white', padding: 20, paddingTop: 30, flex: 1, justifyContent: 'space-between' },
  section: { paddingBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: solidBlue, marginBottom: 15 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', color: '#333' },
  // 3. ESTILO ADICIONADO PARA O BOTÃO SALVAR
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27ae60', // Verde para salvar
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#e74c3c', 
    padding: 16, 
    borderRadius: 10, 
    marginTop: 15 
  },
  deleteButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginLeft: 8 
  },
});
