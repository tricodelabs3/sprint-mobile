import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalForm, { FormLayout } from "../../components/ModalForm";
import { useForm } from 'react-hook-form'; 
import { Colors } from "../../constants/Colors";

interface SleepRecord {
  id: number;
  date: string;
  duration: number;
  deepSleep: number;
  lightSleep: number;
  rem: number;
  quality: number;
}

interface FormData {
    date: string;
    duration: string;
    deepSleep: string;
    lightSleep: string;
    rem: string;
}

const STORAGE_KEY = '@sleep_records_list';
const MAX_SLEEP_HOURS = 8;

const initialRecords: SleepRecord[] = [
    { id: 1, date: "06/01/2025", duration: 7.5, deepSleep: 2.1, lightSleep: 4.8, rem: 0.6, quality: 85 },
    { id: 2, date: "05/01/2025", duration: 6.8, deepSleep: 1.5, lightSleep: 4.5, rem: 0.8, quality: 72 },
    { id: 3, date: "04/01/2025", duration: 8.1, deepSleep: 2.5, lightSleep: 4.6, rem: 1.0, quality: 90 },
];

const getQualityStyle = (quality: number) => {
  if (quality >= 80) return { color: Colors.success, text: "Excelente" };
  if (quality >= 70) return { color: Colors.brand.alerta, text: "Bom" };
  return { color: Colors.danger, text: "Razoável" };
};

