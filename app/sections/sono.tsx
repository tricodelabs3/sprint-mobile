import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalForm from "../../components/ModalForm"; // Componente ModalForm

// 1. Interface para o Objeto Registro de Sono
interface SleepRecord {
  id: number;
  date: string; // Ex: "06/01/2025"
  duration: number; // em horas (total)
  deepSleep: number; // em horas
  lightSleep: number; // em horas
  rem: number; // em horas
  quality: number; // em %
}

// Chave para salvar os dados
const STORAGE_KEY = '@sleep_records_list';
const MAX_SLEEP_HOURS = 8; // Máximo de horas de sono para cálculo do progresso

// Dados simulados baseados na imagem
const initialRecords: SleepRecord[] = [
    { id: 1, date: "06/01/2025", duration: 7.5, deepSleep: 2.1, lightSleep: 4.8, rem: 0.6, quality: 85 },
    { id: 2, date: "05/01/2025", duration: 6.8, deepSleep: 1.5, lightSleep: 4.5, rem: 0.8, quality: 72 },
    { id: 3, date: "04/01/2025", duration: 8.1, deepSleep: 2.5, lightSleep: 4.6, rem: 1.0, quality: 90 },
    { id: 4, date: "03/01/2025", duration: 7.2, deepSleep: 1.8, lightSleep: 4.4, rem: 1.0, quality: 78 },
    { id: 5, date: "02/01/2025", duration: 6.5, deepSleep: 1.0, lightSleep: 4.0, rem: 1.5, quality: 65 },
    { id: 6, date: "01/01/2025", duration: 7.8, deepSleep: 2.2, lightSleep: 4.6, rem: 1.0, quality: 88 },
];

// Funções utilitárias
const formatTime = (time: Date) => time.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

const getQualityStyle = (quality: number) => {
  if (quality >= 80) return { color: "#4CAF50", text: "Excelente" };
  if (quality >= 70) return { color: "#FFB300", text: "Bom" };
  return { color: "#F44336", text: "Razoável" };
};

