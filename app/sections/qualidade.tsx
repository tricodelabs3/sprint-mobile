import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// 1. Interface para os Tipos de Dicas
interface Tip {
  id: number;
  icon: keyof typeof Ionicons.glyphMap; // Corrigido para usar a chave correta
  title: string;
  description: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  time: string;
  category: "Mental" | "Física" | "Emocional";
  color: string; // Cor do card
  iconColor: string; // Cor do ícone
}

type TabName = "Todas" | "Mental" | "Física" | "Emocional";

// 2. Dados Mockados baseados nas imagens
const tipsData: Tip[] = [
  {
    id: 1,
    icon: "sparkles-outline", // 👈 CORRIGIDO: Ícone válido
    title: "Pratique Mindfulness",
    description:
      "Reserve 10 minutos diários para meditação. Isso pode reduzir o estresse e melhorar o foco.",
    difficulty: "Fácil",
    time: "10 min",
    category: "Mental",
    color: "#F4E9FF", // Roxo claro
    iconColor: "#9C27B0",
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
    color: "#EAF4FF", // Azul claro
    iconColor: "#4A90E2",
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
    color: "#FFEAF0", // Rosa claro
    iconColor: "#E91E63",
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
    color: "#FFF7E0", // Amarelo claro
    iconColor: "#FFB300",
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
    color: "#EAFBE7", // Verde claro
    iconColor: "#4CAF50",
  },
  {
    id: 6,
    icon: "happy-outline",
    title: "Conecte-se com Pessoas",
    description:
      "Mantenha contato regular com amigos e família. Relacionamentos saudáveis são essenciais.",
    difficulty: "Fácil",
    time: "Variável",
    category: "Emocional",
    color: "#FFF3E8", // Laranja claro
    iconColor: "#FF5722",
  },
];

const tabs: { name: TabName; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: "Todas", icon: "heart-circle-outline" },
  { name: "Mental", icon: "sparkles-outline" }, // 👈 CORRIGIDO: Ícone válido
  { name: "Física", icon: "barbell-outline" },
  { name: "Emocional", icon: "happy-outline" },
];

// 3. Componente da Barra de Progresso
const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
  </View>
);

// 4. Componente Principal
export default function QualidadeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabName>("Todas");

  // Filtra as dicas baseado na aba ativa
  const filteredTips = tipsData.filter((tip) => {
    if (activeTab === "Todas") return true;
    return tip.category === activeTab;
  });

  // ------------------------------------------------------------------
  // Funções de Renderização
  // ------------------------------------------------------------------

  // Renderiza um card de dica
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
    <View style={[styles.challengeCard, { backgroundColor: "#EAF4FF" }]}>
      <View style={styles.tipHeader}>
        <Ionicons name="trophy-outline" size={24} color="#4A90E2" />
        <Text style={[styles.tipTitle, { color: "#4A90E2" }]}>
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
      <ProgressBar progress={3 / 7} />
    </View>
  );

  // ------------------------------------------------------------------
  // JSX Principal
  // ------------------------------------------------------------------
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Qualidade de Vida</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Card de Índice de Bem-estar */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Seu Índice de Bem-estar</Text>
        <Text style={styles.summaryScore}>78</Text>
        <Text style={styles.summaryScoreLabel}>pontuação geral</Text>
        <View style={styles.summarySubRow}>
          <View style={styles.summarySubItem}>
            <Text style={[styles.summarySubScore, { color: "#4A90E2" }]}>
              82
            </Text>
            <Text style={styles.summarySubLabel}>Mental</Text>
          </View>
          <View style={styles.summarySubItem}>
            <Text style={[styles.summarySubScore, { color: "#4CAF50" }]}>
              75
            </Text>
            <Text style={styles.summarySubLabel}>Física</Text>
          </View>
          <View style={styles.summarySubItem}>
            <Text style={[styles.summarySubScore, { color: "#E91E63" }]}>
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
              color={activeTab === tab.name ? "#fff" : "#555"}
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
  );
}

// 5. Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  // Card de Resumo
  summaryCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  summaryScore: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  summaryScoreLabel: {
    fontSize: 14,
    color: "#666",
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
    color: "#666",
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
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: "#333",
  },
  tabText: {
    marginLeft: 6,
    fontWeight: "600",
    color: "#555",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#fff",
  },
  // Dicas
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // Para as tags quebrarem a linha se necessário
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1, // Faz o título ocupar o espaço, empurrando as tags
    minWidth: 100, // Garante que o título tenha espaço antes de quebrar
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
    marginTop: 4, // Permite que a tag quebre a linha em telas menores
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  tipDescription: {
    fontSize: 14,
    color: "#555",
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
    color: "#333",
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
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
    backgroundColor: "#4A90E2", // Cor do progresso
    borderRadius: 4,
  },
});