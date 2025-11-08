import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import ModalForm, { FormLayout } from "../../components/ModalForm"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from "../../constants/Colors"; 
import { useForm } from 'react-hook-form';

interface Treino {
  id: number;
  titulo: string;
  duracao: string; 
  calorias: string;
  data: string;
  exercicios: string[];
}

interface FormData {
  titulo: string;
  duracao: string;
  calorias: string;
  exercicios: string;
}

const STORAGE_KEY = '@treinos_list';

export default function TreinosScreen() {
  
  const initialTreinos: Treino[] = [
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
  ];
  
  const [treinos, setTreinos] = useState<Treino[]>(initialTreinos); 
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTreino, setEditingTreino] = useState<Treino | null>(null);

  const { 
    control, 
    handleSubmit,
    reset, 
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      titulo: '', duracao: '', calorias: '', exercicios: ''
    },
    // ZOD
  });

  const saveTreinos = async (treinosToSave: Treino[]) => {
    try {
      const jsonValue = JSON.stringify(treinosToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Erro ao salvar os treinos: ', e);
    }
  };

  const loadTreinos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        setTreinos(JSON.parse(jsonValue) as Treino[]);
      } else {
        setTreinos(initialTreinos);
        await saveTreinos(initialTreinos); // Garante que os dados iniciais sejam salvos
      }
    } catch (e) {
      console.error('Erro ao carregar os treinos: ', e);
      setTreinos(initialTreinos);
    }
  };

  useEffect(() => {
    loadTreinos();
  }, []);
  
  
  //CRUD 
  const cleanForm = useCallback(() => {
    reset(); 
    setEditingTreino(null);
  }, [reset]);

  function handleCloseModal() {
    setModalVisible(false);
    cleanForm();
  }

  function handleOpenAddModal() {
    cleanForm();
    setModalVisible(true);
  }

  function handleOpenEditModal(treino: Treino) {
    setEditingTreino(treino);
    
    setValue('titulo', treino.titulo);
    setValue('duracao', treino.duracao.replace(' min', '')); 
    setValue('calorias', treino.calorias.replace(' cal', ''));
    setValue('exercicios', treino.exercicios.join(', '));
    
    setModalVisible(true);
  }

  const onSubmit = (data: FormData) => {
    if (!data.titulo || !data.duracao || !data.calorias) {
        Alert.alert("Erro", "Preencha pelo menos o Título, Duração e Calorias.");
        return;
    }

    if (editingTreino) {
      editarTreino(data);
    } else {
      adicionarTreino(data);
    }
  };

  function adicionarTreino(data: FormData) {
    const novo: Treino = {
      id: Date.now(),
      titulo: data.titulo,
      duracao: `${data.duracao} min`, 
      calorias: `${data.calorias} cal`,
      data: new Date().toLocaleDateString("pt-BR"),
      exercicios: data.exercicios ? data.exercicios.split(",").map((e) => e.trim()) : [],
    };
    
    const newTreinos = [...treinos, novo];
    setTreinos(newTreinos);
    saveTreinos(newTreinos);
    handleCloseModal();
  }

  function editarTreino(data: FormData) {
    const updatedTreino: Treino = {
      ...editingTreino!, 
      titulo: data.titulo,
      duracao: `${data.duracao} min`,
      calorias: `${data.calorias} cal`,
      exercicios: data.exercicios ? data.exercicios.split(",").map((e) => e.trim()) : [],
      data: editingTreino!.data,
    };

    const newTreinos = treinos.map(t => 
      t.id === updatedTreino.id ? updatedTreino : t
    );
    
    setTreinos(newTreinos);
    saveTreinos(newTreinos);
    handleCloseModal();
  }
  
  function excluirTreino(id: number, titulo: string) {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o treino "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            const newTreinos = treinos.filter(t => t.id !== id);
            setTreinos(newTreinos);
            await saveTreinos(newTreinos); 
          },
          style: "destructive",
        },
      ]
    );
  }

  // Define o layout do formulário para o ModalForm
  const formFields: FormLayout[] = [
    { name: "titulo", label: "Nome do Treino", placeholder: "Ex: Treino de Força" },
    [
      { name: "duracao", label: "Duração (min)", keyboardType: "numeric", placeholder: "45" },
      { name: "calorias", label: "Calorias", keyboardType: "numeric", placeholder: "350" },
    ],
    { name: "exercicios", label: "Exercícios (separados por vírgula)", placeholder: "Agachamento, Supino..." },
  ];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Meus Treinos",
          headerShown: true, // Garante que o header seja visível
          headerRight: () => (
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: Colors.brand.treino }]} 
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
      
      {/* Container principal com ScrollView */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Bloco de Resumo */}
        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Ionicons name="time-outline" size={24} color={Colors.brand.treino} />
            <Text style={styles.resumoValor}>45</Text>
            <Text style={styles.resumoDescricao}>min esta semana</Text>
          </View>
          <View style={styles.resumoCard}>
            <Ionicons name="flame-outline" size={24} color={Colors.success} />
            <Text style={styles.resumoValor}>630</Text>
            <Text style={styles.resumoDescricao}>calorias queimadas</Text>
          </View>
        </View>

        {/* Título da Seção */}
        <Text style={styles.sectionTitle}>Treinos Salvos</Text>

        {/* Lista de Treinos */}
        {treinos.map((t) => (
          <View key={t.id} style={styles.treinoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.treinoTitulo}>{t.titulo}</Text>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => handleOpenEditModal(t)}> 
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={Colors.textSecondary}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirTreino(t.id, t.titulo)}> 
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </TouchableOpacity>
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

        {/* Espaçador no final da lista */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <ModalForm
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit(onSubmit)}
        title={editingTreino ? "Editar Treino" : "Novo Treino"}
        submitLabel={editingTreino ? "Salvar Alterações" : "Adicionar"}
        control={control}
        errors={errors}
        fields={formFields}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white, 
    padding: 16 
  },
  headerButton: { // Botão no header nativo
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  resumoContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 20 
  },
  resumoCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  resumoValor: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginTop: 8,
    color: Colors.text,
  },
  resumoDescricao: { 
    color: Colors.textSecondary, 
    fontSize: 13, 
    marginTop: 2 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 8,
    color: Colors.text,
  },
  treinoCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  treinoTitulo: { 
    fontSize: 15, 
    fontWeight: "600",
    color: Colors.text,
  },
  icons: { 
    flexDirection: "row" 
  },
  icon: { 
    marginRight: 10 
  },
  treinoInfo: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 6 
  },
  infoText: { 
    fontSize: 13, 
    color: Colors.textSecondary 
  },
  infoData: { 
    fontSize: 13, 
    color: Colors.textSecondary 
  },
  exerciciosContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginTop: 8 
  },
  exercicioTag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  exercicioText: { 
    fontSize: 12, 
    color: Colors.text 
  },
});