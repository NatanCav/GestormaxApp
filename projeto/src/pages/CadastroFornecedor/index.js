import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Define as cores do gradiente e a cor sólida
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

// Componente reutilizável para cada linha de input
const InputField = ({ label, value, onChangeText, iconName, keyboardType = 'default', multiline = false }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor="#A9A9A9"
      keyboardType={keyboardType}
      multiline={multiline}
    />
    {iconName && (
        <Ionicons name={iconName} size={24} color={solidBlue} style={styles.inputIcon} />
    )}
  </View>
);

export default function CadastroFornecedor({ navigation }) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cnpj, setCnpj] = useState(''); 

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Validar dados (exemplo básico)
    if (!nome.trim() || !email.trim()) {
        Alert.alert("Erro", "Nome são obrigatórios.");
        return;
    }

    // Coleta os dados atualizados
    const fornecedorData = { nome, endereco, telefone, cnpj };
    console.log("Salvar Fornecedor:", fornecedorData);

    // TODO: Chamar API para salvar no backend

    Alert.alert("Sucesso!", "Fornecedor salvo (simulado).", [
        { text: "OK", onPress: handleGoBack }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header com Gradiente */}
      <LinearGradient
        colors={gradientColors}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Fornecedor</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informações do Fornecedor</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Nome" 
                            placeholderTextColor="#999"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Endereço" 
                            placeholderTextColor="#999"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Telefone" 
                            keyboardType="phone-pad"
                            placeholderTextColor="#999"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="CPF" 
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton}>
                      <Text style={styles.saveButtonText}>Salvar Fornecedor</Text>
                    </TouchableOpacity>

                </View>
                
            </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flexGrow: 1,
  },
content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingTop: 30,
        minHeight: '100%',
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
        color: '#116EB0',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#333',
    },
        saveButton: {
        backgroundColor: '#116EB0',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});