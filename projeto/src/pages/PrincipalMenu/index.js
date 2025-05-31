import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MenuPrincipal({ navigation }) {
  const menuItems = [
    { title: 'Clientes', icon: 'people' },
    { title: 'Vendedores', icon: 'person' },
    { title: 'Fornecedores', icon: 'local-shipping' },
    { title: 'Produtos', icon: 'shopping-basket' },
    { title: 'Movimentações', icon: 'swap-horiz' },
    { title: 'Relatórios', icon: 'assessment' },
  ];

  const screenWidth = Dimensions.get('window').width;
  const buttonSize = (screenWidth - 60) / 2;

  return (
    <LinearGradient
      colors={['#0C4B8E', '#116EB0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Botão de Voltar no Header */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

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
              onPress={() => navigation.navigate(item.title)}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60, // Espaço para o botão de voltar
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
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
    justifyContent: 'space-between',
  },
  menuButton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
});