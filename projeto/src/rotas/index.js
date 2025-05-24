import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BemVindo from '../pages/BemVindo'
import SignIn from '../pages/SignIn'
import PrincipalMenu from '../pages/PrincipalMenu'

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
        </Stack.Navigator>
    )
}