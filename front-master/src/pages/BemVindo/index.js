// Importações necessárias do React Native
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable'; // Biblioteca para animações
import { useNavigation } from '@react-navigation/native'; // Hook para navegação entre telas

// Componente principal da tela de Bem vindo
export default function BemVindo() {
    // constante para acessar as funções de navegação
    const navigator = useNavigation();

    return (
        // Container principal que ocupa toda a tela
        <View style={styles.container}>
        {/* Seção Superior (Logo e Nome) */}
        {/* Container para centralizar a logo na parte superior */}
        <View style={styles.logoContainer}>
            {/* Logo animada com efeito de rotação no eixo Y */}
            <Animatable.Image
                animation="flipInY" // Animação de entrada com rotação
                duration={1500} // Duração da animação em milissegundos
                source={require('../../assets/LogoPNG.png')} // Caminho para a imagem da logo
                style={styles.logoImage} // Estilos aplicados à logo
                resizeMode="contain" // Mantém proporção da imagem
            />
        </View>

        {/* Seção Inferior (Texto e Botão) */}
        {/* Container animado para o conteúdo inferior */}
        <Animatable.View
            style={styles.contentContainer} // Estilos do container branco inferior
            animation="fadeInUp" // Animação que faz o conteúdo surgir de baixo para cima
            duration={1000} // Duração da animação
            delay={1200} // Delay para começar após a animação da logo
        >
            {/* Título principal da aplicação */}
            <Text style={styles.title}>Cadastro, pedido, estoque.</Text>
            {/* Subtítulo complementar */}
            <Text style={styles.subtitle}>Tudo fácil.</Text>
            {/* Texto descritivo chamando para ação */}
            <Text style={styles.description}>Faça login para começar</Text>

            {/* Botão de acesso com ícone de seta */}
            <TouchableOpacity
                style={styles.button} // Estilos do botão
                onPress={() => navigator.navigate('SignIn')} // Navegação para tela de login
            >
                {/* Texto do botão */}
                <Text style={styles.buttonText}>Acessar</Text>
                {/* Ícone de seta para direita */}
                <Image
                    source={require('../../assets/seta_direita.png')} // Caminho para ícone da seta
                    style={styles.buttonArrow} // Estilos da seta
                    resizeMode="contain" // Mantém proporção do ícone
                />
            </TouchableOpacity>
        </Animatable.View>
    </View>

    );
}

// Estilos do componente usando StyleSheet
const styles = StyleSheet.create({
    // Container principal - ocupa toda a tela
    container: {
        flex: 1, // Ocupa todo o espaço disponível
        backgroundColor: '#116EB0', // Cor de fundo azul
        justifyContent: 'space-between', // Distribui espaço entre elementos verticalmente
    },
    // Container que centraliza a logo na parte superior
    logoContainer: {
        flex: 1, // Ocupa espaço flexível disponível
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    },
    // Estilos da imagem da logo
    logoImage: {
        marginTop: 300, // Margem superior para posicionamento
        width: '70%', // Largura relativa da tela
    maxHeight: '60%', // Altura máxima relativa
    },
    // Container do conteúdo inferior (área branca)
    contentContainer: {
        backgroundColor: '#FFFFFF', // Fundo branco
        marginTop: 20, // Espaçamento superior
        borderTopLeftRadius: 30, // Borda arredondada superior esquerda
        borderTopRightRadius: 30, // Borda arredondada superior direita
        paddingHorizontal: '8%', // Padding horizontal percentual
        paddingTop: 60, // Padding superior
        paddingBottom: 80, // Padding inferior para mais espaço
        alignItems: 'center', // Centraliza elementos horizontalmente
    },
    // Estilo do título principal
    title: {
        fontSize: 22, // Tamanho da fonte
        fontWeight: '600', // Peso da fonte (semi-bold)
        color: '#333', // Cor do texto (cinza escuro)
        textAlign: 'center', // Alinhamento centralizado
        marginBottom: 5, // Margem inferior pequena
    },
    // Estilo do subtítulo
    subtitle: {
        fontSize: 22, // Mesmo tamanho do título
        fontWeight: '600', // Mesmo peso do título
        color: '#333', // Mesma cor do título
        textAlign: 'center', // Centralizado
        marginBottom: 15, // Margem inferior maior
    },
    // Estilo do texto descritivo
    description: {
        fontSize: 16, // Fonte menor que título
        color: '#777', // Cinza mais claro
        textAlign: 'center', // Centralizado
        marginBottom: 40, // Margem inferior grande para espaçar do botão
    },
    // Estilos do botão de acesso
    button: {
        flexDirection: 'row', // Organiza filhos em linha (texto + ícone)
        backgroundColor: '#007BFF', // Cor de fundo azul do botão
        borderRadius: 50, // Bordas muito arredondadas (formato pill)
        paddingVertical: 15, // Padding vertical interno
        paddingHorizontal: 30, // Padding horizontal interno
        alignItems: 'center', // Centraliza conteúdo verticalmente
        justifyContent: 'center', // Centraliza conteúdo horizontalmente
        minWidth: '80%', // Largura mínima do botão
        // Propriedades de sombra para iOS
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 4 }, // Posição da sombra
        shadowOpacity: 0.3, // Opacidade da sombra
        shadowRadius: 5, // Raio de desfoque da sombra
        elevation: 6, // Elevação para sombra no Android
    },
    // Estilo do texto dentro do botão
    buttonText: {
        fontSize: 18, // Tamanho da fonte
        color: '#fff', // Cor branca
        fontWeight: 'bold', // Negrito
        marginRight: 10, // Espaço entre texto e ícone
    },
    // Estilo do ícone de seta no botão
    buttonArrow: {
        width: 24, // Largura fixa do ícone
        height: 24, // Altura fixa do ícone
    },
});