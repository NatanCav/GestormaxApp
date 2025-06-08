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

// Cores do gradiente e cor sólida
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0';

// Função para formatar data para DD/MM/AAAA
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  let day = d.getDate().toString().padStart(2, '0');
  let month = (d.getMonth() + 1).toString().padStart(2, '0');
  let year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Função para converter data DD/MM/AAAA para objeto Date (simples)
const parseDate = (strDate) => {
    if (!strDate || typeof strDate !== 'string' || !strDate.includes('/')) return new Date();
    const parts = strDate.split('/');
    if (parts.length === 3) {
        // new Date(year, monthIndex, day)
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date();
};


export default function CadastroMovimentacaoScreen({ route, navigation }) {
  const { movimentacaoExistente, onSalvar } = route.params || {};

  const [tipoMovimentacao, setTipoMovimentacao] = useState(
    movimentacaoExistente?.tipo || 'entrada' // Padrão 'entrada'
  );

  // Estados para campos comuns
  const [dataMovimentacao, setDataMovimentacao] = useState(
    movimentacaoExistente?.data ? formatDate(parseDate(movimentacaoExistente.data)) : formatDate(new Date())
  );
  const [observacao, setObservacao] = useState(movimentacaoExistente?.observacao || '');

  // Estados para campos de ENTRADA
  const [produtoNome, setProdutoNome] = useState(movimentacaoExistente?.produtoNome || '');
  const [fornecedorNome, setFornecedorNome] = useState(movimentacaoExistente?.fornecedorNome || '');
  const [quantidadeEntrada, setQuantidadeEntrada] = useState(
    movimentacaoExistente?.quantidade?.toString() || ''
  );
  const [valorTotalEntrada, setValorTotalEntrada] = useState(
    movimentacaoExistente?.valorTotal?.toString() || ''
  );

  // Estados para campos de SAÍDA
  const [pedidoId, setPedidoId] = useState(movimentacaoExistente?.pedidoId || '');
  const [clienteNome, setClienteNome] = useState(movimentacaoExistente?.clienteNome || '');
  const [vendedorNome, setVendedorNome] = useState(movimentacaoExistente?.vendedorNome || '');
  const [itensDescricaoSaida, setItensDescricaoSaida] = useState(
     (movimentacaoExistente?.itensDescricao && Array.isArray(movimentacaoExistente.itensDescricao))
      ? movimentacaoExistente.itensDescricao.join(', ')
      : (movimentacaoExistente?.itensDescricao || '') // Caso seja string
  );
  const [valorTotalSaida, setValorTotalSaida] = useState(
    movimentacaoExistente?.valorTotal?.toString() || ''
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const isEditando = !!movimentacaoExistente;
  const screenTitle = isEditando ? "Editar Movimentação" : "Nova Movimentação";

  // Preenche os campos se estiver editando
  useEffect(() => {
    if (movimentacaoExistente) {
      setTipoMovimentacao(movimentacaoExistente.tipo);
      setDataMovimentacao(formatDate(parseDate(movimentacaoExistente.data))); // Garante formato DD/MM/AAAA
      setObservacao(movimentacaoExistente.observacao || '');

      if (movimentacaoExistente.tipo === 'entrada') {
        setProdutoNome(movimentacaoExistente.produtoNome || '');
        setFornecedorNome(movimentacaoExistente.fornecedorNome || '');
        setQuantidadeEntrada(movimentacaoExistente.quantidade?.toString() || '');
        // unidadeEntrada não é mais definida aqui
        setValorTotalEntrada(movimentacaoExistente.valorTotal?.toString() || '');
      } else {
        setPedidoId(movimentacaoExistente.pedidoId || '');
        setClienteNome(movimentacaoExistente.clienteNome || '');
        setVendedorNome(movimentacaoExistente.vendedorNome || '');
        setItensDescricaoSaida(
          Array.isArray(movimentacaoExistente.itensDescricao)
          ? movimentacaoExistente.itensDescricao.join(', ')
          : (movimentacaoExistente.itensDescricao || '')
        );
        setValorTotalSaida(movimentacaoExistente.valorTotal?.toString() || '');
      }
    }
  }, [movimentacaoExistente]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (selectedDate) => {
    hideDatePicker();
    setDataMovimentacao(formatDate(selectedDate));
  };

  const handleSalvarMovimentacao = () => {
    // Validações básicas
    if (!dataMovimentacao) {
      Alert.alert("Erro", "A data da movimentação é obrigatória.");
      return;
    }

    let movimentacaoSalva = {
      id: movimentacaoExistente?.id || String(Date.now()), // Mantém ID se editando, ou cria novo
      tipo: tipoMovimentacao,
      data: dataMovimentacao, // Já está no formato DD/MM/AAAA
      observacao,
    };

    if (tipoMovimentacao === 'entrada') {
      if (!produtoNome || !fornecedorNome || !quantidadeEntrada || !valorTotalEntrada) {
        Alert.alert("Erro", "Para entrada, preencha: Produto, Fornecedor, Quantidade e Valor Total.");
        return;
      }
      movimentacaoSalva = {
        ...movimentacaoSalva,
        produtoNome,
        fornecedorNome,
        quantidade: parseInt(quantidadeEntrada) || 0,
        // unidadeEntrada não é mais salva
        valorTotal: parseFloat(valorTotalEntrada.replace(',', '.')) || 0,
      };
    } else { // Saída
      if (!pedidoId || !clienteNome || !vendedorNome || !valorTotalSaida) {
        Alert.alert("Erro", "Para saída, preencha: Pedido ID, Cliente, Vendedor e Valor Total.");
        return;
      }
      movimentacaoSalva = {
        ...movimentacaoSalva,
        pedidoId,
        clienteNome,
        vendedorNome,
        itensDescricao: itensDescricaoSaida.split(',').map(item => item.trim()), // Salva como array
        valorTotal: parseFloat(valorTotalSaida.replace(',', '.')) || 0,
      };
    }

    if (typeof onSalvar === 'function') {
      onSalvar(movimentacaoSalva);
    }
    navigation.goBack();
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gradientColors[0] }}>
      <LinearGradient
        colors={gradientColors}
        style={styles.containerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>{screenTitle}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.contentArea} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Seletor de Tipo de Movimentação */}
          <View style={styles.tipoMovimentacaoContainer}>
            <TouchableOpacity
              style={[styles.botaoTipo, tipoMovimentacao === 'entrada' && styles.botaoTipoAtivo]}
              onPress={() => setTipoMovimentacao('entrada')}
            >
              <MaterialIcons name="arrow-downward" size={20} color={tipoMovimentacao === 'entrada' ? '#FFFFFF' : solidBlue} />
              <Text style={[styles.textoBotaoTipo, tipoMovimentacao === 'entrada' && styles.textoBotaoTipoAtivo]}>
                Entrada
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoTipo, tipoMovimentacao === 'saida' && styles.botaoTipoAtivo]}
              onPress={() => setTipoMovimentacao('saida')}
            >
              <MaterialIcons name="arrow-upward" size={20} color={tipoMovimentacao === 'saida' ? '#FFFFFF' : solidBlue} />
              <Text style={[styles.textoBotaoTipo, tipoMovimentacao === 'saida' && styles.textoBotaoTipoAtivo]}>
                Saída
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campos do Formulário */}
          <Text style={styles.labelCampo}>Data da Movimentação*</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.inputDate}>
             <Text style={styles.inputTextDateValue}>{dataMovimentacao || "Selecione a data"}</Text>
             <MaterialIcons name="calendar-today" size={20} color="#555" />
          </TouchableOpacity>

            <DateTimePickerModal
                locale="pt-BR"
                isVisible={isDatePickerVisible}
                mode="date"
                date={parseDate(dataMovimentacao)} // Usa a data atual do estado como inicial
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                display={Platform.OS === 'android' ? 'spinner' : 'clock'} 
                
            />

          {tipoMovimentacao === 'entrada' && (
            <>
              <Text style={styles.labelCampo}>Nome do Produto*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Componente Eletrônico XZ"
                value={produtoNome}
                onChangeText={setProdutoNome}
                placeholderTextColor="#999"
              />

              <Text style={styles.labelCampo}>Nome do Fornecedor*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Fornecedor Alpha Ltda."
                value={fornecedorNome}
                onChangeText={setFornecedorNome}
                placeholderTextColor="#999"
              />

              {/* Campo Quantidade agora ocupa a linha inteira */}
              <Text style={styles.labelCampo}>Quantidade*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 50"
                value={quantidadeEntrada}
                onChangeText={setQuantidadeEntrada}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              {/* O campo Unidade foi removido daqui */}

              <Text style={styles.labelCampo}>Valor Total da Entrada (R$)*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1250,00"
                value={valorTotalEntrada}
                onChangeText={setValorTotalEntrada}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </>
          )}

          {tipoMovimentacao === 'saida' && (
            <>
              {/* O campo de Data da Movimentação já está acima e é comum para ambos os tipos */}
              <Text style={styles.labelCampo}>ID do Pedido*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: PED-2024-0078"
                value={pedidoId}
                onChangeText={setPedidoId}
                placeholderTextColor="#999"
              />

              <Text style={styles.labelCampo}>Nome do Cliente*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Cliente Sigma Corp."
                value={clienteNome}
                onChangeText={setClienteNome}
                placeholderTextColor="#999"
              />

              <Text style={styles.labelCampo}>Nome do Vendedor*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Ana Paula"
                value={vendedorNome}
                onChangeText={setVendedorNome}
                placeholderTextColor="#999"
              />

              <Text style={styles.labelCampo}>Itens (separados por vírgula)</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Ex: Produto A (2 un), Produto B (1 un)"
                value={itensDescricaoSaida}
                onChangeText={setItensDescricaoSaida}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#999"
              />

              <Text style={styles.labelCampo}>Valor Total da Saída (R$)*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 750,50"
                value={valorTotalSaida}
                onChangeText={setValorTotalSaida}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </>
          )}

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarMovimentacao}>
            <MaterialIcons name="save" size={24} color="white" />
            <Text style={styles.textoBotaoSalvar}>Salvar Movimentação</Text>
          </TouchableOpacity>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

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
    fontSize: 20, // Um pouco menor para caber "Editar Movimentação"
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tipoMovimentacaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
  },
  botaoTipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 3,
  },
  botaoTipoAtivo: {
    backgroundColor: solidBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBotaoTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: solidBlue,
    marginLeft: 8,
  },
  textoBotaoTipoAtivo: {
    color: '#FFFFFF',
  },
  labelCampo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12, // Ajuste para padding vertical
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  inputDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
  },
  inputTextDateValue: {
    fontSize: 16,
    color: '#333',
  },
  // rowInputContainer não é mais necessário para Quantidade/Unidade,
  // mas pode ser útil para outros campos no futuro.
  // Se não for usar, pode remover este estilo.
  rowInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27ae60', // Verde para salvar
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 30, // Mais espaço antes do botão salvar
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBotaoSalvar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
