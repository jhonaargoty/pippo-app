import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMyContext } from "./context";

import Login from "./src/screens/login";
import Home from "./src/screens/home";
import Create from "./src/screens/create";
import Form from "./src/screens/create/form";
import Print from "./src/screens/print";
import Imprimir from "./src/screens/imprimir";

const Stack = createNativeStackNavigator();

function App() {
  const { user } = useMyContext();

  const optionsScreens = {
    headerShown: false,
    animation: "fade_from_bottom",
    animationTypeForReplace: "pop",
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={optionsScreens}
          />
          <Stack.Screen name="Home" component={Home} options={optionsScreens} />
          <Stack.Screen
            name="Create"
            component={Create}
            options={optionsScreens}
          />
          <Stack.Screen name="Form" component={Form} options={optionsScreens} />
          <Stack.Screen
            name="Print"
            component={Print}
            options={optionsScreens}
          />
          <Stack.Screen
            name="Imprimir"
            component={Imprimir}
            options={optionsScreens}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
