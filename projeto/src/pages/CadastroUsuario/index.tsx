
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
    // onExcluir foi removido daqui
    const { usuarioExistente, onSalvar } = route.params || {};
    const isEditando = !!usuarioExistente;

    const [nomeUsuario, setNomeUsuario] = useState(usuarioExistente?.nomeUsuario || '');
    const [email, setEmail] = useState(usuarioExistente?.email || '');
    const [senha, setSenha] = useState('');

    useEffect(() => {
        navigation.setOptions({ title: isEditando ? 'Editar Usuário' : 'Novo Usuário' });
    }, [isEditando, navigation]);

    const handleSalvar = async () => { /* ... sua função de salvar (inalterada) ... */ };

    // A função e o botão de excluir foram removidos desta tela.

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
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

                    {/* Botão de excluir foi removido */}
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
});