import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';

import * as Animatable from 'react-native-animatable'


export default function PrincipalMenu(){
    return(
        <View style={styles.container}>
            <Text>Tela Menu Principal</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#116EB0',
        flex: 1,
    }
});

