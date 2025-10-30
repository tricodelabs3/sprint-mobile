import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'; // 👈 Adicionado ScrollView
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    // 👈 Alterado de View para ScrollView para caber o novo card
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Mantido o seu título original, mas a imagem nova diz "Boa noite, João!"
        Vou manter o seu original "Boa noite!" por enquanto.
      */}
      <Text style={styles.title}>Boa noite!</Text>
      <Text style={styles.subtitle}>Como está se sentindo hoje?</Text>

      {/* NOVO: Card de Clima (baseado na imagem) */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherIconContainer}>
          <Ionicons name="partly-sunny-outline" size={28} color="#fff" />
        </View>
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherMain}>Entardecer</Text>
          <Text style={styles.weatherTemp}>25°C</Text>
          <Text style={styles.weatherLocation}>São Paulo, Brasil</Text>
        </View>
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetailItem}>
            <Ionicons name="water-outline" size={16} color="#fff" />
            <Text style={styles.weatherDetailText}> 65%</Text>
          </View>
          <View style={styles.weatherDetailItem}>
            <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
            <Text style={styles.weatherDetailText}> 12 km/h</Text>
          </View>
        </View>
      </View>

      {/* SEU GRID ORIGINAL (MANTIDO) */}
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#EAF4FF' }]} onPress={() => router.push("/sections/treino")}>
          <Ionicons name="barbell-outline" size={28} color="#4A90E2" />
          <Text style={styles.cardText}>Treino</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#EAFBE7' }]} onPress={() => router.push('/sections/nutricao')}>
          <Ionicons name="nutrition-outline" size={28} color="#4CAF50" />
          <Text style={styles.cardText}>Nutrição</Text>
        </TouchableOpacity>

        
        <TouchableOpacity style={[styles.card, { backgroundColor: '#F4E9FF' }]} onPress={() => router.push('/sections/sono')}>
          <Ionicons name="moon-outline" size={28} color="#9C27B0" />
          <Text style={styles.cardText}>Sono</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFEAF0' }]} onPress={() => router.push('/qualidade')}>
          <Ionicons name="heart-outline" size={28} color="#E91E63" />
          <Text style={styles.cardText}>Qualidade</Text>
        </TouchableOpacity>
      </View>

      {/* ATUALIZADO: Resumo de Hoje (com sono, baseado na nova imagem) */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumo de Hoje</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryData, { color: '#4A90E2' }]}>45</Text>
            <Text style={styles.summaryLabel}>min ativos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryData, { color: '#4CAF50' }]}>1.2k</Text>
            <Text style={styles.summaryLabel}>calorias</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryData, { color: '#9C27B0' }]}>7.5h</Text>
            <Text style={styles.summaryLabel}>sono</Text>
          </View>
        </View>
      </View>

      {/* ATUALIZADO: Dica Diária (baseado na nova imagem) */}
      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={24} color="#FFB300" />
        <Text style={styles.tipText}>
          <Text style={styles.tipTitle}>Dica Diária: </Text>
          Beba pelo menos 8 copos de água ao longo do dia para manter-se hidratado.
        </Text>
      </View>
    </ScrollView>
  );
}

// ESTILOS ATUALIZADOS (Originais + Novos)
const styles = StyleSheet.create({
  // Seus estilos originais
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20,
    paddingBottom: 40, // Espaço extra para scroll
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '48%', 
    borderRadius: 12, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    // Sombra sutil adicionada (baseada na nova imagem)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { marginTop: 8, fontSize: 16, fontWeight: '600' },

  // NOVO: Estilos do Card de Clima
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8A65', // Cor placeholder (laranja/rosa)
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  weatherIconContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  weatherInfo: {
    flex: 1,
    marginLeft: 12,
  },
  weatherMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherLocation: {
    fontSize: 12,
    color: '#fff',
  },
  weatherDetails: {
    alignItems: 'flex-end',
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetailText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Estilos de Resumo (Atualizados da sua versão original)
  summary: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    marginTop: 10,
    elevation: 2, // Adicionado para consistência
  },
  summaryTitle: { 
    fontWeight: 'bold', 
    marginBottom: 12, // Mais espaço
    fontSize: 16, // Aumentado
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', // Trocado para 'space-between'
    paddingHorizontal: 10, // Adicionado padding
  },
  summaryItem: { // NOVO: container para cada item do resumo
    alignItems: 'center',
  },
  summaryData: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    // marginRight removido para 'summaryItem' controlar
  },
  summaryLabel: { 
    fontSize: 12, 
    color: '#666',
    marginTop: 4, // Adicionado
  },

  // Estilos da Dica (Atualizados)
  tipBox: { 
    marginTop: 20, 
    backgroundColor: '#FFF7E0', 
    borderRadius: 16, // Arredondado
    padding: 16, // Mais padding
    flexDirection: 'row', // Adicionado
    alignItems: 'center', // Adicionado
  },
  tipTitle: { 
    fontWeight: 'bold', 
    color: '#FF9800' 
  },
  tipText: { 
    fontSize: 14, 
    color: '#444', 
    marginLeft: 12, // Adicionado
    flex: 1, // Adicionado
    lineHeight: 20, // Adicionado
  }
});