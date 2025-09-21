// Importações necessárias do React e React Native
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, SafeAreaView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Biblioteca de ícones Material Design
import { LinearGradient } from 'expo-linear-gradient'; // Componente para criar gradientes
import api from '../../services/api'; // Serviço para requisições HTTP à API

// Importação de tipos TypeScript para tipagem
import { Cliente, RootStackParamList } from '../../types/index';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Definição do tipo Props para as propriedades do componente
type Props = NativeStackScreenProps<RootStackParamList, 'CadastroCliente'>;

// Constantes de cores para o gradiente e cor sólida azul
const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

// Componente principal para cadastro e edição de clientes
export default function CadastroCliente({ route, navigation }: Props) {
  // Desestruturação dos parâmetros recebidos via navegação
  const { clienteExistente, onSalvar, onExcluir } = route.params || {};
  // Determina se está no modo edição baseado na existência de um cliente
  const isEditando = !!clienteExistente;
  
  // Estados para armazenar os valores dos campos do formulário
  // Inicializados com os dados do cliente existente ou strings vazias
  const [nome, setNome] = useState(clienteExistente?.nome || '');
  const [telefone, setTelefone] = useState(clienteExistente?.telefone || '');
  const [cpf, setCpf] = useState(clienteExistente?.cpf || '');
  const [endereco, setEndereco] = useState(clienteExistente?.endereco || '');

  // 1. ESTADO PARA CONTROLAR A VISIBILIDADE DO MODAL
  // Estado boolean que controla se o modal de confirmação de exclusão está visível
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  // Hook useEffect para configurar o título da tela dinamicamente
  useEffect(() => {
    navigation.setOptions({
      title: isEditando ? 'Editar Cliente' : 'Novo Cliente'
    });
  }, [isEditando, navigation]); // Executa quando isEditando ou navigation mudam

  // Função assíncrona para salvar ou atualizar um cliente
  const handleSalvar = async () => {
    // Validação obrigatória: verifica se o nome não está vazio
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome do cliente é obrigatório.");
      return;
    }
    // Objeto com os dados do cliente para enviar à API
    const dadosCliente = { nome, telefone, cpf, endereco };

    try {
      let clienteSalvo: Cliente;
      // Verifica se está editando um cliente existente
      if (isEditando) {
        // Faz requisição PUT para atualizar cliente existente
        const response = await api.put<Cliente>(`/clientes/editar/${clienteExistente.id_cliente}`, dadosCliente);
        clienteSalvo = response.data;
      } else {
        // Faz requisição POST para criar novo cliente
        const response = await api.post<Cliente>('/clientes/cadastrar', dadosCliente);
        clienteSalvo = response.data;
      }

      // Chama callback de sucesso se foi fornecido e cliente foi salvo
      if (typeof onSalvar === 'function' && clienteSalvo) {
        onSalvar(clienteSalvo);
      }
      // Navega de volta para a tela anterior
      navigation.goBack();
    } catch (error) {
      // Log do erro no console para debug
      console.error("Erro ao salvar cliente:", error);
      // Exibe alerta de erro para o usuário
      Alert.alert("Erro", "Não foi possível salvar o cliente.");
    }
  };

  // 2. handleExcluir AGORA APENAS ABRE O MODAL
  // Função que apenas abre o modal de confirmação (não exclui diretamente)
  const handleExcluir = () => {
    if (!isEditando) return; // Só permite exclusão se estiver editando
    setDeleteModalVisible(true); // Torna o modal visível
  };

  // 3. NOVA FUNÇÃO PARA REALMENTE EXECUTAR A EXCLUSÃO
  // Função que executa a exclusão após confirmação no modal
  const confirmarExclusao = async () => {
    if (!isEditando) return; // Só executa se estiver no modo edição
    try {
        // Faz requisição DELETE para remover o cliente da API
        await api.delete(`/clientes/deletar/${clienteExistente.id_cliente}`);
        // Chama callback de exclusão se foi fornecido
        if (typeof onExcluir === 'function') {
            onExcluir(clienteExistente.id_cliente);
        }
        // Fecha o modal de confirmação
        setDeleteModalVisible(false);
        // Volta para a tela anterior
        navigation.goBack();
    } catch (error) {
        // Log do erro para debug
        console.error("Erro na chamada da API de exclusão:", error);
        // Fecha o modal mesmo em caso de erro
        setDeleteModalVisible(false);
        // Exibe alerta de erro para o usuário
        Alert.alert("Erro", "Não foi possível excluir o cliente.");
    }
  };

  return (
    // SafeAreaView garante que o conteúdo não sobreponha áreas do sistema (status bar, notch, etc.)
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* 4. JSX DO MODAL ADICIONADO À TELA */}
        {/* Modal para confirmação de exclusão do cliente */}
        <Modal
            animationType="fade" // Animação de fade in/out
            transparent={true} // Permite ver o fundo através do modal
            visible={isDeleteModalVisible} // Controla a visibilidade do modal
            onRequestClose={() => setDeleteModalVisible(false)} // Callback para botão voltar do Android
        >
            {/* Overlay semi-transparente que cobre toda a tela */}
            <View style={styles.modalOverlay}>
                {/* Container principal do modal com fundo branco */}
                <View style={styles.modalView}>
                    {/* Título do modal */}
                    <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                    {/* Texto de confirmação mostrando o nome do cliente */}
                    <Text style={styles.modalText}>
                        Deseja realmente excluir o cliente "{nome}"? Esta ação não pode ser desfeita.
                    </Text>
                    {/* Container para organizar os botões lado a lado */}
                    <View style={styles.modalButtonContainer}>
                        {/* Botão para cancelar a exclusão */}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonCancel]}
                            onPress={() => setDeleteModalVisible(false)}
                        >
                            <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                        </TouchableOpacity>
                        {/* Botão para confirmar a exclusão */}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonDelete]}
                            onPress={confirmarExclusao}
                        >
                            <Text style={styles.modalButtonTextDelete}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Header com gradiente azul contendo navegação e título */}
        <LinearGradient colors={gradientColors} style={styles.header}>
            {/* Botão de voltar com ícone de seta */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            {/* Título que muda dinamicamente baseado no modo (editar/novo) */}
            <Text style={styles.headerTitle}>{isEditando ? 'Editar Cliente' : 'Novo Cliente'}</Text>
            {/* View vazia para equilibrar o layout (spacer) */}
            <View style={{ width: 28 }} />
        </LinearGradient>

        {/* ScrollView permite rolagem quando o teclado aparece */}
        <ScrollView contentContainerStyle={styles.formContainer}>
            {/* Container principal do conteúdo do formulário */}
            <View style={styles.content}>
              {/* Seção agrupando os campos de informações pessoais */}
              <View style={styles.section}>
                {/* Título da seção */}
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                {/* Campo de entrada para nome (obrigatório - indicado com *) */}
                <TextInput style={styles.input} placeholder="Nome completo*" value={nome} onChangeText={setNome} placeholderTextColor="#999" />
                {/* Campo de entrada para endereço */}
                <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} placeholderTextColor="#999" />
                {/* Campo de entrada para telefone com teclado específico para números */}
                <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholderTextColor="#999" />
                {/* Campo de entrada para CPF com teclado numérico */}
                <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" placeholderTextColor="#999" />
              </View>
              
              {/* Botão principal para salvar o cliente (cor verde) */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                <Text style={styles.saveButtonText}>Salvar Cliente</Text>
              </TouchableOpacity>
              
              {/* Botão de exclusão - só aparece quando está editando um cliente existente */}
              {isEditando && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
                  <Text style={styles.deleteButtonText}>Excluir Cliente</Text>
                </TouchableOpacity>
              )}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

