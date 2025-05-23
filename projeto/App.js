// Importações dos componentes
import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Rotas from './src/rotas';

// Função padrão
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#38A69D" barStyle="light-content"/>
      <Rotas/>
    </NavigationContainer>
  );
}
