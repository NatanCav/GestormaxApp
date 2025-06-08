import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

export default function CadastroProduto({ navigation, route }) {
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
            valor: parseFloat(valor) || 0,
            quantidade: parseInt(quantidade) || 0,
        };

        try {
            let produtoSalvo;
            if (isEditando) {
                // --- ENDPOINT: PUT /produtos/editar/:id ---
                const response = await api.put(`/produtos/editar/${produtoExistente.id_produto}`, dadosProduto);
                produtoSalvo = response.data;
            } else {
                // --- ENDPOINT: POST /produtos/cadastrar ---
                const response = await api.post('/produtos/cadastrar', dadosProduto);
                produtoSalvo = response.data;
            }

            if (typeof onSalvar === 'function') {
                onSalvar(produtoSalvo);
            }
            navigation.goBack();

        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            Alert.alert("Erro", "Não foi possível salvar o produto.");
        }
    };

    const handleExcluir = () => {
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
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={gradientColors} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditando ? 'Editar Produto' : 'Novo Produto'}</Text>
                <TouchableOpacity onPress={handleSalvar}>
                    <Ionicons name="checkmark" size={30} color="#FFFFFF" />
                </TouchableOpacity>
            </LinearGradient>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome*</Text>
                        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite o nome" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Código*</Text>
                        <TextInput style={styles.input} value={codigo} onChangeText={setCodigo} placeholder="Digite o código" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Digite a descrição" multiline />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Valor (R$)</Text>
                        <TextInput style={styles.input} value={valor} onChangeText={setValor} placeholder="0.00" keyboardType="decimal-pad"/>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Categoria</Text>
                        <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Digite a categoria" />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Quantidade em Estoque</Text>
                        <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} placeholder="0" keyboardType="numeric" />
                    </View>

                    {isEditando && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
                           <Ionicons name="trash-bin-outline" size={22} color="#FFFFFF" />
                           <Text style={styles.deleteButtonText}>Excluir Produto</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
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