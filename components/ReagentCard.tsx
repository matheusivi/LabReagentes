import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Reagente } from "../types";
import StatusBadge from "./StatusBadge";

interface Props {
  reagente: Reagente;
  onPress: () => void;
  onLongPress: () => void;
}

export default function ReagentCard({ reagente, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.header}>
        <Text style={styles.nome} numberOfLines={1}>
          {reagente.nome}
        </Text>
        <StatusBadge validade={reagente.validade} />
      </View>

      <View style={styles.info}>
        <Text style={styles.detalhe}>
          🏭 {reagente.fabricante || "Sem fabricante"}
        </Text>
        <Text style={styles.detalhe}>
          📦 Lote: {reagente.lote || "Não informado"}
        </Text>
        <Text style={styles.detalhe}>📅 Validade: {reagente.validade}</Text>
        <Text style={styles.detalhe}>
          📍 {reagente.localizacao || "Sem localização"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C2C2A",
    flex: 1,
    marginRight: 8,
  },
  info: {
    gap: 4,
  },
  detalhe: {
    fontSize: 13,
    color: "#5F5E5A",
  },
});
