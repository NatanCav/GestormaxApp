import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import api from '../../services/api';

// 1. IMPORTANDO OS TIPOS
import { Movimentacao, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Constantes de Cor
const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

// Funções de formatação de data
const formatDate = (date: Date): string => {
  if (!date) return '';
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

const parseDate = (strDate?: string): Date => {
  if (!strDate || !strDate.includes('/')) return new Date();
  const parts = strDate.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return new Date();
};

// 2. TIPANDO AS PROPS DO COMPONENTE
type Props = NativeStackScreenProps<RootStackParamList, 'CadastroMovimentacao'>;

export default function CadastroMovimentacaoScreen({ route, navigation }: Props) {
  const { movimentacaoExistente, onSalvar, onExcluir } = route.params || {};
  const isEditando = !!movimentacaoExistente;

  // Estados dos campos
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>(
    movimentacaoExistente?.tipo || 'entrada'
  );
  const [dataMovimentacao, setDataMovimentacao] = useState(
    movimentacaoExistente?.data || formatDate(new Date())
  );
  const [valorTotal, setValorTotal] = useState(movimentacaoExistente?.valorTotal?.toString() || '');
  const [observacao, setObservacao] = useState(movimentacaoExistente?.observacao || '');

  // Campos de Entrada
  const [produtoNome, setProdutoNome] = useState('');
  const [fornecedorNome, setFornecedorNome] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // Campos de Saída
  const [pedidoId, setPedidoId] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [vendedorNome, setVendedorNome] = useState('');
  const [itensDescricao, setItensDescricao] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Efeito para preencher os campos no modo de edição
  useEffect(() => {
    navigation.setOptions({ title: isEditando ? 'Editar Movimentação' : 'Nova Movimentação' });
    
    if (movimentacaoExistente) {
      if (movimentacaoExistente.tipo === 'entrada') {
        setProdutoNome(movimentacaoExistente.produtoNome);
        setFornecedorNome(movimentacaoExistente.fornecedorNome);
        setQuantidade(movimentacaoExistente.quantidade.toString());
      } else if (movimentacaoExistente.tipo === 'saida') {
        setPedidoId(movimentacaoExistente.pedidoId);
        setClienteNome(movimentacaoExistente.clienteNome);
        setVendedorNome(movimentacaoExistente.vendedorNome);
        setItensDescricao(movimentacaoExistente.itensDescricao?.join(', ') || '');
      }
    }
  }, [isEditando, movimentacaoExistente, navigation]);

  const handleSalvar = async () => {
    // --- CONSTRUINDO O PAYLOAD PARA O BACKEND ---
    let dadosMovimentacao: Partial<Movimentacao>;

    if (tipoMovimentacao === 'entrada') {
      if (!produtoNome || !fornecedorNome || !quantidade || !valorTotal) {
        Alert.alert("Atenção", "Para entradas, todos os campos são obrigatórios.");
        return;
      }
      dadosMovimentacao = {
        tipo: 'entrada', data: dataMovimentacao, valorTotal: parseFloat(valorTotal), observacao,
        produtoNome, fornecedorNome, quantidade: parseInt(quantidade)
      };
    } else { // Saída
      if (!pedidoId || !clienteNome || !vendedorNome || !valorTotal) {
        Alert.alert("Atenção", "Para saídas, todos os campos são obrigatórios.");
        return;
      }
      dadosMovimentacao = {
        tipo: 'saida', data: dataMovimentacao, valorTotal: parseFloat(valorTotal), observacao,
        pedidoId, clienteNome, vendedorNome, itensDescricao: itensDescricao.split(',').map(item => item.trim())
      };
    }

    try {
      let movimentacaoSalva: Movimentacao;
      if (isEditando) {
        // --- ENDPOINT: PUT /movimentacoes/editar/:id ---
        const response = await api.put<Movimentacao>(`/movimentacoes/editar/${movimentacaoExistente.id_movimentacao}`, dadosMovimentacao);
        movimentacaoSalva = response.data;
      } else {
        // --- ENDPOINT: POST /movimentacoes/cadastrar ---
        const response = await api.post<Movimentacao>('/movimentacoes/cadastrar', dadosMovimentacao);
        movimentacaoSalva = response.data;
      }

      if (typeof onSalvar === 'function') {
        onSalvar(movimentacaoSalva);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar movimentação:", error);
      Alert.alert("Erro", "Não foi possível salvar a movimentação.");
    }
  };

  const handleExcluir = () => {
    if (!isEditando) return;
    Alert.alert("Confirmar Exclusão", "Deseja realmente excluir esta movimentação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir", style: "destructive",
          onPress: async () => {
            try {
              // --- ENDPOINT: DELETE /movimentacoes/deletar/:id ---
              await api.delete(`/movimentacoes/deletar/${movimentacaoExistente.id_movimentacao}`);
              if (typeof onExcluir === 'function') {
                onExcluir(movimentacaoExistente.id_movimentacao);
              }
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir movimentação:", error);
              Alert.alert("Erro", "Não foi possível excluir a movimentação.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <LinearGradient colors={gradientColors} style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>{isEditando ? 'Editar Movimentação' : 'Nova Movimentação'}</Text>
        <TouchableOpacity onPress={handleSalvar}>
            <MaterialIcons name="save" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>
      
      <ScrollView style={styles.contentArea} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.tipoMovimentacaoContainer}>
            <TouchableOpacity
              style={[styles.botaoTipo, tipoMovimentacao === 'entrada' && styles.botaoTipoAtivo]}
              onPress={() => !isEditando && setTipoMovimentacao('entrada')} // Só permite mudar se for novo cadastro
              disabled={isEditando}
            >
              <MaterialIcons name="arrow-downward" size={20} color={tipoMovimentacao === 'entrada' ? '#FFFFFF' : solidBlue} />
              <Text style={[styles.textoBotaoTipo, tipoMovimentacao === 'entrada' && styles.textoBotaoTipoAtivo]}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoTipo, tipoMovimentacao === 'saida' && styles.botaoTipoAtivo]}
              onPress={() => !isEditando && setTipoMovimentacao('saida')}
              disabled={isEditando}
            >
              <MaterialIcons name="arrow-upward" size={20} color={tipoMovimentacao === 'saida' ? '#FFFFFF' : solidBlue} />
              <Text style={[styles.textoBotaoTipo, tipoMovimentacao === 'saida' && styles.textoBotaoTipoAtivo]}>Saída</Text>
            </TouchableOpacity>
        </View>

        {/* --- Formulário Dinâmico --- */}
        <Text style={styles.labelCampo}>Data da Movimentação*</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.inputDate}>
           <Text style={styles.inputTextDateValue}>{dataMovimentacao}</Text>
           <MaterialIcons name="calendar-today" size={20} color="#555" />
        </TouchableOpacity>
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" date={parseDate(dataMovimentacao)} onConfirm={(d) => { setDataMovimentacao(formatDate(d)); setDatePickerVisibility(false); }} onCancel={() => setDatePickerVisibility(false)} />
        
        {tipoMovimentacao === 'entrada' ? (
          <>
            <Text style={styles.labelCampo}>Nome do Produto*</Text>
            <TextInput style={styles.input} placeholder="Ex: Cachaça 51" value={produtoNome} onChangeText={setProdutoNome} />
            <Text style={styles.labelCampo}>Nome do Fornecedor*</Text>
            <TextInput style={styles.input} placeholder="Ex: Distribuidora XYZ" value={fornecedorNome} onChangeText={setFornecedorNome} />
            <Text style={styles.labelCampo}>Quantidade*</Text>
            <TextInput style={styles.input} placeholder="Ex: 100" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
          </>
        ) : (
          <>
            <Text style={styles.labelCampo}>ID do Pedido*</Text>
            <TextInput style={styles.input} placeholder="Ex: PED-2024-001" value={pedidoId} onChangeText={setPedidoId} />
            <Text style={styles.labelCampo}>Nome do Cliente*</Text>
            <TextInput style={styles.input} placeholder="Ex: Bar do Zé" value={clienteNome} onChangeText={setClienteNome} />
            <Text style={styles.labelCampo}>Nome do Usuário/Vendedor*</Text>
            <TextInput style={styles.input} placeholder="Ex: João da Silva" value={vendedorNome} onChangeText={setVendedorNome} />
            <Text style={styles.labelCampo}>Itens da Saída (separados por vírgula)</Text>
            <TextInput style={[styles.input, {height: 80}]} multiline placeholder="Ex: Cachaça 51 (10 un), Vodka (5 un)" value={itensDescricao} onChangeText={setItensDescricao} />
          </>
        )}

        <Text style={styles.labelCampo}>Valor Total (R$)*</Text>
        <TextInput style={styles.input} placeholder="Ex: 1500,50" value={valorTotal} onChangeText={setValorTotal} keyboardType="numeric" />
        <Text style={styles.labelCampo}>Observações</Text>
        <TextInput style={[styles.input, {height: 100}]} multiline placeholder="Alguma observação adicional..." value={observacao} onChangeText={setObservacao} />
        
        {isEditando && (
          <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
            <MaterialIcons name="delete-forever" size={22} color="white" />
            <Text style={styles.textoBotaoExcluir}>Excluir Movimentação</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, paddingTop: Platform.OS === 'android' ? 45 : 35 },
  headerTitulo: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  contentArea: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 20 },
  tipoMovimentacaoContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25, backgroundColor: '#f0f0f0', borderRadius: 10, padding: 5 },
  botaoTipo: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginHorizontal: 3 },
  botaoTipoAtivo: { backgroundColor: solidBlue, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  textoBotaoTipo: { fontSize: 16, fontWeight: '600', color: solidBlue, marginLeft: 8 },
  textoBotaoTipoAtivo: { color: '#FFFFFF' },
  labelCampo: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 15 : 12, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 10 },
  inputDate: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, paddingVertical: Platform.OS === 'ios' ? 15 : 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 10 },
  inputTextDateValue: { fontSize: 16, color: '#333' },
  botaoExcluir: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', borderRadius: 10, paddingVertical: 15, marginTop: 20 },
  textoBotaoExcluir: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