export default function SonoScreen() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SleepRecord | null>(null);

  const { 
    control, 
    handleSubmit,
    reset, 
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
        date: '', duration: '', deepSleep: '', lightSleep: '', rem: ''
    },
    // ZOD
  });

  const saveRecords = async (recordsToSave: SleepRecord[]) => {
    try {
      const jsonValue = JSON.stringify(recordsToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Erro ao salvar os registros de sono: ', e);
    }
  };

  const loadRecords = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        setRecords(JSON.parse(jsonValue) as SleepRecord[]);
      } else {
        setRecords(initialRecords);
        await saveRecords(initialRecords);
      }
    } catch (e) {
      console.error('Erro ao carregar os registros de sono: ', e);
      setRecords(initialRecords);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const calculations = useMemo(() => {
    // Ordena os registros por data para garantir que o "lastNight" seja o mais recente
    const sortedRecords = [...records].sort((a, b) => {
        // Converte data "DD/MM/AAAA" para um objeto Date comparável
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
    });
    
    const lastNight = sortedRecords[0] || { duration: 0, quality: 0, deepSleep: 0, lightSleep: 0, rem: 0 };
    
    const validRecords = records.filter(r => r.duration > 0);
    const totalDuration = validRecords.reduce((sum, r) => sum + r.duration, 0);
    const totalQuality = validRecords.reduce((sum, r) => sum + r.quality, 0);
    
    const weeklyAverage = validRecords.length > 0 ? (totalDuration / validRecords.length) : 0;
    const averageQuality = validRecords.length > 0 ? (totalQuality / validRecords.length) : 0;
    
    const consistentDays = validRecords.filter(r => r.quality >= 70).length;
    const consistency = validRecords.length > 0 ? Math.round((consistentDays / validRecords.length) * 100) : 0;

    return {
      lastNight,
      weeklyAverage: weeklyAverage.toFixed(1),
      averageQuality: Math.round(averageQuality),
      consistency,
      history: sortedRecords,
    };
  }, [records]);

  //CRUD
  const cleanForm = useCallback(() => {
    reset();
    setValue('date', new Date().toLocaleDateString("pt-BR")); // Define a data de hoje
    setEditingRecord(null);
  }, [reset, setValue]);

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
  function handleOpenEditModal(record: SleepRecord) {
    setEditingRecord(record);
    
    // Preenche o formulário com os valores do registro
    setValue('date', record.date);
    setValue('duration', record.duration.toString());
    setValue('deepSleep', record.deepSleep.toString());
    setValue('lightSleep', record.lightSleep.toString());
    setValue('rem', record.rem.toString());
    
    setModalVisible(true);
  }

  // Função para calcular a qualidade (exemplo)
  function calculateQuality(total: number, deep: number, rem: number): number {
      const durationScore = Math.min(1, total / MAX_SLEEP_HOURS) * 50;
      const deepScore = Math.min(1, deep / (total * 0.2)) * 30; 
      const remScore = Math.min(1, rem / (total * 0.15)) * 20;
      return Math.round(Math.min(100, durationScore + deepScore + remScore));
  }
  
  // Esta função SÓ é chamada se a validação do hook-form passar
  const onSubmit = (data: FormData) => {
    const total = parseFloat(data.duration);
    const deep = parseFloat(data.deepSleep);
    const light = parseFloat(data.lightSleep);
    const remF = parseFloat(data.rem);
    
    if (isNaN(total) || isNaN(deep) || isNaN(light) || isNaN(remF) || total <= 0) {
        Alert.alert("Erro de Entrada", "Por favor, insira valores numéricos válidos para o sono.");
        return;
    }
    
    const newQuality = calculateQuality(total, deep, remF);
    
    const newRecord: SleepRecord = {
        id: editingRecord ? editingRecord.id : Date.now(),
        date: data.date,
        duration: total,
        deepSleep: deep,
        lightSleep: light,
        rem: remF,
        quality: newQuality,
    };

    if (editingRecord) {
      // Lógica de Edição
      const newRecords = records.map(r => 
        r.id === newRecord.id ? newRecord : r
      );
      setRecords(newRecords);
      saveRecords(newRecords);
    } else {
      // Lógica de Adição
      const newRecords = [...records, newRecord];
      setRecords(newRecords);
      saveRecords(newRecords);
    }
    
    handleCloseModal();
  }

  function excluirRecord(id: number, recordDate: string) {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o registro de sono de ${recordDate}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            const newRecords = records.filter(r => r.id !== id);
            setRecords(newRecords);
            await saveRecords(newRecords);
          },
          style: "destructive",
        },
      ]
    );
  }

  // Define o layout do formulário para o ModalForm
  const formFields: FormLayout[] = [
      { name: "date", label: "Data", placeholder: "DD/MM/AAAA" },
      { name: "duration", label: "Duração Total (horas)", placeholder: "Ex: 7.5", keyboardType: "numeric" },
      [
          { name: "deepSleep", label: "Sono Profundo (h)", placeholder: "Ex: 2.1", keyboardType: "numeric" },
          { name: "lightSleep", label: "Sono Leve (h)", placeholder: "Ex: 4.8", keyboardType: "numeric" },
          { name: "rem", label: "REM (h)", placeholder: "Ex: 0.6", keyboardType: "numeric" },
      ],
  ];

  const lastNight = calculations.lastNight;
  const lastNightQualityStyle = getQualityStyle(lastNight.quality);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Análise do Sono",
          headerShown: true, // Garante que o header seja visível
          headerRight: () => (
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: Colors.brand.sono }]} 
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
        
        {/* Noite Passada Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="moon" size={20} color={Colors.brand.sono} />
            <Text style={styles.sectionTitle}>Noite Passada</Text>
          </View>

          <View style={styles.mainInfo}>
            <View>
              <Text style={styles.mainValue}>{lastNight.duration.toFixed(1)}h</Text>
              <Text style={styles.mainLabel}>duração total</Text>
            </View>
            <View style={styles.qualityContainer}>
              <Text style={[styles.mainValue, { color: lastNightQualityStyle.color }]}>
                {lastNight.quality}%
              </Text>
              <Text style={styles.mainLabel}>qualidade</Text>
            </View>
          </View>

          <View style={styles.timeInfo}>
            <View style={styles.timeItem}>
              <Ionicons name="bed-outline" size={16} color={Colors.brand.sono} />
              <Text style={styles.timeText}>Dormir: 23:15</Text>
            </View>
            <View style={styles.timeItem}>
              <Ionicons name="sunny-outline" size={16} color={Colors.brand.alerta} />
              <Text style={styles.timeText}>Acordar: 06:45</Text>
            </View>
          </View>

          {/* Detalhes do Sono */}
          <View style={styles.sleepDetails}>
            {renderSleepDetail("Sono Profundo", lastNight.deepSleep, MAX_SLEEP_HOURS, Colors.brand.treino)}
            {renderSleepDetail("Sono Leve", lastNight.lightSleep, MAX_SLEEP_HOURS, Colors.brand.nutricao)}
            {renderSleepDetail("REM", lastNight.rem, MAX_SLEEP_HOURS, Colors.brand.sono)}
          </View>
          
          {/* Botão de Edição Rápida */}
          {lastNight.duration > 0 && (
              <TouchableOpacity 
                  style={[styles.editButton, {backgroundColor: Colors.brand.sonoBg}]}
                  onPress={() => handleOpenEditModal(calculations.history[0])}
              >
                  <Text style={[styles.editButtonText, {color: Colors.brand.sono}]}>Editar Último Registro</Text>
              </TouchableOpacity>
          )}
        </View>

        {/* Resumo Semanal */}
        <View style={styles.summaryGrid}>
          {renderSummaryItem("timer-outline", `${calculations.weeklyAverage}h`, "média semanal", Colors.brand.treino)}
          {renderSummaryItem("stats-chart-outline", `${calculations.averageQuality}%`, "qualidade média", Colors.brand.nutricao)}
          {renderSummaryItem("moon-outline", `${calculations.consistency}%`, "consistência", Colors.brand.sono)}
        </View>

        {/* Histórico Semanal */}
        <Text style={styles.sectionTitleWithMargin}>Histórico da Semana</Text>
        <View style={styles.historyCard}>
          {calculations.history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.historyDate}>{item.date}</Text>
              
              <View style={styles.historyDetails}>
                  <Text style={styles.historyDuration}>{item.duration.toFixed(1)}h</Text>
                  <Text style={styles.historyLabel}>duração</Text>
              </View>
              
              <View style={styles.historyDetails}>
                  <Text style={[styles.historyQuality, { color: getQualityStyle(item.quality).color }]}>
                  {item.quality}%
                  </Text>
                  <Text style={[styles.historyLabel, {color: getQualityStyle(item.quality).color}]}>
                  {getQualityStyle(item.quality).text}
                  </Text>
              </View>

              <TouchableOpacity 
                  onPress={() => excluirRecord(item.id, item.date)}
                  style={{ marginLeft: 10 }}
              >
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />


        {/* CORREÇÃO 3: ModalForm agora recebe control, errors e o handleSubmit */}
        <ModalForm
          visible={modalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSubmit(onSubmit)} // 👈 handleSubmit valida antes de chamar onSubmit
          title={editingRecord ? "Editar Sono" : "Novo Registro de Sono"}
          submitLabel={editingRecord ? "Salvar Alterações" : "Adicionar"}
          control={control}
          errors={errors}
          fields={formFields}
        />
      </ScrollView>
    </>
  );
}

