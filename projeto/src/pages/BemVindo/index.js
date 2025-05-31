import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function BemVindo() {
    const navigator = useNavigation();

    return (
        <View style={styles.container}>
        {/* Seção Superior (Logo e Nome) */}
        <View style={styles.logoContainer}>
            <Animatable.Image
                animation="flipInY"
                duration={1500} // Aumentei um pouco a duração para ser mais perceptível
                source={require('../../assets/LogoPNG.png')} // Substitua pelo caminho CORRETO da sua log
                style={styles.logoImage}
                resizeMode="contain"
            />
        </View>

        {/* Seção Inferior (Texto e Botão) */}
        <Animatable.View
            style={styles.contentContainer}
            animation="fadeInUp"
            duration={1000}
            delay={1200}
        >
            <Text style={styles.title}>Cadastro, pedido, estoque.</Text>
            <Text style={styles.subtitle}>Tudo fácil.</Text>
            <Text style={styles.description}>Faça login para começar</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigator.navigate('SignIn')} // Verifique a rota 'SignIn'
            >
                <Text style={styles.buttonText}>Acessar</Text>
                <Image
                    source={require('../../assets/seta_direita.png')} // Substitua pelo caminho CORRETO da sua seta branca
                    style={styles.buttonArrow}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </Animatable.View>
    </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#116EB0', // Cor de fundo principal
        justifyContent: 'space-between', // Distribui o espaço entre as seções
    },
    logoContainer: {
        flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    logoImage: {
        marginTop: 300,
        width: '70%', // Ajuste o tamanho da logo
    maxHeight: '60%',
    },
    contentContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: '8%',
        paddingTop: 60,
        paddingBottom: 80, // Mais espaço na parte inferior
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#007BFF', // Um azul um pouco mais vibrante para o botão
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 10,
    },
    buttonArrow: {
        width: 24,
        height: 24,
    },
});