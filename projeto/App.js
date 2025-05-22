// Importações dos componentes
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';

const img = require("./assets/macaco.jpg")
// Função padrão
export default function HomeScreen() {
  return (
    // Denominando View como "container" para estilização
    // Denominando Text como "title" para estilização
    <View style={styles.container}>
      
      <Text style={styles.titulo}>Bem Vindo Macaco</Text>
      
      <Image style={styles.img1} source={img}  />
      
      <TextInput 
      style={styles.input} 
      placeholder='Nome' 
      autoCorrect={false}
      />

      <TextInput 
      style={styles.input} 
      placeholder='Email' 
      autoCapitalize='none' 
      keyboardType='email-address' 
      autoCorrect={false}
      />

      <TextInput 
      style={styles.input} 
      placeholder='Senha' 
      autoCapitalize='none' 
      secureTextEntry 
      autoCorrect={false}
      />
    </View>
  );
}

// Criando constante de nome "styles" para estilização dos elementos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  img1: {
    width: 150,
    height: 200,
    marginVertical: 10,
    
  },
  input: {
    borderWidth: 1,
    width: 300,
    height: 45,
    borderRadius: 6,
    borderColor: "black",
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: '#e2e9f0',
    marginVertical: 10,
  }
});
