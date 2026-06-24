import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { buscarReagente, deletarReagente } from "../database/db";
import { Reagente, RootStackParamList } from "../types";
import StatusBadge from "../components/StatusBadge";
import { dataParaBR } from "../utils/mascaraData";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Detail">;
  route: RouteProp<RootStackParamList, "Detail">;
};

export default function DetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const [reagente, setReagente] = useState<Reagente | null>(null);

  useFocusEffect(
    useCallback(() => {
      const dados = buscarReagente(id);
      setReagente(dados);
    }, [id]),
  );

  const confirmarDelete = () => {
    Alert.alert("Excluir Reagente", `Deseja excluir "${reagente?.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          deletarReagente(id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!reagente) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingTexto}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {reagente.foto ? (
        <Image source={{ uri: reagente.foto }} style={styles.foto} />
      ) : (
        <View style={styles.semFoto}>
          <Text style={styles.semFotoTexto}>📷 Sem foto cadastrada</Text>
        </View>
      )}

      <View style={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.nome}>{reagente.nome}</Text>
          <StatusBadge validade={reagente.validade} />
        </View>

        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Informações do Reagente</Text>

          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>🏭 Fabricante</Text>
            <Text style={styles.linhaValor}>{reagente.fabricante || "—"}</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>📦 Lote</Text>
            <Text style={styles.linhaValor}>{reagente.lote || "—"}</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>📅 Validade</Text>
            <Text style={styles.linhaValor}>
              {dataParaBR(reagente.validade)}
            </Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>🔢 Quantidade</Text>
            <Text style={styles.linhaValor}>{reagente.quantidade || "—"}</Text>
          </View>

          <View style={styles.linha}>
            <Text style={styles.linhaLabel}>📍 Localização</Text>
            <Text style={styles.linhaValor}>{reagente.localizacao || "—"}</Text>
          </View>
        </View>

        {reagente.observacoes ? (
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Observações</Text>
            <Text style={styles.observacoes}>{reagente.observacoes}</Text>
          </View>
        ) : null}

        <View style={styles.botoes}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => navigation.navigate("Form", { id })}
          >
            <Text style={styles.botaoTexto}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={confirmarDelete}
          >
            <Text style={styles.botaoTexto}>🗑️ Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1EFE8",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingTexto: {
    fontSize: 16,
    color: "#5F5E5A",
  },
  foto: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  semFoto: {
    width: "100%",
    height: 120,
    backgroundColor: "#D3D1C7",
    alignItems: "center",
    justifyContent: "center",
  },
  semFotoTexto: {
    fontSize: 15,
    color: "#888780",
  },
  conteudo: {
    padding: 16,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C2C2A",
    flex: 1,
    marginRight: 8,
  },
  secao: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0F6E56",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F1EFE8",
  },
  linhaLabel: {
    fontSize: 14,
    color: "#5F5E5A",
  },
  linhaValor: {
    fontSize: 14,
    color: "#2C2C2A",
    fontWeight: "500",
    maxWidth: "55%",
    textAlign: "right",
  },
  observacoes: {
    fontSize: 14,
    color: "#444441",
    lineHeight: 22,
  },
  botoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  botaoEditar: {
    flex: 1,
    backgroundColor: "#0F6E56",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoExcluir: {
    flex: 1,
    backgroundColor: "#A32D2D",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
