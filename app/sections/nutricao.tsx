import React, { useEffect, useState } from 'react'; // 👈 CORRIGIDO: useState e useEffect importados de 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native'; // 👈 CORRIGIDO: Alert adicionado
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalForm from '../../components/ModalForm';

// 1. Interface para o Objeto Refeição
interface Refeicao {
  id: number;
  titulo: string;
  horario: string;
  calorias: string; // Ex: "420 cal"
  proteina: string; // Ex: "25g prot"
  carbos: string; // Ex: "45g carbs"
  gordura: string; // Ex: "12g gord"
}

// Chave para salvar os dados
const STORAGE_KEY = '@refeicoes_list';

export default function NutricionScreen() {
  const router = useRouter();

  // Dados iniciais
  const initialRefeicoes: Refeicao[] = [
    {
      id: 1,
      titulo: "Café da Manhã",
      horario: "08:00",
      calorias: "420 cal",
      proteina: "25g prot",
      carbos: "45g carbs",
      gordura: "12g gord",
    },
    {
      id: 2,
      titulo: "Almoço",
      horario: "12:30",
      calorias: "680 cal",
      proteina: "40g prot",
      carbos: "65g carbs",
      gordura: "22g gord",
    },
  ];

  // Estados
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>(initialRefeicoes);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRefeicao, setEditingRefeicao] = useState<Refeicao | null>(null);

  // Estados para os campos do Modal
  const [titulo, setTitulo] = useState("");
  const [horario, setHorario] = useState("");
  const [calorias, setCalorias] = useState("");
  const [proteina, setProteina] = useState("");
  const [carbos, setCarbos] = useState("");
  const [gordura, setGordura] = useState("");


  // ------------------------------------------------------------------
  // FUNÇÕES DE PERSISTÊNCIA
  // ------------------------------------------------------------------

  const saveRefeicoes = async (refeicoesToSave: Refeicao[]) => {
    try {
      const jsonValue = JSON.stringify(refeicoesToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Erro ao salvar as refeições: ', e);
    }
  };

  const loadRefeicoes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        setRefeicoes(JSON.parse(jsonValue) as Refeicao[]);
      } else {
        setRefeicoes(initialRefeicoes);
        saveRefeicoes(initialRefeicoes);
      }
    } catch (e) {
      console.error('Erro ao carregar as refeições: ', e);
      setRefeicoes(initialRefeicoes);
    }
  };

  useEffect(() => {
    loadRefeicoes();
  }, []);

  // ------------------------------------------------------------------
  // FUNÇÕES CRUD e MODAL
  // ------------------------------------------------------------------

  function cleanForm() {
    setTitulo("");
    setHorario("");
    setCalorias("");
    setProteina("");
    setCarbos("");
    setGordura("");
    setEditingRefeicao(null);
  }

  function handleCloseModal() {
    setModalVisible(false);
    cleanForm();
  }

  function handleOpenAddModal() {
    cleanForm();
    setModalVisible(true);
  }

  function handleOpenEditModal(refeicao: Refeicao) {
    setEditingRefeicao(refeicao);
    setTitulo(refeicao.titulo);
    setHorario(refeicao.horario);
    // Remove as unidades para preencher o input corretamente
    setCalorias(refeicao.calorias.replace(' cal', ''));
    setProteina(refeicao.proteina.replace('g prot', ''));
    setCarbos(refeicao.carbos.replace('g carbs', ''));
    setGordura(refeicao.gordura.replace('g gord', ''));
    setModalVisible(true);
  }

  function handleSubmit() {
    if (editingRefeicao) {
      editarRefeicao();
    } else {
      adicionarRefeicao();
    }
  }

  function adicionarRefeicao() {
    const novaRefeicao: Refeicao = {
      id: Date.now(),
      titulo: titulo,
      horario: horario,
      calorias: `${calorias} cal`,
      proteina: `${proteina}g prot`,
      carbos: `${carbos}g carbs`,
      gordura: `${gordura}g gord`,
    };
    
    const newRefeicoes = [...refeicoes, novaRefeicao];
    setRefeicoes(newRefeicoes);
    saveRefeicoes(newRefeicoes);
    handleCloseModal();
  }

  function editarRefeicao() {
    const updatedRefeicao: Refeicao = {
      ...editingRefeicao!,
      titulo: titulo,
      horario: horario,
      calorias: `${calorias} cal`,
      proteina: `${proteina}g prot`,
      carbos: `${carbos}g carbs`,
      gordura: `${gordura}g gord`,
    };

    const newRefeicoes = refeicoes.map(r => 
      r.id === updatedRefeicao.id ? updatedRefeicao : r
    );
    
    setRefeicoes(newRefeicoes);
    saveRefeicoes(newRefeicoes);
    handleCloseModal();
  }
  
  function excluirRefeicao(id: number, titulo: string) {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a refeição "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            const newRefeicoes = refeicoes.filter(r => r.id !== id);
            setRefeicoes(newRefeicoes);
            saveRefeicoes(newRefeicoes);
          },
          style: "destructive",
        },
      ]
    );
  }
  
  // ------------------------------------------------------------------
  // CÁLCULOS DE RESUMO (COM TIPAGEM CORRIGIDA)
  // ------------------------------------------------------------------

  // Extrai apenas o número da string de caloria (Ex: "420 cal" -> 420)
  const extractValue = (valueString: string) => {
    const match = valueString.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  // CORREÇÃO: Tipagem explícita para 'sum' (number) e 'r' (Refeicao)
  const totalCalorias = refeicoes.reduce((sum: number, r: Refeicao) => sum + extractValue(r.calorias), 0);
  const totalProteina = refeicoes.reduce((sum: number, r: Refeicao) => sum + extractValue(r.proteina), 0);
  
  const metaCalorica = 2000;
  const progresso = Math.min(100, (totalCalorias / metaCalorica) * 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      
      {/* Header */}
      <View style={styles.header}>
        
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Nutrição</Text>
        
        {/* Botão de adicionar refeição */}
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAddModal}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>



      {/* Resumo */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumo de Hoje</Text>
        <View style={styles.row}>
          <View style={styles.summaryItem}>
            <Ionicons name="nutrition-outline" size={22} color="#4CAF50" />
            <Text style={styles.value}>{totalCalorias}</Text>
            <Text style={styles.label}>calorias consumidas</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="water-outline" size={22} color="#2196F3" />
            <Text style={styles.value}>{totalProteina}g</Text>
            <Text style={styles.label}>proteína</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.metaText}>Meta diária</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progresso}%` }]} />
          </View>
          <Text style={styles.metaDetail}>{totalCalorias} / {metaCalorica} cal</Text>
        </View>
      </View>

      {/* Refeições */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Refeições de Hoje</Text>

      {/* Mapeia e Renderiza as Refeições do Estado */}
      {refeicoes.map((r) => (
        <View key={r.id} style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTitle}>{r.titulo}</Text>
            <Text style={styles.mealTime}>{r.horario}</Text>
          </View>

          <View style={styles.macros}>
            <Text style={styles.macro}>{r.calorias}</Text>
            <Text style={styles.macro}>{r.proteina}</Text>
            <Text style={styles.macro}>{r.carbos}</Text>
            <Text style={styles.macro}>{r.gordura}</Text>
          </View>

          <View style={styles.mealActions}>
            {/* Botão de Editar */}
            <Pressable onPress={() => handleOpenEditModal(r)}>
              <Ionicons name="create-outline" size={18} color="#444" />
            </Pressable>
            {/* Botão de Excluir */}
            <Pressable onPress={() => excluirRefeicao(r.id, r.titulo)}>
              <Ionicons name="trash-outline" size={18} color="#E91E63" />
            </Pressable>
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />

      {/* Modal para adicionar/editar refeição */}
      <ModalForm
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingRefeicao ? "Editar Refeição" : "Nova Refeição"}
        submitLabel={editingRefeicao ? "Salvar Alterações" : "Adicionar"}
        fields={[
          { label: "Nome da Refeição", placeholder: "Ex: Almoço", value: titulo, onChangeText: setTitulo },
          { label: "Horário (HH:MM)", placeholder: "08:00", value: horario, onChangeText: setHorario },
          { label: "Calorias (kcal)", value: calorias, onChangeText: setCalorias, keyboardType: "numeric" },
          { label: "Proteína (g)", value: proteina, onChangeText: setProteina, keyboardType: "numeric" },
          { label: "Carboidratos (g)", value: carbos, onChangeText: setCarbos, keyboardType: "numeric" },
          { label: "Gordura (g)", value: gordura, onChangeText: setGordura, keyboardType: "numeric" },
        ]}
      />
    </ScrollView>
  );
}

// ... (styles permanecem inalterados)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 6,
  },

  
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  summaryItem: { alignItems: 'center' },
  value: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  label: { color: '#777', fontSize: 12 },
  progressContainer: { marginTop: 10 },
  metaText: { color: '#777', marginBottom: 4 },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: 8,
    backgroundColor: '#4CAF50',
  },
  metaDetail: { textAlign: 'right', fontSize: 12, color: '#666', marginTop: 4 },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  mealTitle: { fontWeight: 'bold', fontSize: 15 },
  mealTime: { fontSize: 13, color: '#777' },
  macros: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  macro: { fontSize: 13, color: '#555' },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 10,
  },
});