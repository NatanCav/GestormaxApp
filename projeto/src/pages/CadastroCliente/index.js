import React from 'react'
import {  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'

export default function CadastroCliente(){
    return(
 <ScrollView style={styles.container}>
      <Text style={styles.header}>Adicionar cliente</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nome</Text>
        <TextInput style={styles.input} placeholder="Nome completo" />
        
        <TextInput style={styles.input} placeholder="Endereço" />
        <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Telefone" keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="NIF" keyboardType="numeric" />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes bancários</Text>
        <TextInput style={styles.input} placeholder="Notas" multiline />
        <TextInput style={styles.input} placeholder="Desconto (%)" keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="0,00" keyboardType="numeric" />
      </View>
      
      <TouchableOpacity style={styles.hideButton}>
        <Text style={styles.hideButtonText}>Ocultar</Text>
      </TouchableOpacity>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 25,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E88E5',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  hideButton: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  hideButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});