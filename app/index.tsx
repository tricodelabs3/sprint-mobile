import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView 
      contentContainerStyle={styles.contentContainer} // 👈 importante para centralizar
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Boa noite!</Text>
      <Text style={styles.subtitle}>Como está se sentindo hoje?</Text>

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

        <TouchableOpacity style={[styles.card, { backgroundColor: '#FFEAF0' }]} onPress={() => router.push('/sections/qualidade')}>
          <Ionicons name="heart-outline" size={28} color="#E91E63" />
          <Text style={styles.cardText}>Qualidade</Text>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center', // 👈 centraliza verticalmente
    alignItems: 'center', // 👈 centraliza horizontalmente
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 60,
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 6, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 20, 
    textAlign: 'center' 
  },

  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    width: '100%',
    marginTop: 10,
  },
  card: { 
    width: '48%', 
    borderRadius: 12, 
    padding: 20, 
    alignItems: 'center', 
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { 
    marginTop: 8, 
    fontSize: 16, 
    fontWeight: '600' 
  },

  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8A65',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '100%', // 👈 garante centralização
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

  summary: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    marginTop: 10,
    elevation: 2,
    width: '100%',
  },
  summaryTitle: { 
    fontWeight: 'bold', 
    marginBottom: 12, 
    fontSize: 16, 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingHorizontal: 10, 
  },
  summaryItem: { 
    alignItems: 'center',
  },
  summaryData: { 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  summaryLabel: { 
    fontSize: 12, 
    color: '#666',
    marginTop: 4, 
  },

  tipBox: { 
    marginTop: 20, 
    backgroundColor: '#FFF7E0', 
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tipTitle: { 
    fontWeight: 'bold', 
    color: '#FF9800' 
  },
  tipText: { 
    fontSize: 14, 
    color: '#444', 
    marginLeft: 12,
    flex: 1,
    lineHeight: 20, 
  }
});
