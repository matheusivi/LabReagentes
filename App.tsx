import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDatabase } from "./database/db";
import { RootStackParamList } from "./types";

import HomeScreen from "./screens/HomeScreen";
import FormScreen from "./screens/FormScreen";
import DetailScreen from "./screens/DetailScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [dbPronto, setDbPronto] = useState(false);

  useEffect(() => {
    initDatabase();
    setDbPronto(true);
  }, []);

  if (!dbPronto) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0F6E56" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#0F6E56" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Lab Reagentes" }}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={({ route }) => ({
            title: route.params?.id ? "Editar Reagente" : "Novo Reagente",
          })}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: "Detalhes do Reagente" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
