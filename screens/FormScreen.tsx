import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  mascaraData,
  dataParaISO,
  dataParaBR,
  validarData,
} from "../utils/mascaraData";
import {
  inserirReagente,
  atualizarReagente,
  buscarReagente,
} from "../database/db";
import { Reagente, RootStackParamList } from "../types";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Form">;
  route: RouteProp<RootStackParamList, "Form">;
};

export default function FormScreen({ navigation, route }: Props) {
  const id = route.params?.id;

  const [nome, setNome] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [lote, setLote] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (id) {
      const reagente = buscarReagente(id);
      if (reagente) {
        setNome(reagente.nome);
        setFabricante(reagente.fabricante);
        setLote(reagente.lote);
        setValidade(dataParaBR(reagente.validade));
        setQuantidade(reagente.quantidade);
        setLocalizacao(reagente.localizacao);
        setObservacoes(reagente.observacoes);
        setFoto(reagente.foto);
      }
    }
  }, [id]);

  const salvar = () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome do reagente é obrigatório.");
      return;
    }

    if (!validade.trim() || validade.length < 10) {
      Alert.alert("Atenção", "Preencha a data de validade completa.");
      return;
    }

    if (!validarData(validade)) {
      Alert.alert(
        "Atenção",
        "Data de validade inválida. Verifique o dia e mês informados.",
      );
      return;
    }

    const dados: Omit<Reagente, "id"> = {
      nome,
      fabricante,
      lote,
      validade: dataParaISO(validade),
      quantidade,
      localizacao,
      observacoes,
      foto,
    };

    if (id) {
      atualizarReagente(id, dados);
    } else {
      inserirReagente(dados);
    }

    navigation.goBack();
  };

  const abrirCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Permissão negada",
          "Precisamos da câmera para tirar fotos.",
        );
        return;
      }
    }
    setMostrarCamera(true);
  };

  const tirarFoto = async () => {
    if (cameraRef) {
      const resultado = await cameraRef.takePictureAsync({ quality: 0.5 });
      if (resultado) {
        setFoto(resultado.uri);
        setMostrarCamera(false);
      }
    }
  };

  if (mostrarCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)} />
        <View style={styles.cameraBotoes}>
          <TouchableOpacity
            style={styles.botaoCancelar}
            onPress={() => setMostrarCamera(false)}
          >
            <Text style={styles.botaoTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoFoto} onPress={tirarFoto}>
            <Text style={styles.botaoTexto}>📷 Tirar Foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nome do Reagente *</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Ácido Sulfúrico"
      />

      <Text style={styles.label}>Fabricante</Text>
      <TextInput
        style={styles.input}
        value={fabricante}
        onChangeText={setFabricante}
        placeholder="Ex: LabSynth"
      />

      <Text style={styles.label}>Lote</Text>
      <TextInput
        style={styles.input}
        value={lote}
        onChangeText={setLote}
        placeholder="Ex: L2024-001"
      />

      <Text style={styles.label}>Validade *</Text>
      <TextInput
        style={styles.input}
        value={validade}
        onChangeText={(texto) => setValidade(mascaraData(texto))}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="Ex: 3 frascos / 500mL"
      />

      <Text style={styles.label}>Localização</Text>
      <TextInput
        style={styles.input}
        value={localizacao}
        onChangeText={setLocalizacao}
        placeholder="Ex: Geladeira 2, Prateleira A"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Anotações adicionais..."
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Foto do Frasco</Text>
      {foto ? (
        <View style={styles.fotoContainer}>
          <Image source={{ uri: foto }} style={styles.foto} />
          <TouchableOpacity
            style={styles.botaoFotoTrocar}
            onPress={abrirCamera}
          >
            <Text style={styles.botaoFotoTrocarTexto}>Trocar Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.botaoCamera} onPress={abrirCamera}>
          <Text style={styles.botaoCameraTexto}>📷 Tirar Foto</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
        <Text style={styles.botaoSalvarTexto}>
          {id ? "Salvar Alterações" : "Cadastrar Reagente"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1EFE8",
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#5F5E5A",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },
  fotoContainer: {
    alignItems: "center",
    gap: 8,
  },
  foto: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  botaoFotoTrocar: {
    padding: 8,
  },
  botaoFotoTrocarTexto: {
    color: "#0F6E56",
    fontWeight: "bold",
  },
  botaoCamera: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
    borderStyle: "dashed",
  },
  botaoCameraTexto: {
    fontSize: 15,
    color: "#5F5E5A",
  },
  botaoSalvar: {
    backgroundColor: "#0F6E56",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  botaoSalvarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraBotoes: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 24,
    backgroundColor: "#000",
  },
  botaoFoto: {
    backgroundColor: "#0F6E56",
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  botaoCancelar: {
    backgroundColor: "#A32D2D",
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
