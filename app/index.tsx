import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boa noite, João!</Text>
      <Text style={styles.subtitle}>Como está se sentindo hoje?</Text>

      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#EAF4FF' }]} onPress={() => router.push("treino")}>
          <Ionicons name="barbell-outline" size={28} color="#4A90E2" />
          <Text style={styles.cardText}>Treino</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#EAFBE7' }]} onPress={() => router.push('/nutricao')}>
          <Ionicons name="nutrition-outline" size={28} color="#4CAF50" />
          <Text style={styles.cardText}>Nutrição</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#F4E9FF' }]} onPress={() => router.push('/sono')}>
          <Ionicons name="moon-outline" size={28} color="#9C27B0" />
          <Text style={styles.cardText}>Sono</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFEAF0' }]} onPress={() => router.push('/qualidade')}>
          <Ionicons name="heart-outline" size={28} color="#E91E63" />
          <Text style={styles.cardText}>Qualidade</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumo de Hoje</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryData, { color: '#4A90E2' }]}>45</Text>
          <Text style={styles.summaryLabel}>min ativos</Text>
          <Text style={[styles.summaryData, { color: '#4CAF50' }]}>1.2k</Text>
          <Text style={styles.summaryLabel}>calorias</Text>
          <Text style={[styles.summaryData, { color: '#9C27B0' }]}>7.5h</Text>
          <Text style={styles.summaryLabel}>sono</Text>
        </View>
      </View>

      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={20} color="#FFB300" />
        <Text style={styles.tipTitle}> Dica Diária</Text>
        <Text style={styles.tipText}>Faça alongamentos matinais para despertar o corpo e mente.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 15 },
  cardText: { marginTop: 8, fontSize: 16, fontWeight: '600' },
  summary: { backgroundColor: '#fff', borderRadius: 12, padding: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, marginTop: 10 },
  summaryTitle: { fontWeight: 'bold', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryData: { fontSize: 18, fontWeight: 'bold', marginRight: 4 },
  summaryLabel: { fontSize: 12, color: '#666' },
  tipBox: { marginTop: 20, backgroundColor: '#FFF7E0', borderRadius: 10, padding: 10 },
  tipTitle: { fontWeight: 'bold', color: '#FF9800' },
  tipText: { fontSize: 14, color: '#444', marginTop: 5 }
});
