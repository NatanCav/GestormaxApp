//================================================================
// ARQUIVO: CadastroUsuario.tsx (COM MODAL DE EXCLUSÃO)
// A função handleExcluir agora abre um Modal em vez de um Alert.
//================================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Platform, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

import { Usuario, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const gradientColorsCadastro = ['#0C4B8E', '#116EB0'] as const;
const solidBlueCadastro = '#116EB0';

type PropsCadastro = NativeStackScreenProps<RootStackParamList, 'CadastroUsuario'>;

export default function CadastroUsuario({ navigation, route }: PropsCadastro) {
    const { usuarioExistente, onSalvar, onExcluir } = route.params || {};
    const isEditando = !!usuarioExistente;

    const [nomeUsuario, setNomeUsuario] = useState(usuarioExistente?.nomeUsuario || '');
    const [email, setEmail] = useState(usuarioExistente?.email || '');
    const [senha, setSenha] = useState('');
    
    // --- 1. ESTADO PARA CONTROLAR A VISIBILIDADE DO MODAL ---
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        navigation.setOptions({ title: isEditando ? 'Editar Usuário' : 'Novo Usuário' });
    }, [isEditando, navigation]);

    const handleSalvar = async () => {
        if (!nomeUsuario.trim() || !email.trim()) {
            Alert.alert("Atenção", "Nome e E-mail são obrigatórios.");
            return;
        }
        if (!isEditando && !senha) {
            Alert.alert("Atenção", "A senha é obrigatória para novos usuários.");
            return;
        }

        const dadosUsuario: Partial<Usuario> = { nomeUsuario, email };
        if (senha) {
            dadosUsuario.senha = senha;
        }

        try {
            let usuarioSalvo: Usuario;
            if (isEditando) {
                const response = await api.put<Usuario>(`/usuarios/editar/${usuarioExistente.id_usuario}`, dadosUsuario);
                usuarioSalvo = response.data;
            } else {
                const response = await api.post<Usuario>('/usuarios/cadastrar', dadosUsuario);
                usuarioSalvo = response.data;
            }

            if (typeof onSalvar === 'function') {
                onSalvar(usuarioSalvo);
            }
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            Alert.alert("Erro", "Não foi possível salvar o usuário.");
        }
    };

    // --- 2. handleExcluir AGORA APENAS ABRE O MODAL ---
    const handleExcluir = () => {
        if (!isEditando) return;
        setDeleteModalVisible(true);
    };

    // --- 3. NOVA FUNÇÃO PARA REALMENTE EXECUTAR A EXCLUSÃO ---
    const confirmarExclusao = async () => {
        if (!isEditando) return;
        try {
            await api.delete(`/usuarios/deletar/${usuarioExistente.id_usuario}`);
            if (typeof onExcluir === 'function') {
                onExcluir(usuarioExistente.id_usuario);
            }
            setDeleteModalVisible(false); // Fecha o modal
            navigation.goBack(); // Navega de volta
        } catch (error) {
            console.error("Erro na chamada da API de exclusão:", error);
            setDeleteModalVisible(false); // Fecha o modal mesmo se der erro
            Alert.alert("Erro", "Não foi possível excluir o usuário.");
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {/* --- 4. JSX DO MODAL ADICIONADO À TELA --- */}
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
                            Deseja realmente excluir o usuário "{nomeUsuario}"? Esta ação não pode ser desfeita.
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


            <LinearGradient colors={gradientColorsCadastro} style={stylesCadastro.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={stylesCadastro.headerTitle}>{isEditando ? 'Editar Usuário' : 'Novo Usuário'}</Text>
                <View style={{ width: 28 }} />
            </LinearGradient>

            <ScrollView contentContainerStyle={stylesCadastro.formContainer}>
                <View style={stylesCadastro.content}>
                    <Text style={stylesCadastro.sectionTitle}>Dados do Usuário</Text>
                    <TextInput style={stylesCadastro.input} placeholder="Nome do Usuário*" value={nomeUsuario} onChangeText={setNomeUsuario} />
                    <TextInput style={stylesCadastro.input} placeholder="E-mail*" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={stylesCadastro.input} placeholder={isEditando ? "Nova Senha (deixe em branco para não alterar)" : "Senha*"} value={senha} onChangeText={setSenha} secureTextEntry />
                    
                    <TouchableOpacity style={stylesCadastro.saveButton} onPress={handleSalvar}>
                        <MaterialIcons name="save" size={22} color="white" style={{marginRight: 10}}/>
                        <Text style={stylesCadastro.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>

                    {isEditando && (
                        <TouchableOpacity style={stylesCadastro.deleteButton} onPress={handleExcluir}>
                           <MaterialIcons name="delete-forever" size={22} color="#FFFFFF" />
                           <Text style={stylesCadastro.deleteButtonText}>Excluir Usuário</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const stylesCadastro = StyleSheet.create({
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 35 },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    formContainer: { flexGrow: 1, backgroundColor: 'white' },
    content: { padding: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: solidBlueCadastro, marginBottom: 20 },
    input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 18, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    saveButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#27ae60', padding: 16, borderRadius: 10, marginTop: 20, elevation: 2 },
    saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, },
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
        justifyContent: 'space-between',
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