// ------------------------------------------------------------------
// LÓGICA DO COMPONENTE
// ------------------------------------------------------------------
export default function SonoScreen() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SleepRecord | null>(null);

  // Estados para os campos do Modal
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [deepSleep, setDeepSleep] = useState("");
  const [lightSleep, setLightSleep] = useState("");
  const [rem, setRem] = useState("");

  // ------------------------------------------------------------------
  // PERSISTÊNCIA
  // ------------------------------------------------------------------
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
        saveRecords(initialRecords);
      }
    } catch (e) {
      console.error('Erro ao carregar os registros de sono: ', e);
      setRecords(initialRecords);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // ------------------------------------------------------------------
  // CÁLCULOS (useMemo para otimização)
  // ------------------------------------------------------------------
  const calculations = useMemo(() => {
    // Ordena os registros por data para garantir que o "lastNight" seja o mais recente
    const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastNight = sortedRecords[0] || { duration: 0, quality: 0, deepSleep: 0, lightSleep: 0, rem: 0 };
    
    const validRecords = records.filter(r => r.duration > 0);
    const totalDuration = validRecords.reduce((sum, r) => sum + r.duration, 0);
    const totalQuality = validRecords.reduce((sum, r) => sum + r.quality, 0);
    
    const weeklyAverage = validRecords.length > 0 ? (totalDuration / validRecords.length) : 0;
    const averageQuality = validRecords.length > 0 ? (totalQuality / validRecords.length) : 0;
    
    // Simulação de Consistência (pode ser mais complexo na vida real)
    // Aqui, vamos apenas contar quantos estão acima de 70% de qualidade
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


  // ------------------------------------------------------------------
  // CRUD
  // ------------------------------------------------------------------

  function cleanForm() {
    setDate(new Date().toLocaleDateString("pt-BR"));
    setDuration("");
    setDeepSleep("");
    setLightSleep("");
    setRem("");
    setEditingRecord(null);
  }

  function handleOpenAddModal() {
    cleanForm();
    setModalVisible(true);
  }

  function handleOpenEditModal(record: SleepRecord) {
    setEditingRecord(record);
    // Preenche o formulário com os valores do registro
    setDate(record.date);
    setDuration(record.duration.toString());
    setDeepSleep(record.deepSleep.toString());
    setLightSleep(record.lightSleep.toString());
    setRem(record.rem.toString());
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    cleanForm();
  }

  function calculateQuality(total: number, deep: number, rem: number): number {
      // Regra de exemplo: 50% pela duração, 30% por sono profundo, 20% por REM (ajustado)
      const durationScore = Math.min(1, total / MAX_SLEEP_HOURS) * 50;
      const deepScore = Math.min(1, deep / (total * 0.2)) * 30; // 20% do total deveria ser profundo
      const remScore = Math.min(1, rem / (total * 0.15)) * 20; // 15% do total deveria ser REM

      return Math.round(Math.min(100, durationScore + deepScore + remScore));
  }
  
  function handleSubmit() {
    const total = parseFloat(duration);
    const deep = parseFloat(deepSleep);
    const light = parseFloat(lightSleep);
    const remF = parseFloat(rem);
    
    // Validação básica
    if (isNaN(total) || isNaN(deep) || isNaN(light) || isNaN(remF) || total <= 0) {
        Alert.alert("Erro de Entrada", "Por favor, insira valores numéricos válidos para o sono.");
        return;
    }
    
    // Recalcula a qualidade com base nos novos dados
    const newQuality = calculateQuality(total, deep, remF);
    
    // Cria o objeto do novo registro
    const newRecord: SleepRecord = {
        id: editingRecord ? editingRecord.id : Date.now(),
        date: date,
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
          onPress: () => {
            const newRecords = records.filter(r => r.id !== id);
            setRecords(newRecords);
            saveRecords(newRecords);
          },
          style: "destructive",
        },
      ]
    );
  }
  // ------------------------------------------------------------------
  // RENDERIZAÇÃO
  // ------------------------------------------------------------------

  const lastNight = calculations.lastNight;
  const lastNightQualityStyle = getQualityStyle(lastNight.quality);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análise do Sono</Text>
        <TouchableOpacity onPress={handleOpenAddModal}>
             <Ionicons name="add-circle" size={28} color="#9C27B0" />
        </TouchableOpacity>
      </View>

      {/* Noite Passada Card - AGORA COM DADOS REAIS/CALCULADOS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="moon" size={20} color="#9C27B0" />
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
            <Ionicons name="bed-outline" size={16} color="#9C27B0" />
            {/* Estes valores seriam simulados/inseridos manualmente já que não temos o tempo exato de dormir/acordar */}
            <Text style={styles.timeText}>Dormir: 23:15</Text>
          </View>
          <View style={styles.timeItem}>
            <Ionicons name="sunny-outline" size={16} color="#FFB300" />
            <Text style={styles.timeText}>Acordar: 06:45</Text>
          </View>
        </View>

        {/* Detalhes do Sono */}
        <View style={styles.sleepDetails}>
          {renderSleepDetail("Sono Profundo", lastNight.deepSleep, MAX_SLEEP_HOURS)}
          {renderSleepDetail("Sono Leve", lastNight.lightSleep, MAX_SLEEP_HOURS)}
          {renderSleepDetail("REM", lastNight.rem, MAX_SLEEP_HOURS)}
        </View>
        
        {/* Botão de Edição Rápida */}
        {lastNight.duration > 0 && (
            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleOpenEditModal(calculations.history[0])}
            >
                <Text style={styles.editButtonText}>Editar Registro de Hoje</Text>
            </TouchableOpacity>
        )}
      </View>

      {/* Resumo Semanal - AGORA COM CÁLCULOS DINÂMICOS */}
      <View style={styles.summaryGrid}>
        {renderSummaryItem("timer-outline", `${calculations.weeklyAverage}h`, "média semanal", "#007AFF")}
        {renderSummaryItem("stats-chart-outline", `${calculations.averageQuality}%`, "qualidade média", "#34C759")}
        {renderSummaryItem("moon-outline", `${calculations.consistency}%`, "consistência", "#9C27B0")}
      </View>

      {/* Histórico Semanal - AGORA DINÂMICO */}
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
                <Ionicons name="trash-outline" size={18} color="#e63946" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />


      {/* Modal de Adição/Edição */}
      <ModalForm
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingRecord ? "Editar Sono" : "Novo Registro de Sono"}
        submitLabel={editingRecord ? "Salvar Alterações" : "Adicionar"}
        fields={[
            { label: "Data", placeholder: "DD/MM/AAAA", value: date, onChangeText: setDate },
            { label: "Duração Total (horas)", placeholder: "Ex: 7.5", value: duration, onChangeText: setDuration, keyboardType: "numeric" },
            [
                { label: "Sono Profundo (h)", placeholder: "Ex: 2.1", value: deepSleep, onChangeText: setDeepSleep, keyboardType: "numeric" },
                { label: "Sono Leve (h)", placeholder: "Ex: 4.8", value: lightSleep, onChangeText: setLightSleep, keyboardType: "numeric" },
                { label: "REM (h)", placeholder: "Ex: 0.6", value: rem, onChangeText: setRem, keyboardType: "numeric" },
            ],
        ]}
      />
    </ScrollView>
  );
}

