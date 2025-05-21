// Importações dos componentes
import { StyleSheet, Text, View, Image } from 'react-native';

const img = require("./assets/gato.jpg")
// Função padrão
export default function HomeScreen() {
  return (
    // Denominando View como "container" para estilização
    // Denominando Text como "title" para estilização
    <View style={styles.container}>
      <Text style={styles.titulo}>Hello World!</Text>
      <Image source={img} />
    </View>
  );
}

// Criando constante de nome "styles" para estilização dos elementos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  }
});
