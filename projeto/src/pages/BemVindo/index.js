
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable'

import { useNavigation} from '@react-navigation/native'

export default function BemVindo() {
    const navigator = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                animation="flipInY"
                  source={require('../../assets/logo.png')}
                  style={{width: '100%'}}
                  resizeMode='contain'
                />
            </View>

            <Animatable.View
            delay={600}
            animation="fadeInUp" 
            style={styles.containerForm}>

                <Text style={styles.title}>Cadastro, pedido, estoque. Tudo fácil.</Text>
                <Text style={styles.text}>Faça o login para começar</Text>

                <TouchableOpacity 
                style={styles.button}
                onPress={ () => navigator.navigate('SignIn')}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#116EB0',
        flex: 1,
    },
    containerLogo: {
        flex: 2,
        backgroundColor: '#116EB0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerForm:{
        flex:1.2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd:'5%',
    },
    title:{
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12,
    },
    text:{
        color: '#a1a1a1',
        fontSize: 18,
    },
    button:{
        position: 'absolute',
        backgroundColor: '#006C9E',
        borderRadius: 50,
        paddingVertical: 10,
        width: '80%',
        alignSelf: 'center',
        bottom: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText:{
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    }
})