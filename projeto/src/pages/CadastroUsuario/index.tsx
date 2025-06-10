import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
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
    const [senha, setSenha] = useState(''); // A senha nunca deve ser pré-preenchida

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
        // Só envie a senha se ela foi digitada
        if (senha) {
            dadosUsuario.senha = senha;
        }

        try {
            let usuarioSalvo: Usuario;
            if (isEditando) {
                // --- ENDPOINT: PUT /usuarios/editar/:id ---
                const response = await api.put<Usuario>(`/usuarios/editar/${usuarioExistente.idUsuario}`, dadosUsuario);
                usuarioSalvo = response.data;
            } else {
                // --- ENDPOINT: POST /usuarios/cadastrar ---
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

    const handleExcluir = () => {
        if (!isEditando) return;
        Alert.alert("Confirmar Exclusão", `Deseja realmente excluir o usuário "${nomeUsuario}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir", style: "destructive",
                    onPress: async () => {
                        try {
                            // --- ENDPOINT: DELETE /usuarios/deletar/:id ---
                            await api.delete(`/usuarios/deletar/${usuarioExistente.idUsuario}`);
                            if (typeof onExcluir === 'function') {
                                onExcluir(usuarioExistente.idUsuario);
                            }
                            navigation.goBack();
                        } catch (error) {
                            console.error("Erro ao excluir usuário:", error);
                            Alert.alert("Erro", "Não foi possível excluir o usuário.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <LinearGradient colors={gradientColorsCadastro} style={stylesCadastro.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={stylesCadastro.headerTitle}>{isEditando ? 'Editar Usuário' : 'Novo Usuário'}</Text>
                <TouchableOpacity onPress={handleSalvar}>
                    <MaterialIcons name="save" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView contentContainerStyle={stylesCadastro.formContainer}>
                <View style={stylesCadastro.content}>
                    <Text style={stylesCadastro.sectionTitle}>Dados do Usuário</Text>
                    <TextInput style={stylesCadastro.input} placeholder="Nome do Usuário*" value={nomeUsuario} onChangeText={setNomeUsuario} />
                    <TextInput style={stylesCadastro.input} placeholder="E-mail*" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={stylesCadastro.input} placeholder={isEditando ? "Nova Senha (deixe em branco para não alterar)" : "Senha*"} value={senha} onChangeText={setSenha} secureTextEntry />
                    
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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 35 },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    formContainer: { flexGrow: 1, backgroundColor: 'white' },
    content: { padding: 25 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: solidBlueCadastro, marginBottom: 20 },
    input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 18, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', padding: 16, borderRadius: 10, marginTop: 30 },
    deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});
