import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StatusReagente } from "../types";

interface Props {
  validade: string;
}

export function calcularStatus(validade: string): StatusReagente {
  const hoje = new Date();
  const dataValidade = new Date(validade);
  const diffDias = Math.ceil(
    (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDias < 0) return "vencido";
  if (diffDias <= 30) return "vencendo";
  return "ok";
}

export default function StatusBadge({ validade }: Props) {
  const status = calcularStatus(validade);

  const config = {
    ok: { label: "✓ Ok", style: styles.ok },
    vencendo: { label: "⚠ Vencendo", style: styles.vencendo },
    vencido: { label: "✕ Vencido", style: styles.vencido },
  };

  const { label, style } = config[status];

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.texto}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  texto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  ok: { backgroundColor: "#0F6E56" },
  vencendo: { backgroundColor: "#854F0B" },
  vencido: { backgroundColor: "#A32D2D" },
});
