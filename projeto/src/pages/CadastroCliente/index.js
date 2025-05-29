import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CadastroCliente({ route, navigation }) {

    // Se receber um clienteExistente, é modo edição. Se não, é cadastro novo.
  const { clienteExistente } = route.params || {};
  
  // Estados dos campos
  const [nome, setNome] = useState(clienteExistente?.nome || '');
  const [telefone, setTelefone] = useState(clienteExistente?.telefone || '');
  const [cpf, setCpf] = useState(clienteExistente?.cpf || '');
  const [endereco, setEndereco] = useState(clienteExistente?.endereco || '');
  const [email, setEmail] = useState(clienteExistente?.email || '');

  // Atualiza título da navegação
  useEffect(() => {
    navigation.setOptions({
      title: route.params?.clienteExistente 
      ? 'Editar Cliente' 
      : 'Novo Cliente'
    });
  }, [route.params?.clienteExistente]);

  const handleSalvar = () => {
    const clienteData = { nome, telefone, cpf, endereço, email };
    
    if (route.params?.clienteExistente) {
      // Lógica para ATUALIZAR (PUT)
      console.log('Atualizando cliente:', route.params.clienteExistente.id, clienteData);
    } else {
      // Lógica para CADASTRAR (POST)
      console.log('Cadastrando novo cliente:', clienteData);
    }
    
    navigation.goBack();
  };

    
    return (
        <LinearGradient
            colors={['#0C4B8E', '#116EB0']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Cabeçalho com botão de voltar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Adicionar Cliente</Text>
                <View style={{ width: 28 }} /> {/* Espaço para alinhamento */}
            </View>

            {/* Corpo do formulário */}
            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Nome completo" 
                            placeholderTextColor="#999"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Endereço" 
                            placeholderTextColor="#999"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="E-mail" 
                            keyboardType="email-address"
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
                        <Text style={styles.saveButtonText}>Salvar Cliente</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
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