const renderSleepDetail = (label: string, hours: number, maxHours: number, color: string) => {
  const progress = (hours / maxHours) * (maxHours / 3.5); // Ajuste visual da barra
  
  return (
    <View style={detailStyles.detailRow}>
      <Text style={detailStyles.detailLabel}>{label}</Text>
      <View style={detailStyles.detailBarContainer}>
        <ProgressBar progress={progress} color={color} />
      </View>
      <Text style={detailStyles.detailHours}>{hours.toFixed(1)}h</Text>
    </View>
  );
};

const renderSummaryItem = (iconName: keyof typeof Ionicons.glyphMap, value: string, label: string, color: string) => (
  <View style={styles.summaryItem}>
    <Ionicons name={iconName} size={28} color={color} />
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    <Text style={styles.summaryLabelText}>{label}</Text>
  </View>
);

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => {
  const clampedProgress = Math.min(1, Math.max(0, progress)); 
  return (
    <View style={styles.progressBarContainer}>
      <View
        style={[
          styles.progressBar,
          { width: `${clampedProgress * 100}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
};

const detailStyles = StyleSheet.create({
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: Colors.text,
        width: 100, // Largura fixa para alinhamento
    },
    detailBarContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    detailHours: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        width: 40, // Largura fixa para alinhamento
        textAlign: 'right',
    }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  headerButton: { // Botão no header nativo
    backgroundColor: Colors.brand.sono,
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  editButton: {
      marginTop: 15,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
  },
  editButtonText: {
      fontWeight: '600',
  },
  
  // Estilos de Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: Colors.text,
  },
  sectionTitleWithMargin: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10,
    marginBottom: 10,
    color: Colors.text,
  },

  // Info Principal (Duração Total e Qualidade)
  mainInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.text,
  },
  mainLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  qualityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },

  // Horários de Dormir/Acordar
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Detalhes do Sono (Barras de Progresso)
  sleepDetails: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },

  // Grid de Resumo Semanal
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
    marginHorizontal: -4, 
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  summaryLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  // Histórico Semanal
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyDate: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  historyDetails: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
    minWidth: 80,
  },
  historyDuration: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  historyQuality: {
    fontSize: 15,
    fontWeight: "500",
  },
  historyLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});