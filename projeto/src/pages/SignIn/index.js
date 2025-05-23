import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable'

export default function SignIn() {
    return (
        <View style={styles.container}>
            <Animatable.View animation={"fadeInLeft"}
            delay={500} style={styles.containerHeader}
            >
                <Text style={styles.message}>Bem-Vindo(a)</Text>

            </Animatable.View >

            <AnimatableView animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                 placeholder='Digite um email...'
                 style={styles.input}
                />
            </AnimatableView>
        </View>
    );
}

const styles = StyleSheet.create ({
    container:{

    },
})