// Objeto StyleSheet com todos os estilos do componente
const styles = StyleSheet.create({
  // Estilo do container principal (não usado no JSX atual)
  container: { flex: 1 },
  // Estilo do header com gradiente
  header: { 
    flexDirection: 'row', // Alinha filhos horizontalmente
    justifyContent: 'space-between', // Distribui espaço igualmente entre os elementos
    alignItems: 'center', // Centraliza verticalmente
    padding: 20, 
    paddingTop: Platform.OS === 'android' ? 40 : 20 // Padding top diferente para Android devido à status bar
  },
  // Estilo do botão de voltar
  backButton: { padding: 5 },
  // Estilo do título no header
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  // Estilo do container do formulário com scroll
  formContainer: { flexGrow: 1, backgroundColor: 'white' },
  // Estilo do conteúdo principal
  content: { padding: 25 },
  // Estilo da seção que agrupa campos relacionados
  section: { marginBottom: 25 },
  // Estilo do título da seção
  sectionTitle: { fontSize: 18, fontWeight: '600', color: solidBlue, marginBottom: 20 },
  // Estilo comum para todos os campos de entrada
  input: { 
    backgroundColor: '#F5F5F5', // Fundo cinza claro
    borderRadius: 10, // Bordas arredondadas
    padding: 15, 
    marginBottom: 15, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', // Borda cinza bem clara
    color: '#333' // Cor do texto digitado
  },
  // Estilo do botão de salvar
  saveButton: { 
    backgroundColor: '#27ae60', // Verde indicando ação positiva
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center', // Centraliza o texto
    marginTop: 10 
  },
  // Estilo do texto do botão salvar
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  // Estilo do botão de excluir
  deleteButton: { 
    backgroundColor: '#e74c3c', // Vermelho indicando ação destrutiva
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center', // Centraliza o texto
    marginTop: 15 
  },
  // Estilo do texto do botão excluir
  deleteButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  // --- 5. ESTILOS PARA O MODAL ---
  // Overlay que cobre toda a tela com fundo escuro semi-transparente
  modalOverlay: {
      flex: 1, // Ocupa toda a tela
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Preto com 60% de opacidade
      justifyContent: 'center', // Centraliza verticalmente
      alignItems: 'center', // Centraliza horizontalmente
  },
  // Container principal do modal
  modalView: {
      width: '85%', // 85% da largura da tela
      backgroundColor: 'white', // Fundo branco
      borderRadius: 15, // Bordas bem arredondadas
      padding: 20,
      alignItems: 'center', // Centraliza conteúdo interno
      // Propriedades de sombra para iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5, // Sombra para Android
  },
  // Estilo do título do modal
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333' // Cinza escuro
  },
  // Estilo do texto explicativo do modal
  modalText: {
      fontSize: 16,
      marginBottom: 25,
      textAlign: 'center', // Texto centralizado
      color: '#555', // Cinza médio
      lineHeight: 22, // Altura da linha para melhor legibilidade
  },
  // Container que organiza os botões do modal em linha
  modalButtonContainer: {
      flexDirection: 'row', // Botões lado a lado
      width: '100%', // Ocupa toda a largura disponível
  },
  // Estilo base comum para botões do modal
  modalButton: {
      borderRadius: 10,
      paddingVertical: 12,
      flex: 1, // Cada botão ocupa metade do espaço disponível
      alignItems: 'center', // Centraliza texto do botão
  },
  // Estilo específico do botão cancelar
  modalButtonCancel: {
      backgroundColor: '#f0f0f0', // Cinza claro
      marginRight: 10, // Espaço à direita para separar dos outros botões
  },
  // Estilo específico do botão excluir
  modalButtonDelete: {
      backgroundColor: '#e74c3c', // Vermelho para ação destrutiva
      marginLeft: 10, // Espaço à esquerda para separar dos outros botões
  },
  // Estilo do texto do botão cancelar
  modalButtonTextCancel: {
      color: '#333', // Cinza escuro
      fontWeight: 'bold',
      fontSize: 16
  },
  // Estilo do texto do botão excluir
  modalButtonTextDelete: {
      color: 'white', // Branco para contraste com fundo vermelho
      fontWeight: 'bold',
      fontSize: 16
  }
});