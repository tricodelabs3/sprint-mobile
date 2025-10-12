import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NutricionScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Nutrição</Text>
        
        {/* Botão de adicionar refeição (Futuro) */}
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Resumo */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumo de Hoje</Text>
        <View style={styles.row}>
          <View style={styles.summaryItem}>
            <Ionicons name="nutrition-outline" size={22} color="#4CAF50" />
            <Text style={styles.value}>1100</Text>
            <Text style={styles.label}>calorias consumidas</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="water-outline" size={22} color="#2196F3" />
            <Text style={styles.value}>65g</Text>
            <Text style={styles.label}>proteína</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.metaText}>Meta diária</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '55%' }]} />
          </View>
          <Text style={styles.metaDetail}>1100 / 2000 cal</Text>
        </View>
      </View>

      {/* Refeições */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Refeições de Hoje</Text>

      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>Café da Manhã</Text>
          <Text style={styles.mealTime}>08:00</Text>
        </View>

        <View style={styles.macros}>
          <Text style={styles.macro}>420 cal</Text>
          <Text style={styles.macro}>25g prot</Text>
          <Text style={styles.macro}>45g carbs</Text>
          <Text style={styles.macro}>12g gord</Text>
        </View>

        <View style={styles.mealActions}>
          <Pressable>
            <Ionicons name="create-outline" size={18} color="#444" />
          </Pressable>
          <Pressable>
            <Ionicons name="trash-outline" size={18} color="#E91E63" />
          </Pressable>
        </View>
      </View>

      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>Almoço</Text>
          <Text style={styles.mealTime}>12:30</Text>
        </View>

        <View style={styles.macros}>
          <Text style={styles.macro}>680 cal</Text>
          <Text style={styles.macro}>40g prot</Text>
          <Text style={styles.macro}>65g carbs</Text>
          <Text style={styles.macro}>22g gord</Text>
        </View>

        <View style={styles.mealActions}>
          <Pressable>
            <Ionicons name="create-outline" size={18} color="#444" />
          </Pressable>
          <Pressable>
            <Ionicons name="trash-outline" size={18} color="#E91E63" />
          </Pressable>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
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
