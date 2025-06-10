import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Imports dos componentes de tela
import BemVindo from '../pages/BemVindo'
import SignIn from '../pages/SignIn'
import PrincipalMenu from '../pages/PrincipalMenu'
import ProdutosScreen from '../pages/Produto' // Renomeado para consistência
import CadastroProduto from '../pages/CadastroProduto';
import ClientesScreen from '../pages/Cliente'
import CadastroCliente from '../pages/CadastroCliente'
import FornecedoresScreen from '../pages/Fornecedor';
import CadastroFornecedor from '../pages/CadastroFornecedor';
import MovimentacoesScreen from '../pages/Movimentacao';
import CadastroMovimentacaoScreen from '../pages/CadastroMovimentacao';
import UsuariosScreen from '../pages/Usuario';
import RelatoriosScreen from '../pages/Relatorio';

// --- 1. IMPORTE O COMPONENTE DE CADASTRO DE USUÁRIO ---
import CadastroUsuario from '../pages/CadastroUsuario'; // Certifique-se que o caminho está correto


const Stack = createNativeStackNavigator();

export default function Rotas(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="BemVindo"
            component={BemVindo}
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="PrincipalMenu"
            component={PrincipalMenu}
            options={{headerShown: false}}
            />

            <Stack.Screen
                name="Clientes"
                component={ClientesScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="CadastroCliente"
                component={CadastroCliente}
                // Header customizado para CadastroCliente (mantido do seu código original)
                options={({ navigation }) => ({
                    headerShown: true,
                    title: 'Cadastro de Cliente',
                    headerStyle: { backgroundColor: '#0C4B8E' },
                    headerTintColor: '#fff',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons 
                                name="arrow-back" 
                                size={24} 
                                color="white" 
                                style={{ marginRight: 15 }} // Ajuste de estilo
                            />
                        </TouchableOpacity>
                    )
                })}
            />

            <Stack.Screen
            name="Produtos"
            component={ProdutosScreen} // Usando o nome consistente
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="CadastroProduto"
            component={CadastroProduto}
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="Fornecedores"
            component={FornecedoresScreen}
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="CadastroFornecedor" 
            component={CadastroFornecedor}
            options={{ headerShown: false }}
            />

            {/* O nome aqui deve ser 'Movimentacoes' para bater com o types.ts */}
            <Stack.Screen
            name="Movimentacoes"
            component={MovimentacoesScreen}
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="CadastroMovimentacao"
            component={CadastroMovimentacaoScreen}
            options={{headerShown: false}}
            />

            {/* O nome aqui deve ser 'Usuarios' para bater com o types.ts */}
            <Stack.Screen
            name="Usuarios"
            component={UsuariosScreen}
            options={{headerShown: false}}
            />

            {/* --- 2. ADICIONE A TELA DE CADASTRO DE USUÁRIO AQUI --- */}
            <Stack.Screen
            name="CadastroUsuario"
            component={CadastroUsuario}
            options={{headerShown: false}}
            />

            {/* O nome aqui deve ser 'Relatorios' para bater com o types.ts */}
            <Stack.Screen
            name="Relatorios"
            component={RelatoriosScreen}
            options={{headerShown: false}}
            />

        </Stack.Navigator>
    )
}
