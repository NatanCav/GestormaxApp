import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BemVindo from '../pages/BemVindo'
import SignIn from '../pages/SignIn'
import PrincipalMenu from '../pages/PrincipalMenu'
import Clientes from '../pages/Cliente'
import Produtos from '../pages/Produtos'
import CadastroCliente from '../pages/CadastroCliente'


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
            component={Clientes}
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="CadastroCliente"
            component={CadastroCliente}
            options={{headerShown: false}}
            />

            <Stack.Screen
            name="Produtos"
            component={Produtos}
            options={{headerShown: false}}
            />

        </Stack.Navigator>
    )
}