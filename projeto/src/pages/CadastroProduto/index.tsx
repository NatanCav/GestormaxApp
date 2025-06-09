import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

// 1. IMPORTANDO OS TIPOS
import { Produto, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

// 2. TIPANDO AS PROPS DO COMPONENTE
type Props = NativeStackScreenProps<RootStackParamList, 'CadastroProduto'>;

export default function CadastroProduto({ navigation, route }: Props) {
    const { produtoExistente, onSalvar, onExcluir } = route.params || {};
    const isEditando = !!produtoExistente;
    
    const [nome, setNome] = useState(produtoExistente?.nome || '');
    const [codigo, setCodigo] = useState(produtoExistente?.codigo || '');
    const [descricao, setDescricao] = useState(produtoExistente?.descricao || '');
    const [categoria, setCategoria] = useState(produtoExistente?.categoria || '');
    const [valor, setValor] = useState(produtoExistente?.valor?.toString() || '');
    const [quantidade, setQuantidade] = useState(produtoExistente?.quantidade?.toString() || '0');

    useEffect(() => {
        navigation.setOptions({
            title: isEditando ? 'Editar Produto' : 'Novo Produto',
        });
    }, [isEditando, navigation]);

    const handleSalvar = async () => {
        if (!nome.trim() || !codigo.trim()) {
            Alert.alert("Atenção", "Nome e Código do produto são obrigatórios.");
            return;
        }

        const dadosProduto = {
            nome,
            codigo,
            descricao,
            categoria,
            valor: parseFloat(valor.replace(',', '.')) || 0, // Garante que a vírgula vire ponto
            quantidade: parseInt(quantidade) || 0,
        };

        try {
            let produtoSalvo: Produto;
            if (isEditando) {
                // --- ENDPOINT: PUT /produtos/editar/:id ---
                const response = await api.put<Produto>(`/produtos/editar/${produtoExistente.id_produto}`, dadosProduto);
                produtoSalvo = response.data;
            } else {
                // --- ENDPOINT: POST /produtos/cadastrar ---
                const response = await api.post<Produto>('/produtos/cadastrar', dadosProduto);
                produtoSalvo = response.data;
            }

            if (typeof onSalvar === 'function') {
                onSalvar(produtoSalvo);
            }
            navigation.goBack();

        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            // 4. LOG DE ERRO MAIS DETALHADO
            if (error.response) {
                console.error("Detalhes do erro:", error.response.data);
                Alert.alert("Erro ao Salvar", `O servidor respondeu com um erro: ${error.response.data.message || 'Verifique os dados.'}`);
            } else {
                Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
            }
        }
    };

    const handleExcluir = () => {
        if (!isEditando) return;
        Alert.alert(
            "Confirmar Exclusão",
            `Deseja realmente excluir o produto "${nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // --- ENDPOINT: DELETE /produtos/deletar/:id ---
                            await api.delete(`/produtos/deletar/${produtoExistente.id_produto}`);
                            if (typeof onExcluir === 'function') {
                                onExcluir(produtoExistente.id_produto);
                            }
                            navigation.goBack();
                        } catch (error) {
                            console.error("Erro ao excluir produto:", error);
                            Alert.alert("Erro", "Não foi possível excluir o produto.");
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
                <Text style={stylesCadastro.headerTitle}>{isEditando ? 'Editar Produto' : 'Novo Produto'}</Text>
                <TouchableOpacity onPress={handleSalvar}>
                    <Ionicons name="checkmark" size={30} color="#FFFFFF" />
                </TouchableOpacity>
            </LinearGradient>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView style={stylesCadastro.formContainer}>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Nome*</Text>
                        <TextInput style={stylesCadastro.input} value={nome} onChangeText={setNome} placeholder="Digite o nome" />
                    </View>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Código*</Text>
                        <TextInput style={stylesCadastro.input} value={codigo} onChangeText={setCodigo} placeholder="Digite o código" />
                    </View>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Descrição</Text>
                        <TextInput style={stylesCadastro.input} value={descricao} onChangeText={setDescricao} placeholder="Digite a descrição" multiline />
                    </View>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Valor (R$)</Text>
                        <TextInput style={stylesCadastro.input} value={valor} onChangeText={setValor} placeholder="0,00" keyboardType="decimal-pad"/>
                    </View>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Categoria</Text>
                        <TextInput style={stylesCadastro.input} value={categoria} onChangeText={setCategoria} placeholder="Digite a categoria" />
                    </View>
                    <View style={stylesCadastro.inputContainer}>
                        <Text style={stylesCadastro.label}>Quantidade em Estoque</Text>
                        <TextInput style={stylesCadastro.input} value={quantidade} onChangeText={setQuantidade} placeholder="0" keyboardType="numeric" />
                    </View>

                    {isEditando && (
                        <TouchableOpacity style={stylesCadastro.deleteButton} onPress={handleExcluir}>
                           <Ionicons name="trash-bin-outline" size={22} color="#FFFFFF" />
                           <Text style={stylesCadastro.deleteButtonText}>Excluir Produto</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const stylesCadastro = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, paddingTop: 45 },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    formContainer: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 16, color: solidBlue, marginBottom: 8, fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: solidBlue, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#333333', backgroundColor: '#F8F9FA' },
    deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', padding: 16, borderRadius: 10, marginTop: 25 },
    deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});
