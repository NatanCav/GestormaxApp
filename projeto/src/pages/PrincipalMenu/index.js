import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MenuPrincipal({ navigation }) {
  // Adicionado 'Estoque' à lista de itens do menu.
  // Também adicionei uma propriedade 'route' para tornar a navegação mais explícita.
  const menuItems = [
    { title: 'Clientes', icon: 'people', route: 'Clientes' },
    { title: 'Usuários', icon: 'person', route: 'Usuários' }, 
    { title: 'Fornecedores', icon: 'local-shipping', route: 'Fornecedores' },
    { title: 'Produtos', icon: 'shopping-basket', route: 'Produtos' },
    { title: 'Estoque', icon: 'inventory-2', route: 'Estoque' }, 
    { title: 'Movimentações', icon: 'swap-horiz', route: 'Movimentações' },
    { title: 'Relatórios', icon: 'assessment', route: 'Relatórios' }, 
  ];

  const handleNavigation = (route) => {
    // Verifica se a rota existe antes de navegar
    if (route) {
      navigation.navigate(route);
    } else {
      Alert.alert("Erro", "Rota de navegação não definida para este item.");
    }
  };


  return (
    // SafeAreaView garante que o conteúdo não fique por baixo de áreas do sistema (ex: notch)
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0C4B8E' }}>
      <LinearGradient
        colors={['#0C4B8E', '#116EB0']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header agora está dentro do fluxo normal, para melhor controlo */}
        <View style={styles.headerBar}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Stock e Inventário</Text>
            <Text style={styles.subHeader}>Loja Principal</Text>
          </View>

          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuButton}
                onPress={() => handleNavigation(item.route)} // Navega para a rota definida
              >
                <View style={styles.iconCircle}>
                  <MaterialIcons name={item.icon} size={28} color="#116EB0" />
                </View>
                <Text style={styles.buttonText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingTop: Platform.OS === 'android' ? 15 : 0,
    paddingHorizontal: 10,
  },
  backButton: {
    alignSelf: 'flex-start', // Alinha o botão à esquerda
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20, // Ajustado o espaçamento
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Garante espaçamento uniforme
  },
  menuButton: {
    width: '47%', // Ajustado para melhor espaçamento
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15, // Mais arredondado
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(17, 110, 176, 0.1)', // Fundo azul claro para o ícone
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
});
