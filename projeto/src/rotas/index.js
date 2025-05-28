import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import BemVindo from '../pages/BemVindo'
import SignIn from '../pages/SignIn'
import PrincipalMenu from '../pages/PrincipalMenu'
import Produtos from '../pages/Produto'
import CadastroCliente from '../pages/CadastroCliente'
import ClientesScreen from '../pages/Cliente'
import CadastroProduto from '../pages/CadastroProduto';
import FornecedoresScreen from '../pages/Fornecedor';


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
                options={({ navigation }) => ({
                    headerShown: true,
                    title: 'Cadastro de Cliente',
                    headerStyle: {
                        backgroundColor: '#0C4B8E',
                    },
                    headerTintColor: '#fff',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons 
                                name="arrow-back" 
                                size={24} 
                                color="white" 
                                style={{ marginLeft: 15 }}
                            />
                        </TouchableOpacity>
                    )
                })}
            />

            <Stack.Screen
            name="Produtos"
            component={Produtos}
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

        </Stack.Navigator>
    )
}