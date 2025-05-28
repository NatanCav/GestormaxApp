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
  Alert, // Adicionado para feedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Importado

// Define as cores do gradiente e uma cor sólida
const gradientColors = ['#0C4B8E', '#116EB0'];
const solidBlue = '#116EB0'; // Cor sólida baseada no gradiente

// Se estiver usando React Navigation, você receberia 'navigation' como prop
export default function CadastroProduto({ navigation }) {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [quantidadeGlobal, setQuantidadeGlobal] = useState(0);
  const [temVariacoes, setTemVariacoes] = useState(false);
  const [listaVariacoes, setListaVariacoes] = useState([
    { id: 1, nome: '', quantidade: '0' },
  ]);

  const handleGoBack = () => {
    // Verifica se navigation existe antes de chamar goBack
    if (navigation && navigation.goBack) {
        navigation.goBack();
    } else {
        console.warn("Navegação não disponível para voltar.");
    }
  };

  const handleSave = () => {
      // Lógica para coletar e (simular) salvar o produto aqui
      const produtoData = {
          nome, codigo, descricao, categoria, valor, temVariacoes,
          quantidade: temVariacoes ? null : quantidadeGlobal,
          variacoes: temVariacoes ? listaVariacoes : null,
      };
      console.log("Salvar Produto:", produtoData);

      Alert.alert("Salvo!", "Produto (simulado) salvo com sucesso.", [
          { text: "OK", onPress: handleGoBack } // Volta ao pressionar OK
      ]);
  }

  // --- Funções existentes ---
  const handleIncrementGlobal = () => setQuantidadeGlobal(prev => prev + 1);
  const handleDecrementGlobal = () => setQuantidadeGlobal(prev => (prev > 0 ? prev - 1 : 0));
  const handleQuantidadeGlobalChange = (text) => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    setQuantidadeGlobal(isNaN(num) ? 0 : num);
  };
   const handleValorChange = (text) => {
    let formattedText = text.replace(/[^0-9.]/g, '');
    const parts = formattedText.split('.');
    if (parts.length > 2) formattedText = parts[0] + '.' + parts.slice(1).join('');
    setValor(formattedText);
  };
  const adicionarVariacao = () => setListaVariacoes([...listaVariacoes, { id: Date.now(), nome: '', quantidade: '0' }]);
  const removerVariacao = (id) => setListaVariacoes(listaVariacoes.filter(item => item.id !== id));
  const atualizarVariacao = (id, campo, valor) => {
      const valorFinal = campo === 'quantidade' ? valor.replace(/[^0-9]/g, '') : valor;
      setListaVariacoes(listaVariacoes.map(item => item.id === id ? { ...item, [campo]: valorFinal } : item));
  };
  // --- Fim das funções ---


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
        <Text style={styles.headerTitle}>Novo Produto</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView style={styles.container}>
            {/* --- Campos do formulário --- */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite o nome" placeholderTextColor="#A9A9A9" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Código</Text>
              <TextInput style={styles.input} value={codigo} onChangeText={setCodigo} placeholder="Digite o código" placeholderTextColor="#A9A9A9" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Digite a descrição" placeholderTextColor="#A9A9A9" multiline />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Valor (R$)</Text>
                <TextInput style={styles.input} value={valor} onChangeText={handleValorChange} placeholder="0.00" placeholderTextColor="#A9A9A9" keyboardType="decimal-pad"/>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Categoria</Text>
              <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Digite a categoria" placeholderTextColor="#A9A9A9" />
            </View>

            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setTemVariacoes(!temVariacoes)}>
              <Ionicons name={temVariacoes ? "checkbox" : "square-outline"} size={24} color={solidBlue} />
              <Text style={styles.checkboxLabel}>Produto possui variações (cor, tamanho, etc.)?</Text>
            </TouchableOpacity>

            {temVariacoes && (
              <View style={styles.variacoesSection}>
                <Text style={styles.label}>Variações e Quantidades</Text>
                {listaVariacoes.map((item, index) => (
                  <View key={item.id} style={styles.variacaoItem}>
                    <TextInput style={[styles.input, styles.variacaoInputNome]} value={item.nome} onChangeText={(text) => atualizarVariacao(item.id, 'nome', text)} placeholder={`Variação ${index + 1}`} placeholderTextColor="#A9A9A9" />
                    <TextInput style={[styles.input, styles.variacaoInputQtd]} value={item.quantidade} onChangeText={(text) => atualizarVariacao(item.id, 'quantidade', text)} placeholder="Qtd" placeholderTextColor="#A9A9A9" keyboardType="numeric" />
                    <TouchableOpacity onPress={() => removerVariacao(item.id)} style={styles.removeButton}>
                        <Ionicons name="trash-bin-outline" size={24} color="#FF6347" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={adicionarVariacao}>
                    <Ionicons name="add-circle-outline" size={24} color={solidBlue} />
                    <Text style={styles.addButtonText}>Adicionar Variação</Text>
                </TouchableOpacity>
              </View>
            )}

            {!temVariacoes && (
              <View style={styles.quantityContainer}>
                <Text style={styles.label}>Quantidade Total</Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity onPress={handleDecrementGlobal}>
                     <LinearGradient colors={gradientColors} style={styles.quantityButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Ionicons name="remove" size={24} color="#FFFFFF" />
                     </LinearGradient>
                  </TouchableOpacity>
                  <TextInput style={styles.quantityInput} value={String(quantidadeGlobal)} onChangeText={handleQuantidadeGlobalChange} keyboardType="numeric" textAlign="center" />
                  <TouchableOpacity onPress={handleIncrementGlobal}>
                     <LinearGradient colors={gradientColors} style={styles.quantityButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                     </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: solidBlue, // Usa cor sólida
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: solidBlue, // Usa cor sólida
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F9FA',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  quantityContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: { // Estilo para o LinearGradient
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: solidBlue, // Usa cor sólida
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: solidBlue, // Usa cor sólida
    minWidth: 70,
    textAlign: 'center',
  },
  variacoesSection: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#F8F9FA'
  },
  variacaoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  variacaoInputNome: {
      flex: 1,
      marginRight: 10,
  },
  variacaoInputQtd: {
      width: 80,
      textAlign: 'center',
      marginRight: 10,
  },
  removeButton: {
      padding: 5,
  },
  addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      padding: 10,
      backgroundColor: '#E8F0FE',
      borderRadius: 8,
      justifyContent: 'center',
  },
  addButtonText: {
      marginLeft: 10,
      color: solidBlue, // Usa cor sólida
      fontWeight: 'bold',
  },
});