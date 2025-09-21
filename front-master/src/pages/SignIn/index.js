import React, { useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Modal, 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';

import api from '../../services/api';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function SignIn() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');

    const validarLogin = async () => {
        if (!email.trim() || !senha.trim()) {
            setMensagemModal('Por favor, preencha todos os campos!');
            setModalVisivel(true);
            return;
        }

        setIsLoading(true);

        try {
            // --- 1. URL CORRIGIDA PARA CORRESPONDER AO BACKEND ---
            const response = await api.post('/auth/login', {
                email: email,
                senha: senha
            });
            
            // --- 2. LÓGICA DE SUCESSO CORRIGIDA ---
            // Se o login for válido, o backend retorna status 200.
            // Se for inválido, ele retorna 401, que cai no bloco 'catch'.
            if (response.status === 200) {
                console.log('Login válido, navegando para o menu principal...');
                console.log('Resposta do servidor:', response.data); // Deve ser "Login realizado com sucesso"

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'PrincipalMenu' }],
                });
            }
            
        } catch (error) {
            console.error('Erro no login:', error);
            
            // --- 3. LÓGICA DE ERRO CORRIGIDA ---
            if (error.response && error.response.status === 401) {
                // Captura o erro 401 (UNAUTHORIZED) do backend
                // e exibe a mensagem "Email ou senha inválidos"
                setMensagemModal(error.response.data);
            } else {
                // Outros erros (rede, servidor fora do ar)
                setMensagemModal('Não foi possível conectar. Verifique sua conexão e a URL da API.');
            }
            setModalVisivel(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }} 
        >
            <View style={styles.container}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisivel}
                    onRequestClose={() => setModalVisivel(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalText}>{mensagemModal}</Text>
                            <TouchableOpacity
                                style={styles.modalBotao}
                                onPress={() => setModalVisivel(false)}>
                                <Text style={{ color: '#ffff' }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <Animatable.View animation={"fadeInDown"} delay={300} style={styles.containerHeader}>
                        <Animatable.Image
                            animation="pulse"
                            iterationCount="infinite"
                            source={require('../../assets/logoUser.png')}
                            style={styles.logo}
                            resizeMode='contain'
                        />
                        <Text style={styles.message}>Bem-Vindo(a)</Text>
                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                        <Text style={styles.title}>Email</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholder='Digite um email'
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.title}>Senha</Text>
                        <TextInput
                            onChangeText={setSenha}
                            value={senha}
                            placeholder='Digite sua senha'
                            style={styles.input}
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={[styles.button, isLoading && { backgroundColor: '#a1a1a1' }]}
                            onPress={validarLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>Acessar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonRegister}>
                            <Text style={styles.registerText}>Esqueci a Senha.</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#116EB0',
    },
    containerHeader: {
        marginBottom: '8%',
        alignItems: 'center'
    },
    logo: {
        width: 150,
        height: 150,
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    containerForm: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 25,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 20,
        marginTop: 15,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#116EB0',
        width: '100%',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText: {
        color: '#a1a1a1'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%'
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    modalBotao: {
        backgroundColor: '#116EB0',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5
    }
});