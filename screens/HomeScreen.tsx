import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { listarReagentes, deletarReagente } from "../database/db";
import { Reagente, RootStackParamList } from "../types";
import ReagentCard from "../components/ReagentCard";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: Props) {
  const [reagentes, setReagentes] = useState<Reagente[]>([]);

  const carregarReagentes = useCallback(() => {
    const dados = listarReagentes();
    setReagentes(dados);
  }, []);

  useFocusEffect(carregarReagentes);

  const confirmarDelete = (id: number, nome: string) => {
    Alert.alert("Excluir Reagente", `Deseja excluir "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          deletarReagente(id);
          carregarReagentes();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {reagentes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Nenhum reagente cadastrado.</Text>
          <Text style={styles.vazioSub}>Toque no botão + para adicionar.</Text>
        </View>
      ) : (
        <FlatList
          data={reagentes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ReagentCard
              reagente={item}
              onPress={() => navigation.navigate("Detail", { id: item.id! })}
              onLongPress={() => confirmarDelete(item.id!, item.nome)}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Form", {})}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1EFE8",
  },
  vazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  vazioTexto: {
    fontSize: 16,
    color: "#5F5E5A",
    fontWeight: "bold",
  },
  vazioSub: {
    fontSize: 13,
    color: "#888780",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#0F6E56",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabTexto: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 36,
  },
});
