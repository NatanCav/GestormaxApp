import React from 'react';
import { View, Text, Image , StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable';
import { useNavigation} from '@react-navigation/native';

export default function SignIn() {

    const navigator = useNavigation();
    
    return (
        <View style={styles.container}>
            <Animatable.View animation={"fadeInLeft"}
            delay={500} style={styles.containerHeader}
            >
                <Animatable.Image
                animation="flipInY"
                source={require('../../assets/logoUser.png')}
                style={{
                width: 250,
                height: 250,
                alignSelf: 'center',
                }}
                resizeMode='center'
                />

                <Text style={styles.message}>Bem-Vindo(a)</Text>

            </Animatable.View >

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                 placeholder='Digite um email'
                 style={styles.input}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                 placeholder='Senha'
                 style={styles.input}
                />

                <TouchableOpacity 
                style={styles.button}
                onPress={ () => navigator.navigate('PrincipalMenu')}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRegister}>
                    <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>

            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create ({
    container:{
        flex: 1,
        backgroundColor: '#116EB0',
    },
    containerHeader:{
        marginTop: '15%',
        marginBottom: '8%',
        paddingStart: '0%',
        alignItems: 'center'
        
    },
    message:{
        padding: 0,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    containerForm:{
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title:{
        fontSize: 20,
        marginTop: 5,

    },
    input:{
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button:{
        backgroundColor: '#116EB0',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister:{
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText:{
        color: '#a1a1a1'
    }
})