// ------------------------------------------------------------------
// COMPONENTES AUXILIARES
// ------------------------------------------------------------------

// Renderiza um item de detalhe do sono (Profundo, Leve, REM)
const renderSleepDetail = (label: string, hours: number, maxHours: number) => {
  const progress = hours / maxHours;
  let color = "#9C27B0"; // Cor padrão (roxa)
  if (label === "Sono Profundo") color = "#007AFF"; 
  if (label === "Sono Leve") color = "#34C759";
  
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

// Estilos específicos para os detalhes de sono
const detailStyles = StyleSheet.create({
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#333',
        width: 100, // Largura fixa para alinhamento
    },
    detailBarContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    detailHours: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        width: 40, // Largura fixa para alinhamento
        textAlign: 'right',
    }
});


// Renderiza o item de resumo semanal
const renderSummaryItem = (iconName: any, value: string, label: string, color: string) => (
  <View style={styles.summaryItem}>
    <Ionicons name={iconName} size={28} color={color} />
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    <Text style={styles.summaryLabelText}>{label}</Text>
  </View>
);

// Componente para a barra de progresso (simulação para ser mais fiel ao design)
const ProgressBar = ({ progress, color }: { progress: number; color: string }) => {
  const clampedProgress = Math.min(1, Math.max(0, progress)); // Garante que esteja entre 0 e 1
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

// ------------------------------------------------------------------
// ESTILOS
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  editButton: {
      marginTop: 15,
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#F4E9FF',
      alignItems: 'center',
  },
  editButtonText: {
      color: '#9C27B0',
      fontWeight: '600',
  },
  
  // Estilos de Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
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
    color: "#333",
  },
  sectionTitleWithMargin: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
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
  },
  mainLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  qualityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
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
    color: "#555",
  },

  // Detalhes do Sono (Barras de Progresso)
  sleepDetails: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
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
    marginHorizontal: -4, // Compensa a margem interna dos itens
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  summaryLabelText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Histórico Semanal
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
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
    borderBottomColor: '#eee'
  },
  historyDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
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
    color: "#555",
  },
  historyQuality: {
    fontSize: 15,
    fontWeight: "500",
  },
  historyLabel: {
    fontSize: 11,
    color: "#777",
  },
});