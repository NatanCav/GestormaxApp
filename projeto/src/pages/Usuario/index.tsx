import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  Alert // Para a função de deletar (exemplo)
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Cores do gradiente e cor sólida (mantendo a consistência)
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

// Dados de exemplo (mock) para usuários
const MOCK_USUARIOS = [
  {
    id: 'user1',
    nome: 'Carlos Alberto Nóbrega',
    codigo: 'USER001',
    email: 'carlos.nobrega@email.com',
  },
  {
    id: 'user2',
    nome: 'Fernanda Montenegro',
    codigo: 'USER002',
    email: 'fernanda.m@email.com',
  },
  {
    id: 'user3',
    nome: 'Rodrigo Santoro',
    codigo: 'USER003',
    email: 'rodrigo.santoro@email.com',
  },
];

// Componente para o card de cada usuario
const UsuarioCard = ({ usuario, onEditPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome}>{usuario.nome}</Text>
        <Text style={styles.cardDetalhe}>Código: {usuario.codigo}</Text>
        {usuario.email && <Text style={styles.cardDetalheMenor}>{usuario.email}</Text>}
      </View>
      <TouchableOpacity onPress={onEditPress} style={styles.cardAction}>
        <MaterialIcons name="edit" size={22} color={solidBlue} />
      </TouchableOpacity>
    </View>
  );
};

// Componente para quando a lista estiver vazia
const ListaVaziaComponente = () => (
  <View style={styles.listaVaziaContainer}>
    <MaterialIcons name="people-outline" size={100} color="#D0D0D0" />
    <Text style={styles.listaVaziaTexto}>Nenhum usuário encontrado.</Text>
    <Text style={styles.listaVaziaSubtexto}>Use o botão '+' para adicionar o primeiro usuário!</Text>
  </View>
);

// Tela Principal de usuários
export default function UsuariosScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [usuarios, setUsuarios] = useState(MOCK_USUARIOS); // Estado para todos os usuario
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(MOCK_USUARIOS); // Estado para usuario após filtro

  // Efeito para filtrar os usuarios quando a busca ou a lista principal mudam
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrados = usuarios.filter(usuarios =>
        usuarios.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usuarios.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (usuarios.email && usuarios.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setUsuariosFiltrados(filtrados);
    }
  }, [searchQuery, usuarios]);

  // Função para voltar para a tela anterior
  const handleVoltar = () => {
    navigation.goBack();
  };

  // Função para navegar para a tela de novo usuário
  const handleNovoUsuario = () => {
    navigation.navigate('CadastroUsuario', {
      onSalvar: (novoUsuarios) => {
        // Adiciona o novo usuario à lista principal
        setUsuarios(prev => [
            { ...novoUsuarios, id: String(Date.now()) }, // Garante um ID único se não vier do cadastro
            ...prev
        ]);
      }
    });
  };

  // Função para navegar para a tela de edição de usuário
  const handleEditarUsuarios = (usuario) => {
    navigation.navigate('CadastroUsuario', {
        usuarioExistente: usuario,
        onSalvar: (usuarioAtualizado) => {
            setUsuarios(prevUsuario =>
                prevUsuario.map(v =>
                    v.id === usuarioAtualizado.id ? usuarioAtualizado : v
                )
            );
        }
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
      <LinearGradient
        colors={gradientColors}
        style={styles.containerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Cabeçalho da Tela */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleVoltar}>
            <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Usuários</Text>
          <View style={{ width: 28 }} /> {/* Espaçador para centralizar o título */}
        </View>

        {/* Área de Conteúdo Principal */}
        <View style={styles.contentArea}>
          {/* Barra de Pesquisa */}
          <View style={styles.searchSection}>
            <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por nome, código ou email..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearIconContainer}>
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Lista de Usuários */}
          <FlatList
            data={usuariosFiltrados}
            renderItem={({ item }) => (
              <UsuarioCard
                usuario={item}
                onEditPress={() => handleEditarUsuario(item)}
              />
            )}
            keyExtractor={item => item.id}
            ListEmptyComponent={<ListaVaziaComponente />}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Botão para Adicionar Novo Usuario */}
          <TouchableOpacity style={styles.botaoAdicionar} onPress={handleNovoUsuario}>
            <MaterialIcons name="add" size={28} color="white" />
            <Text style={styles.textoBotaoAdicionar}>Novo Usuário</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Estilos da tela (baseados nos estilos de ClientesScreen/FornecedoresScreen)
const styles = StyleSheet.create({
  containerGradient: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 35 : 15,
  },
  headerTitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentArea: { // Área branca principal
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  searchClearIconContainer: {
    padding: 5,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 110, 176, 0.08)', // Fundo levemente azulado
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(17, 110, 176, 0.2)',
  },
  cardInfo: {
    flex: 1, // Para o texto não empurrar o ícone para fora
  },
  cardNome: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50', // Cor escura para o nome
    marginBottom: 4,
  },
  cardDetalhe: {
    fontSize: 14,
    color: '#566573', // Cor para detalhes
    marginBottom: 2,
  },
  cardDetalheMenor: {
    fontSize: 13,
    color: '#7f8c8d', // Cor mais clara para detalhes menores
  },
  cardAction: {
    paddingLeft: 10, // Espaço para o toque no ícone
    paddingVertical: 5,
  },
  // Estilos para Lista Vazia
  listaVaziaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listaVaziaTexto: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
    textAlign: 'center',
  },
  listaVaziaSubtexto: {
    marginTop: 8,
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  // Estilos para o Botão Adicionar
  botaoAdicionar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: solidBlue,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBotaoAdicionar: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
