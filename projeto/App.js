// Importações de tags e funções
import { StyleSheet, Text, View } from 'react-native';

// Função padrão
export default function HomeScreen() {
  return (
    // Denominando View como "container" para estilização
    // Denominando Text como "title" para estilização
    <View style={styles.container}>
      <Text style={styles.title}>Hello World!</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
  }
});
