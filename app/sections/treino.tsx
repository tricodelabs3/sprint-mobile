import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ModalForm from "../components/ModalForm";

export default function TreinosScreen() {
  const [treinos, setTreinos] = useState([
    {
      id: 1,
      titulo: "Treino de Força",
      duracao: "60 min",
      calorias: "350 cal",
      data: "05/01/2024",
      exercicios: ["Agachamento", "Supino", "Barra fixa"],
    },
    {
      id: 2,
      titulo: "Cardio HIIT",
      duracao: "30 min",
      calorias: "280 cal",
      data: "04/01/2024",
      exercicios: ["Burpees", "Jump squat", "Mountain climbers"],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Estados para os campos do Modal
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [calorias, setCalorias] = useState("");
  const [exercicios, setExercicios] = useState("");

  function adicionarTreino() {
    const novo = {
      id: treinos.length + 1,
      titulo: nome,
      duracao: `${duracao} min`,
      calorias: `${calorias} cal`,
      data: new Date().toLocaleDateString("pt-BR"),
      exercicios: exercicios
        ? exercicios.split(",").map((e) => e.trim())
        : [],
    };
    setTreinos([...treinos, novo]);
    setModalVisible(false);

    // Limpa os campos após adicionar
    setNome("");
    setDuracao("");
    setCalorias("");
    setExercicios("");
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meus Treinos</Text>

        {/* Botão de adicionar treino */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Resumo */}
      <View style={styles.resumoContainer}>
        <View style={styles.resumoCard}>
          <Ionicons name="time-outline" size={24} color="#007AFF" />
          <Text style={styles.resumoValor}>45</Text>
          <Text style={styles.resumoDescricao}>min esta semana</Text>
        </View>
        <View style={styles.resumoCard}>
          <Ionicons name="flame-outline" size={24} color="#34C759" />
          <Text style={styles.resumoValor}>630</Text>
          <Text style={styles.resumoDescricao}>calorias queimadas</Text>
        </View>
      </View>

      {/* Treinos Recentes */}
      <Text style={styles.sectionTitle}>Treinos Recentes</Text>

      {treinos.map((t) => (
        <View key={t.id} style={styles.treinoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.treinoTitulo}>{t.titulo}</Text>
            <View style={styles.icons}>
              <Ionicons
                name="create-outline"
                size={18}
                color="#444"
                style={styles.icon}
              />
              <Ionicons name="trash-outline" size={18} color="#e63946" />
            </View>
          </View>
          <View style={styles.treinoInfo}>
            <Text style={styles.infoText}>{t.duracao}</Text>
            <Text style={styles.infoText}>{t.calorias}</Text>
            <Text style={styles.infoData}>{t.data}</Text>
          </View>
          <View style={styles.exerciciosContainer}>
            {t.exercicios.map((ex, index) => (
              <View key={index} style={styles.exercicioTag}>
                <Text style={styles.exercicioText}>{ex}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Modal para adicionar treino */}
      <ModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={adicionarTreino}
        title="Novo Treino"
        fields={[
          { label: "Nome do Treino", placeholder: "Ex: Treino de Força", value: nome, onChangeText: setNome },
          { label: "Duração (min)", value: duracao, onChangeText: setDuracao, keyboardType: "numeric" },
          { label: "Calorias", value: calorias, onChangeText: setCalorias, keyboardType: "numeric" },
          { label: "Exercícios (separados por vírgula)", placeholder: "Agachamento, Supino...", value: exercicios, onChangeText: setExercicios },
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 6,
  },
  resumoContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  resumoCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  resumoValor: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  resumoDescricao: { color: "#555", fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  treinoCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  treinoTitulo: { fontSize: 15, fontWeight: "600" },
  icons: { flexDirection: "row" },
  icon: { marginRight: 10 },
  treinoInfo: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  infoText: { fontSize: 13, color: "#444" },
  infoData: { fontSize: 13, color: "#777" },
  exerciciosContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  exercicioTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  exercicioText: { fontSize: 12, color: "#333" },
});
