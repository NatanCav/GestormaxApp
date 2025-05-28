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

export default function CadastroFornecedorScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cnpj, setCnpj] = useState(''); 

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Validar dados (exemplo básico)
    if (!nome.trim() || !email.trim()) {
        Alert.alert("Erro", "Nome e E-mail são obrigatórios.");
        return;
    }

    // Coleta os dados atualizados
    const fornecedorData = { nome, endereco, email, telefone, cnpj };
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView style={styles.container}>
            {/* --- Campos do formulário Atualizados --- */}
            <InputField label="Nome" value={nome} onChangeText={setNome} iconName="person-outline" />
            <InputField label="Endereço" value={endereco} onChangeText={setEndereco} iconName="map-outline" />
            <InputField label="E-mail" value={email} onChangeText={setEmail} iconName="mail-outline" keyboardType="email-address" />
            <InputField label="Telefone" value={telefone} onChangeText={setTelefone} iconName="call-outline" keyboardType="phone-pad" />
            <InputField label="CNPJ" value={cnpj} onChangeText={setCnpj} iconName="document-text-outline" keyboardType="numeric" />

            {/* Espaço extra no final para não colar na barra de navegação */}
            <View style={{ height: 50 }} />

          </ScrollView>
      </TouchableWithoutFeedback>
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
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: solidBlue, // Linha azul
    marginBottom: 30,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 17,
    color: '#333333',
    height: 50,
  },
  inputMultiline: { // Mantido caso precise de multiline em outro campo futuro
      height: 100,
      textAlignVertical: 'top',
      paddingTop: 15,
  },
  inputIcon: {
    marginLeft: 10,
  },
});