import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, SafeAreaView, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

// Tipagem (assumindo que está no seu ficheiro types.ts)
import { Fornecedor, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroFornecedor'>;

export default function CadastroFornecedor({ navigation, route }: Props) {
  const { fornecedorExistente, onSalvar, onExcluir } = route.params || {};
  const isEditando = !!fornecedorExistente;

  const [nome, setNome] = useState(fornecedorExistente?.nome || '');
  const [endereco, setEndereco] = useState(fornecedorExistente?.endereco || '');
  const [telefone, setTelefone] = useState(fornecedorExistente?.telefone || '');
  const [cnpj, setCnpj] = useState(fornecedorExistente?.cnpj || '');

  // 1. ESTADO PARA CONTROLAR A VISIBILIDADE DO MODAL
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

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
      let fornecedorSalvo: Fornecedor;
      if (isEditando) {
        const response = await api.put<Fornecedor>(`/fornecedores/editar/${fornecedorExistente.id_fornecedor}`, dadosFornecedor);
        fornecedorSalvo = response.data;
      } else {
        const response = await api.post<Fornecedor>('/fornecedores/cadastrar', dadosFornecedor);
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

  // 2. handleExcluir AGORA APENAS ABRE O MODAL
  const handleExcluir = () => {
    if (!isEditando) return;
    setDeleteModalVisible(true);
  };

  // 3. NOVA FUNÇÃO PARA REALMENTE EXECUTAR A EXCLUSÃO
  const confirmarExclusao = async () => {
    if (!isEditando) return;
    try {
        await api.delete(`/fornecedores/deletar/${fornecedorExistente.id_fornecedor}`);
        if (typeof onExcluir === 'function') {
            onExcluir(fornecedorExistente.id_fornecedor);
        }
        setDeleteModalVisible(false);
        navigation.goBack();
    } catch (error) {
        console.error("Erro na chamada da API de exclusão:", error);
        setDeleteModalVisible(false);
        Alert.alert("Erro", "Não foi possível excluir o fornecedor.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
                        Deseja realmente excluir o fornecedor "{nome}"? Esta ação não pode ser desfeita.
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

        <LinearGradient colors={gradientColors} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isEditando ? 'Editar Fornecedor' : 'Novo Fornecedor'}</Text>
            <View style={{ width: 28 }} />
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.formContainer}>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações do Fornecedor</Text>
                    <TextInput style={styles.input} placeholder="Nome*" value={nome} onChangeText={setNome} placeholderTextColor="#999" />
                    <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} placeholderTextColor="#999" />
                    <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholderTextColor="#999" />
                    <TextInput style={styles.input} placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} keyboardType="numeric" placeholderTextColor="#999" />
                </View>
                
                <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                    <MaterialIcons name="save" size={22} color="white" style={{ marginRight: 10 }} />
                    <Text style={styles.saveButtonText}>Salvar Fornecedor</Text>
                </TouchableOpacity>

                {isEditando && (
                    <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
                        <Ionicons name="trash-bin-outline" size={22} color="#FFFFFF" />
                        <Text style={styles.deleteButtonText}>Excluir Fornecedor</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 35 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  formContainer: { flexGrow: 1, backgroundColor: 'white' },
  content: { padding: 25 },
  section: {},
  sectionTitle: { fontSize: 18, fontWeight: '600', color: solidBlue, marginBottom: 20 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', color: '#333' },
  saveButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#27ae60', padding: 16, borderRadius: 10, marginTop: 10 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', padding: 16, borderRadius: 10, marginTop: 15 },
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
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
