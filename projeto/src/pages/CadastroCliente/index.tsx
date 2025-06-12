import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, SafeAreaView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

import { Cliente, RootStackParamList } from '../../types/index';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroCliente'>;

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

export default function CadastroCliente({ route, navigation }: Props) {
  const { clienteExistente, onSalvar, onExcluir } = route.params || {};
  const isEditando = !!clienteExistente;
  
  const [nome, setNome] = useState(clienteExistente?.nome || '');
  const [telefone, setTelefone] = useState(clienteExistente?.telefone || '');
  const [cpf, setCpf] = useState(clienteExistente?.cpf || '');
  const [endereco, setEndereco] = useState(clienteExistente?.endereco || '');

  // 1. ESTADO PARA CONTROLAR A VISIBILIDADE DO MODAL
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

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
    const dadosCliente = { nome, telefone, cpf, endereco };

    try {
      let clienteSalvo: Cliente;
      if (isEditando) {
        const response = await api.put<Cliente>(`/clientes/editar/${clienteExistente.id_cliente}`, dadosCliente);
        clienteSalvo = response.data;
      } else {
        const response = await api.post<Cliente>('/clientes/cadastrar', dadosCliente);
        clienteSalvo = response.data;
      }

      if (typeof onSalvar === 'function' && clienteSalvo) {
        onSalvar(clienteSalvo);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      Alert.alert("Erro", "Não foi possível salvar o cliente.");
    }
  };

  // 2. handleExcluir AGORA APENAS ABRE O MODAL
  const handleExcluir = () => {
    if (!isEditando) return;
    setDeleteModalVisible(true);
  };

  // 3. NOVA FUNÇÃO PARA REALMENTE EXECUTAR A EXCLUSÃO
  const confirmarExclusao = async () => {
    if (!isEditando) return;
    try {
        await api.delete(`/clientes/deletar/${clienteExistente.id_cliente}`);
        if (typeof onExcluir === 'function') {
            onExcluir(clienteExistente.id_cliente);
        }
        setDeleteModalVisible(false);
        navigation.goBack();
    } catch (error) {
        console.error("Erro na chamada da API de exclusão:", error);
        setDeleteModalVisible(false);
        Alert.alert("Erro", "Não foi possível excluir o cliente.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* 4. JSX DO MODAL ADICIONADO À TELA */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={isDeleteModalVisible}
            onRequestClose={() => setDeleteModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                    <Text style={styles.modalText}>
                        Deseja realmente excluir o cliente "{nome}"? Esta ação não pode ser desfeita.
                    </Text>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonCancel]}
                            onPress={() => setDeleteModalVisible(false)}
                        >
                            <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonDelete]}
                            onPress={confirmarExclusao}
                        >
                            <Text style={styles.modalButtonTextDelete}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        <LinearGradient colors={gradientColors} style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isEditando ? 'Editar Cliente' : 'Novo Cliente'}</Text>
            <View style={{ width: 28 }} />
        </LinearGradient>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  formContainer: { flexGrow: 1, backgroundColor: 'white' },
  content: { padding: 25 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: solidBlue, marginBottom: 20 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', color: '#333' },
  saveButton: { backgroundColor: '#27ae60', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  deleteButton: { backgroundColor: '#e74c3c', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  // --- 5. ESTILOS PARA O MODAL ---
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalView: {
      width: '85%',
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333'
  },
  modalText: {
      fontSize: 16,
      marginBottom: 25,
      textAlign: 'center',
      color: '#555',
      lineHeight: 22,
  },
  modalButtonContainer: {
      flexDirection: 'row',
      width: '100%',
  },
  modalButton: {
      borderRadius: 10,
      paddingVertical: 12,
      flex: 1,
      alignItems: 'center',
  },
  modalButtonCancel: {
      backgroundColor: '#f0f0f0',
      marginRight: 10,
  },
  modalButtonDelete: {
      backgroundColor: '#e74c3c',
      marginLeft: 10,
  },
  modalButtonTextCancel: {
      color: '#333',
      fontWeight: 'bold',
      fontSize: 16
  },
  modalButtonTextDelete: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
  }
});
