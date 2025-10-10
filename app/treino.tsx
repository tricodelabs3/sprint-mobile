import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function TreinoScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    atividade: "",
    duracao: "",
    intensidade: "",
    exercicios: "",
  });

  const [dadosSalvos, setDadosSalvos] = useState<any>(null);

  useEffect(() => {
    const carregar = async () => {
      const salvo = await AsyncStorage.getItem("treino");
      if (salvo) setDadosSalvos(JSON.parse(salvo));
    };
    carregar();
  }, []);

  const salvar = async () => {
    await AsyncStorage.setItem("treino", JSON.stringify(form));
    setDadosSalvos(form);
    Alert.alert("Sucesso!", "Treino salvo com sucesso ✅");
  };

  const limpar = async () => {
    setForm({ atividade: "", duracao: "", intensidade: "", exercicios: "" });
    await AsyncStorage.removeItem("treino");
    setDadosSalvos(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        <Text style={{ color: "#4A90E2" }}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Registro de Treino</Text>

      <TextInput
        style={styles.input}
        placeholder="Atividade (ex: Corrida, Musculação)"
        value={form.atividade}
        onChangeText={(text) => setForm({ ...form, atividade: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Duração (em minutos)"
        keyboardType="numeric"
        value={form.duracao}
        onChangeText={(text) => setForm({ ...form, duracao: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Intensidade (leve, média, alta)"
        value={form.intensidade}
        onChangeText={(text) => setForm({ ...form, intensidade: text })}
      />

      <TextInput 
        style={styles.input}
        placeholder="Exercícios: (ex: Agachamento, Supino, Levantamento Terra)"
        value={form.exercicios}
        onChangeText={(text) => setForm({ ...form, exercicios: text })}
      />

      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.botaoTexto}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, { backgroundColor: "#f55" }]} onPress={limpar}>
        <Text style={styles.botaoTexto}>Limpar</Text>
      </TouchableOpacity>

      {dadosSalvos && (
        <View style={styles.boxSalvo}>
          <Text style={styles.subtitulo}>Último treino salvo:</Text>
          <Text>🏋️ {dadosSalvos.atividade}</Text>
          <Text>⏱️ {dadosSalvos.duracao} min</Text>
          <Text>🔥 Intensidade: {dadosSalvos.intensidade}</Text>
          <Text>💪 Exercícios: {dadosSalvos.exercicios}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  boxSalvo: {
    backgroundColor: "#EAF4FF",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  subtitulo: {
    fontWeight: "bold",
    marginBottom: 8,
  },
});
