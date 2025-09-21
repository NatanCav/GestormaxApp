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

// A importação do 'api' não é necessária para esta tela estática
// import api from '../../services/api';

import { Movimentacao, RootStackParamList } from '../../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const gradientColors = ['#0C4B8E', '#116EB0'] as const;
const solidBlue = '#116EB0';

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

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroMovimentacao'>;

export default function CadastroMovimentacaoScreen({ route, navigation }: Props) {
  const { movimentacaoExistente, onSalvar, onExcluir } = route.params || {};
  const isEditando = !!movimentacaoExistente;

  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>(
    movimentacaoExistente?.tipo || 'entrada'
  );

  const [dataMovimentacao, setDataMovimentacao] = useState(
    movimentacaoExistente?.data || formatDate(new Date())
  );
  const [valorTotal, setValorTotal] = useState(movimentacaoExistente?.valorTotal?.toString() || '');
  const [observacao, setObservacao] = useState(movimentacaoExistente?.observacao || '');

  // A lógica para preencher os campos foi movida para o useEffect para maior clareza
  const [produtoNome, setProdutoNome] = useState('');
  const [fornecedorNome, setFornecedorNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pedidoId, setPedidoId] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [vendedorNome, setVendedorNome] = useState('');
  const [itensDescricao, setItensDescricao] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const screenTitle = isEditando ? "Editar Movimentação" : "Nova Movimentação";

  // Efeito para preencher os campos no modo de edição
  useEffect(() => {
    if (isEditando && movimentacaoExistente) {
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
  }, [isEditando, movimentacaoExistente]);


  const handleSalvarMovimentacao = () => {
    if (!dataMovimentacao) {
      Alert.alert("Erro", "A data da movimentação é obrigatória.");
      return;
    }

    let movimentacaoSalva;

    if (tipoMovimentacao === 'entrada') {
      if (!produtoNome || !fornecedorNome || !quantidade || !valorTotal) {
        Alert.alert("Atenção", "Para entradas, todos os campos são obrigatórios.");
        return;
      }
      movimentacaoSalva = {
        id_movimentacao: isEditando ? movimentacaoExistente.id_movimentacao : Date.now(),
        tipo: 'entrada',
        data: dataMovimentacao,
        valorTotal: parseFloat(valorTotal.replace(',', '.')) || 0,
        observacao,
        produtoNome,
        fornecedorNome,
        quantidade: parseInt(quantidade) || 0,
      };
    } else { // Saída
      if (!pedidoId || !clienteNome || !vendedorNome || !valorTotal) {
        Alert.alert("Atenção", "Para saídas, todos os campos são obrigatórios.");
        return;
      }
      movimentacaoSalva = {
        id_movimentacao: isEditando ? movimentacaoExistente.id_movimentacao : Date.now(),
        tipo: 'saida',
        data: dataMovimentacao,
        valorTotal: parseFloat(valorTotal.replace(',', '.')) || 0,
        observacao,
        pedidoId,
        clienteNome,
        vendedorNome,
        itensDescricao: itensDescricao.split(',').map(item => item.trim()),
      };
    }

    if (typeof onSalvar === 'function') {
      onSalvar(movimentacaoSalva);
    }
    Alert.alert("Sucesso", "Movimentação salva localmente.");
    navigation.goBack();
  };

  const handleExcluir = () => {
    if (!isEditando) return;
    Alert.alert(
      "Confirmar Exclusão", "Deseja realmente excluir esta movimentação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir", style: "destructive",
          onPress: () => {
            if (typeof onExcluir === 'function') {
              onExcluir(movimentacaoExistente.id_movimentacao);
            }
            Alert.alert("Sucesso", "Movimentação excluída localmente.");
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={gradientColors}
        style={styles.headerContainer}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>{screenTitle}</Text>
        {/* Espaçador para manter o título centralizado */}
        <View style={{ width: 28 }} />
      </LinearGradient>
      
      <ScrollView 
        style={styles.contentArea} 
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tipoMovimentacaoContainer}>
            <TouchableOpacity
              style={[styles.botaoTipo, tipoMovimentacao === 'entrada' && styles.botaoTipoAtivo]}
              onPress={() => !isEditando && setTipoMovimentacao('entrada')}
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

        <Text style={styles.labelCampo}>Data da Movimentação*</Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.inputDate}>
           <Text style={styles.inputTextDateValue}>{dataMovimentacao}</Text>
           <MaterialIcons name="calendar-today" size={20} color="#555" />
        </TouchableOpacity>

        <DateTimePickerModal
            locale="pt-BR"
            isVisible={isDatePickerVisible}
            mode="date"
            date={parseDate(dataMovimentacao)}
            onConfirm={(d) => { setDataMovimentacao(formatDate(d)); setDatePickerVisibility(false); }}
            onCancel={() => setDatePickerVisibility(false)}
        />
        
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
        
        {/* Botão de Salvar na parte inferior */}
        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarMovimentacao}>
          <MaterialIcons name="save" size={22} color="white" style={{marginRight: 10}}/>
          <Text style={styles.textoBotaoSalvar}>Salvar Movimentação</Text>
        </TouchableOpacity>
        
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
  botaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 20,
    elevation: 3,
  },
  textoBotaoSalvar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoExcluir: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', borderRadius: 10, paddingVertical: 15, marginTop: 15 },
  textoBotaoExcluir: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
