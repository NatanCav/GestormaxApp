import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

import { Produto, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroProduto'>;

export default function CadastroProduto({ navigation, route }: Props) {
    const { produtoExistente, onSalvar, onExcluir } = route.params || {};
    const isEditando = !!produtoExistente;
    
    // Estados do formulário atualizados
    const [nome, setNome] = useState(produtoExistente?.nome || '');
    const [descricao, setDescricao] = useState(produtoExistente?.descricao || '');
    const [valorCompra, setValorCompra] = useState(produtoExistente?.valorCompra?.toString() || '');
    const [valorVenda, setValorVenda] = useState(produtoExistente?.valorVenda?.toString() || '');
    const [tamanho, setTamanho] = useState(produtoExistente?.tamanho || '');
    const [cor, setCor] = useState(produtoExistente?.cor || '');
    
    // 1. ESTADO PARA CONTROLAR A VISIBILIDADE DO MODAL
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: isEditando ? 'Editar Produto' : 'Novo Produto',
        });
    }, [isEditando, navigation]);

    const handleSalvar = async () => {
        if (!nome.trim()) {
            Alert.alert("Atenção", "O nome do produto é obrigatório.");
            return;
        }

        const dadosProduto: Partial<Produto> = {
            nome, descricao, tamanho, cor,
            valorCompra: parseFloat(valorCompra.replace(',', '.')) || 0,
            valorVenda: parseFloat(valorVenda.replace(',', '.')) || 0,
        };

        try {
            let produtoSalvo: Produto;
            if (isEditando) {
                const response = await api.put<Produto>(`/produtos/editar/${produtoExistente.id_produto}`, dadosProduto);
                produtoSalvo = response.data;
            } else {
                const response = await api.post<Produto>('/produtos/cadastrar', dadosProduto);
                produtoSalvo = response.data;
            }

            if (typeof onSalvar === 'function') {
                onSalvar(produtoSalvo);
            }
            navigation.goBack();

        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            if (error.response) {
                Alert.alert("Erro ao Salvar", `O servidor respondeu com um erro: ${error.response.data.message || 'Verifique os dados.'}`);
            } else {
                Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
            }
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
            await api.delete(`/produtos/deletar/${produtoExistente.id_produto}`);
            if (typeof onExcluir === 'function') {
                onExcluir(produtoExistente.id_produto);
            }
            setDeleteModalVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            setDeleteModalVisible(false);
            Alert.alert("Erro", "Não foi possível excluir o produto.");
        }
    };

    return (
        <SafeAreaView style={stylesCadastro.safeArea}>
            {/* 4. JSX DO MODAL ADICIONADO À TELA */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isDeleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={stylesCadastro.modalOverlay}>
                    <View style={stylesCadastro.modalView}>
                        <Text style={stylesCadastro.modalTitle}>Confirmar Exclusão</Text>
                        <Text style={stylesCadastro.modalText}>
                            Deseja realmente excluir o produto "{nome}"?
                        </Text>
                        <View style={stylesCadastro.modalButtonContainer}>
                            <TouchableOpacity
                                style={[stylesCadastro.modalButton, stylesCadastro.modalButtonCancel]}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={stylesCadastro.modalButtonTextCancel}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[stylesCadastro.modalButton, stylesCadastro.modalButtonDelete]}
                                onPress={confirmarExclusao}
                            >
                                <Text style={stylesCadastro.modalButtonTextDelete}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <LinearGradient colors={gradientColors} style={stylesCadastro.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={stylesCadastro.headerTitle}>{isEditando ? 'Editar Produto' : 'Novo Produto'}</Text>
                <View style={{ width: 30 }} />
            </LinearGradient>
            
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView style={stylesCadastro.formContainer} keyboardShouldPersistTaps="handled">
                    <Text style={stylesCadastro.sectionTitle}>Informações Principais</Text>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Nome*</Text>
                        <TextInput style={stylesCadastro.input} value={nome} onChangeText={setNome} placeholder="Digite o nome do produto" />
                    </View>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Descrição</Text>
                        <TextInput style={[stylesCadastro.input, { height: 80 }]} value={descricao} onChangeText={setDescricao} placeholder="Detalhes do produto" multiline />
                    </View>
                    
                    <Text style={stylesCadastro.sectionTitle}>Valores</Text>
                    <View style={stylesCadastro.row}>
                        <View style={[stylesCadastro.inputContainer, { flex: 1, marginRight: 10 }]}>
                            <Text style={stylesCadastro.label}>Valor de Compra (R$)</Text>
                            <TextInput style={stylesCadastro.input} value={valorCompra} onChangeText={setValorCompra} placeholder="0,00" keyboardType="decimal-pad"/>
                        </View>
                        <View style={[stylesCadastro.inputContainer, { flex: 1, marginLeft: 10 }]}>
                            <Text style={stylesCadastro.label}>Valor de Venda (R$)</Text>
                            <TextInput style={stylesCadastro.input} value={valorVenda} onChangeText={setValorVenda} placeholder="0,00" keyboardType="decimal-pad"/>
                        </View>
                    </View>

                    <Text style={stylesCadastro.sectionTitle}>Variações (Opcional)</Text>
                    <View style={stylesCadastro.row}>
                        <View style={[stylesCadastro.inputContainer, { flex: 1, marginRight: 10 }]}>
                            <Text style={stylesCadastro.label}>Tamanho</Text>
                            <TextInput style={stylesCadastro.input} value={tamanho} onChangeText={setTamanho} placeholder="Ex: P, M, 38"/>
                        </View>
                        <View style={[stylesCadastro.inputContainer, { flex: 1, marginLeft: 10 }]}>
                            <Text style={stylesCadastro.label}>Cor</Text>
                            <TextInput style={stylesCadastro.input} value={cor} onChangeText={setCor} placeholder="Ex: Azul, Preto"/>
                        </View>
                    </View>

                    <TouchableOpacity style={stylesCadastro.saveButton} onPress={handleSalvar}>
                        <MaterialIcons name="save" size={22} color="white" style={{ marginRight: 10 }} />
                        <Text style={stylesCadastro.saveButtonText}>Salvar Produto</Text>
                    </TouchableOpacity>

                    {isEditando && (
                        <TouchableOpacity style={stylesCadastro.deleteButton} onPress={handleExcluir}>
                           <Ionicons name="trash-bin-outline" size={22} color="#FFFFFF" />
                           <Text style={stylesCadastro.deleteButtonText}>Excluir Produto</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const stylesCadastro = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, paddingTop: 45 },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    formContainer: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    inputContainer: { marginBottom: 10 },
    label: { fontSize: 15, color: solidBlue, marginBottom: 8, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#333333', backgroundColor: '#F8F9FA' },
    saveButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#27ae60', padding: 16, borderRadius: 10, marginTop: 20 },
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
