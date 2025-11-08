import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router"; 
import { Colors } from "../../constants/Colors";

interface Tip {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  time: string;
  category: "Mental" | "Física" | "Emocional";
  color: string; 
  iconColor: string; 
}

type TabName = "Todas" | "Mental" | "Física" | "Emocional";

const tipsData: Tip[] = [
  {
    id: 1,
    icon: "sparkles-outline",
    title: "Pratique Mindfulness",
    description:
      "Reserve 10 minutos diários para meditação. Isso pode reduzir o estresse e melhorar o foco.",
    difficulty: "Fácil",
    time: "10 min",
    category: "Mental",
    color: Colors.brand.sonoBg, 
    iconColor: Colors.brand.sono,
  },
  {
    id: 2,
    icon: "water-outline",
    title: "Hidrate-se Adequadamente",
    description:
      "Beba pelo menos 2 litros de água por dia. Mantenha uma garrafa sempre por perto.",
    difficulty: "Fácil",
    time: "Todo dia",
    category: "Física",
    color: Colors.brand.treinoBg, 
    iconColor: Colors.brand.treino,
  },
  {
    id: 3,
    icon: "heart-outline",
    title: "Pratique Gratidão",
    description:
      "Anote 3 coisas pelas quais você é grato todos os dias. Isso melhora o humor e bem-estar.",
    difficulty: "Fácil",
    time: "5 min",
    category: "Mental",
    color: Colors.brand.qualidadeBg, 
    iconColor: Colors.brand.qualidade,
  },
  {
    id: 4,
    icon: "sunny-outline",
    title: "Caminhe ao Sol",
    description:
      "Exposição solar matinal por 15-20 minutos ajuda na produção de vitamina D e regula o sono.",
    difficulty: "Fácil",
    time: "20 min",
    category: "Física",
    color: Colors.brand.alertaBg, 
    iconColor: Colors.brand.alerta,
  },
  {
    id: 5,
    icon: "leaf-outline",
    title: "Organize seu Ambiente",
    description:
      "Um espaço organizado contribui para uma mente mais clara e produtiva.",
    difficulty: "Médio",
    time: "30 min",
    category: "Mental",
    color: Colors.brand.nutricaoBg, 
    iconColor: Colors.brand.nutricao,
  },
];

const tabs: { name: TabName; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: "Todas", icon: "heart-circle-outline" },
  { name: "Mental", icon: "sparkles-outline" },
  { name: "Física", icon: "barbell-outline" },
  { name: "Emocional", icon: "happy-outline" },
];

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
  </View>
);

export default function QualidadeScreen() {
  const [activeTab, setActiveTab] = useState<TabName>("Todas");

  // Filtra as dicas baseado na aba ativa
  const filteredTips = tipsData.filter((tip) => {
    if (activeTab === "Todas") return true;
    return tip.category === activeTab;
  });

  const renderTipCard = (tip: Tip) => (
    <View
      key={tip.id}
      style={[styles.tipCard, { backgroundColor: tip.color }]}
    >
      <View style={styles.tipHeader}>
        <Ionicons name={tip.icon} size={24} color={tip.iconColor} />
        <Text style={[styles.tipTitle, { color: tip.iconColor }]}>
          {tip.title}
        </Text>
        <View style={styles.tagContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tip.difficulty}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tip.time}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.tipDescription}>{tip.description}</Text>
    </View>
  );

  // Renderiza o card de desafio
  const renderChallengeCard = () => (
    <View style={[styles.challengeCard, { backgroundColor: Colors.brand.treinoBg }]}>
      <View style={styles.tipHeader}>
        <Ionicons name="trophy-outline" size={24} color={Colors.brand.treino} />
        <Text style={[styles.tipTitle, { color: Colors.brand.treino }]}>
          Desafio da Semana
        </Text>
      </View>
      <Text style={styles.challengeTitle}>
        Pratique 5 minutos de respiração profunda
      </Text>
      <Text style={styles.tipDescription}>
        Todos os dias desta semana, reserve 5 minutos para exercícios de
        respiração. Isso pode reduzir significativamente o estresse e ansiedade.
      </Text>
      <Text style={styles.progressLabel}>Progresso: 3/7 dias</Text>
      <ProgressBar progress={3 / 7} color={Colors.brand.treino} />
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Qualidade de Vida",
          headerShown: true, 
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false, 
        }} 
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        
        {/* Card de Índice de Bem-estar */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Seu Índice de Bem-estar</Text>
          <Text style={styles.summaryScore}>78</Text>
          <Text style={styles.summaryScoreLabel}>pontuação geral</Text>
          <View style={styles.summarySubRow}>
            <View style={styles.summarySubItem}>
              <Text style={[styles.summarySubScore, { color: Colors.brand.treino }]}>
                82
              </Text>
              <Text style={styles.summarySubLabel}>Mental</Text>
            </View>
            <View style={styles.summarySubItem}>
              <Text style={[styles.summarySubScore, { color: Colors.brand.nutricao }]}>
                75
              </Text>
              <Text style={styles.summarySubLabel}>Física</Text>
            </View>
            <View style={styles.summarySubItem}>
              <Text style={[styles.summarySubScore, { color: Colors.brand.qualidade }]}>
                80
              </Text>
              <Text style={styles.summarySubLabel}>Emocional</Text>
            </View>
          </View>
        </View>

        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tabButton,
                activeTab === tab.name && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab.name)}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={activeTab === tab.name ? Colors.white : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.name && styles.tabTextActive,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Título da Seção */}
        <Text style={styles.sectionTitle}>Dicas Personalizadas</Text>

        {/* Lista de Dicas */}
        {filteredTips.map(renderTipCard)}

        {/* Card de Desafio (só aparece na aba "Todas") */}
        {activeTab === "Todas" && renderChallengeCard()}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
  },
  // Card de Resumo
  summaryCard: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginVertical: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  summaryScore: {
    fontSize: 64,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 4,
  },
  summaryScoreLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: -8,
  },
  summarySubRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  summarySubItem: {
    alignItems: "center",
  },
  summarySubScore: {
    fontSize: 24,
    fontWeight: "bold",
  },
  summarySubLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  // Abas de Filtro
  tabContainer: {
    marginVertical: 10,
    maxHeight: 40,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: Colors.text,
  },
  tabText: {
    marginLeft: 6,
    fontWeight: "600",
    color: Colors.textSecondary,
    fontSize: 14,
  },
  tabTextActive: {
    color: Colors.white,
  },
  // Dicas
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    color: Colors.text,
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", 
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1, 
    minWidth: 100, 
  },
  tagContainer: {
    flexDirection: "row",
  },
  tag: {
    backgroundColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 6,
    marginTop: 4, 
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  tipDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  // Card de Desafio
  challengeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: Colors.text,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});