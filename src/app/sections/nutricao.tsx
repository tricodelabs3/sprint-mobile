import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Pressable, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalForm, { FormLayout } from '../../components/ModalForm';
import { useForm } from 'react-hook-form';
import { Colors } from '../../constants/Colors';

interface Refeicao {
  id: number;
  titulo: string;
  horario: string;
  calorias: string;
  proteina: string;
  carbos: string;  
  gordura: string; 
}

interface FormData {
    titulo: string;
    horario: string;
    calorias: string;
    proteina: string;
    carbos: string;
    gordura: string;
}

const STORAGE_KEY = '@refeicoes_list';
const META_CALORICA = 2000; // Meta de exemplo

export default function NutricionScreen() {

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

  // 3. Inicialização do react-hook-form
  const { 
    control, 
    handleSubmit, 
    reset, 
    setValue, 
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
        titulo: '', horario: '', calorias: '', proteina: '', carbos: '', gordura: '',
    },
    // Adicionar ZOD para validação aqui dps
  });

  // Funções de Persistência (usando AsyncStorage como exemplo)
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
        await saveRefeicoes(initialRefeicoes);
      }
    } catch (e) {
      console.error('Erro ao carregar as refeições: ', e);
      setRefeicoes(initialRefeicoes);
    }
  };

  useEffect(() => {
    loadRefeicoes();
  }, []);


  // CRUD
  // Reseta o formulário e o estado de edição
  const cleanForm = useCallback(() => {
    reset();
    setEditingRefeicao(null);
  }, [reset]);

  // Fecha o modal e limpa o formulário
  function handleCloseModal() {
    setModalVisible(false);
    cleanForm();
  }

  // Abre o modal para ADICIONAR
  function handleOpenAddModal() {
    cleanForm();
    setModalVisible(true);
  }

  // Abre o modal para EDITAR
  function handleOpenEditModal(refeicao: Refeicao) {
    setEditingRefeicao(refeicao);
    
    setValue('titulo', refeicao.titulo);
    setValue('horario', refeicao.horario);
    setValue('calorias', refeicao.calorias.replace(' cal', ''));
    setValue('proteina', refeicao.proteina.replace('g prot', ''));
    setValue('carbos', refeicao.carbos.replace('g carbs', ''));
    setValue('gordura', refeicao.gordura.replace('g gord', ''));
    
    setModalVisible(true);
  }

  const onSubmit = (data: FormData) => {
    if (!data.titulo || !data.horario || !data.calorias) {
        Alert.alert("Erro", "Preencha pelo menos o Título, Horário e Calorias.");
        return;
    }

    if (editingRefeicao) {
      editarRefeicao(data);
    } else {
      adicionarRefeicao(data);
    }
  }

  function adicionarRefeicao(data: FormData) {
    const novaRefeicao: Refeicao = {
      id: Date.now(),
      titulo: data.titulo,
      horario: data.horario,
      calorias: `${data.calorias || 0} cal`,
      proteina: `${data.proteina || 0}g prot`,
      carbos: `${data.carbos || 0}g carbs`,
      gordura: `${data.gordura || 0}g gord`,
    };
    
    const newRefeicoes = [...refeicoes, novaRefeicao];
    setRefeicoes(newRefeicoes);
    saveRefeicoes(newRefeicoes);
    handleCloseModal();
  }

  function editarRefeicao(data: FormData) {
    const updatedRefeicao: Refeicao = {
      ...editingRefeicao!,
      titulo: data.titulo,
      horario: data.horario,
      calorias: `${data.calorias || 0} cal`,
      proteina: `${data.proteina || 0}g prot`,
      carbos: `${data.carbos || 0}g carbs`,
      gordura: `${data.gordura || 0}g gord`,
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
          onPress: async () => {
            const newRefeicoes = refeicoes.filter(r => r.id !== id);
            setRefeicoes(newRefeicoes);
            await saveRefeicoes(newRefeicoes);
          },
          style: "destructive",
        },
      ]
    );
  }
  

  const extractValue = (valueString: string) => {
    const match = valueString.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  const { totalCalorias, totalProteina, progresso } = useMemo(() => {
    const calorias = refeicoes.reduce((sum: number, r: Refeicao) => sum + extractValue(r.calorias), 0);
    const proteina = refeicoes.reduce((sum: number, r: Refeicao) => sum + extractValue(r.proteina), 0);
    const progressoPercent = Math.min(100, (calorias / META_CALORICA) * 100);
    
    return {
      totalCalorias: calorias,
      totalProteina: proteina,
      progresso: progressoPercent,
    };
  }, [refeicoes]); 

  // Define o layout do formulário para o ModalForm
  const formFields: FormLayout[] = [
    { name: "titulo", label: "Nome da Refeição", placeholder: "Ex: Almoço" },
    { name: "horario", label: "Horário (HH:MM)", placeholder: "08:00" },
    { name: "calorias", label: "Calorias (kcal)", keyboardType: "numeric", placeholder: "450" },
    [ 
      { name: "proteina", label: "Proteína (g)", keyboardType: "numeric", placeholder: "25" },
      { name: "carbos", label: "Carboidratos (g)", keyboardType: "numeric", placeholder: "45" },
      { name: "gordura", label: "Gordura (g)", keyboardType: "numeric", placeholder: "12" },
    ],
  ];


  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Nutrição",
          headerShown: true, // Garante que o header seja visível
          headerRight: () => (
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: Colors.brand.nutricao }]} 
              onPress={handleOpenAddModal}
            >
              <Ionicons name="add" size={22} color={Colors.actionIcon} />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
        }} 
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Bloco de Resumo */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumo de Hoje</Text>
          <View style={styles.row}>
            <View style={styles.summaryItem}>
              <Ionicons name="nutrition-outline" size={22} color={Colors.brand.nutricao} />
              <Text style={styles.value}>{totalCalorias}</Text>
              <Text style={styles.label}>calorias consumidas</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="water-outline" size={22} color={Colors.info} />
              <Text style={styles.value}>{totalProteina}g</Text>
              <Text style={styles.label}>proteína</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.metaText}>Meta diária</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progresso}%` }]} />
            </View>
            <Text style={styles.metaDetail}>{totalCalorias} / {META_CALORICA} cal</Text>
          </View>
        </View>

        {/* Título da Seção */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Refeições de Hoje</Text>

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
              <Pressable onPress={() => handleOpenEditModal(r)}>
                <Ionicons name="create-outline" size={18} color={Colors.textSecondary} />
              </Pressable>
              <Pressable onPress={() => excluirRefeicao(r.id, r.titulo)}>
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </Pressable>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />

        <ModalForm
          visible={modalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSubmit(onSubmit)}
          title={editingRefeicao ? "Editar Refeição" : "Nova Refeição"}
          submitLabel={editingRefeicao ? "Salvar Alterações" : "Adicionar"}
          control={control}
          errors={errors}
          fields={formFields}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white, 
    padding: 20 
  },
  headerButton: { // Botão no header nativo
    backgroundColor: Colors.brand.nutricao,
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginBottom: 10,
    color: Colors.text,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 10 
  },
  summaryItem: { 
    alignItems: 'center' 
  },
  value: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 4,
    color: Colors.text,
  },
  label: { 
    color: Colors.textSecondary, 
    fontSize: 12 
  },
  progressContainer: { 
    marginTop: 10 
  },
  metaText: { 
    color: Colors.textSecondary, 
    marginBottom: 4 
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: 8,
    backgroundColor: Colors.brand.nutricao,
  },
  metaDetail: { 
    textAlign: 'right', 
    fontSize: 12, 
    color: Colors.textSecondary, 
    marginTop: 4 
  },
  mealCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mealHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 6 
  },
  mealTitle: { 
    fontWeight: 'bold', 
    fontSize: 15,
    color: Colors.text,
  },
  mealTime: { 
    fontSize: 13, 
    color: Colors.textSecondary 
  },
  macros: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8,
    flexWrap: 'wrap', // Permite quebra de linha em telas menores
  },
  macro: { 
    fontSize: 13, 
    color: Colors.textSecondary,
    marginRight: 5, // Adiciona espaço entre os macros
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 10,
  },
});