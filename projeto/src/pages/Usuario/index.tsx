import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Platform, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api'; // Certifique-se de que o caminho está correto

// 1. IMPORTANDO OS TIPOS
import { Usuario, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

const UsuarioCard = ({ usuario, onEditPress }: { usuario: Usuario, onEditPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onEditPress}>
        <View style={styles.cardContainer}>
            <View style={styles.cardInfo}>
                {/* O backend usa nomeUsuario */}
                <Text style={styles.cardNome}>{usuario.nomeUsuario}</Text>
                <Text style={styles.cardDetalheMenor}>{usuario.email}</Text>
            </View>
            <MaterialIcons name="edit" size={22} color={solidBlue} />
        </View>
    </TouchableOpacity>
  );
};

const ListaVaziaComponente = () => (
    <View style={styles.listaVaziaContainer}>
        <MaterialIcons name="people-outline" size={100} color="#D0D0D0" />
        <Text style={styles.listaVaziaTexto}>Nenhum usuário encontrado.</Text>
        <Text style={styles.listaVaziaSubtexto}>Use o botão '+' para adicionar o primeiro!</Text>
    </View>
);

type Props = NativeStackScreenProps<RootStackParamList, 'Usuarios'>;

export default function UsuariosScreen({ navigation }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchUsuarios();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setUsuariosFiltrados(usuarios);
        } else {
            const filtrados = usuarios.filter(usuario =>
                usuario.nomeUsuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
                usuario.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setUsuariosFiltrados(filtrados);
        }
    }, [searchQuery, usuarios]);

    const fetchUsuarios = async () => {
        try {
            // --- ENDPOINT: GET /usuarios/consultar ---
            const response = await api.get<Usuario[]>('/usuarios/consultar');
            setUsuarios(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
        }
    };

    const handleNovoUsuario = () => {
        navigation.navigate('CadastroUsuario', {
            onSalvar: (novoUsuario) => {
                setUsuarios(prev => [novoUsuario, ...prev]);
            },
        });
    };

    const handleEditarUsuario = (usuario: Usuario) => {
        navigation.navigate('CadastroUsuario', {
            usuarioExistente: usuario,
            onSalvar: (usuarioAtualizado) => {
                setUsuarios(prev =>
                    prev.map(u => (u.idUsuario === usuarioAtualizado.idUsuario ? usuarioAtualizado : u))
                );
            },
            onExcluir: (usuarioId) => {
                setUsuarios(prev => prev.filter(u => u.idUsuario !== usuarioId));
            },
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
            <LinearGradient colors={gradientColors} style={styles.containerGradient}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitulo}>Usuários</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.contentArea}>
                    <View style={styles.searchSection}>
                        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Pesquisar por nome ou email..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <FlatList
                        data={usuariosFiltrados}
                        renderItem={({ item }) => (
                            <UsuarioCard
                                usuario={item}
                                onEditPress={() => handleEditarUsuario(item)}
                            />
                        )}
                        keyExtractor={item => item.idUsuario.toString()}
                        ListEmptyComponent={<ListaVaziaComponente />}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                    />

                    <TouchableOpacity style={styles.botaoAdicionar} onPress={handleNovoUsuario}>
                        <MaterialIcons name="add" size={28} color="white" />
                        <Text style={styles.textoBotaoAdicionar}>Novo Usuário</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
// Seus estilos aqui... (copiados e adaptados)
const styles = StyleSheet.create({
  containerGradient: { flex: 1 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 35 : 15, },
  headerTitulo: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', },
  contentArea: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 20, },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, },
  searchIcon: { marginRight: 10, },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: '#333', },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(17, 110, 176, 0.08)', borderRadius: 10, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(17, 110, 176, 0.2)', },
  cardInfo: { flex: 1, },
  cardNome: { fontSize: 17, fontWeight: '600', color: '#2C3E50', marginBottom: 4, },
  cardDetalheMenor: { fontSize: 13, color: '#7f8c8d', },
  listaVaziaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
  listaVaziaTexto: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#555555', textAlign: 'center', },
  listaVaziaSubtexto: { marginTop: 8, fontSize: 14, color: '#888888', textAlign: 'center', },
  botaoAdicionar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: solidBlue, borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, marginTop: 10, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, },
  textoBotaoAdicionar: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 10, },
});
