import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { fetchWeather, WeatherData } from '../services/WeatherService';

export default function HomeScreen() {
  const router = useRouter();

  // Estado para armazenar os dados do clima
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchWeather();
      setWeather(data);
    };
    
    loadWeather();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Olá!</Text>
        <Text style={styles.subtitle}>Como está se sentindo hoje?</Text>

        {/* CARD DE CLIMA */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherLeft}>
            <View style={styles.weatherIconBox}>
              <Ionicons 
                name={weather?.icon || 'time-outline'} 
                size={32} 
                color={Colors.white} 
              />
            </View>
          </View>

          <View style={styles.weatherRight}>
            <View style={styles.weatherTopRow}>
              <Text style={styles.weatherMain}>
                {weather ? weather.description : 'Carregando...'}
              </Text>
              {weather && ( // Só mostra detalhes se o clima foi carregado
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetailItem}>
                    <Ionicons name="water-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.weatherDetailText}> {weather.humidity}</Text>
                  </View>
                  <View style={styles.weatherDetailItem}>
                    <Ionicons name="arrow-forward-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.weatherDetailText}> {weather.wind}</Text>
                  </View>
                </View>
              )}
            </View>

            <Text style={styles.weatherTemp}>{weather ? weather.temp : '--'}</Text>
            <Text style={styles.weatherLocation}>{weather ? weather.location : '...'}</Text>
          </View>
        </View>

        {/* CARDS PRINCIPAIS */}
        <View style={styles.grid}>
          <TouchableOpacity style={[styles.card, { backgroundColor: Colors.brand.treinoBg }]} onPress={() => router.push("/sections/treino")}>
            <Ionicons name="barbell-outline" size={28} color={Colors.brand.treino} />
            <Text style={styles.cardText}>Treino</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: Colors.brand.nutricaoBg }]} onPress={() => router.push('/sections/nutricao')}>
            <Ionicons name="nutrition-outline" size={28} color={Colors.brand.nutricao} />
            <Text style={styles.cardText}>Nutrição</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: Colors.brand.sonoBg }]} onPress={() => router.push('/sections/sono')}>
            <Ionicons name="moon-outline" size={28} color={Colors.brand.sono} />
            <Text style={styles.cardText}>Sono</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: Colors.brand.qualidadeBg }]} onPress={() => router.push('/sections/qualidade')}>
            <Ionicons name="heart-outline" size={28} color={Colors.brand.qualidade} />
            <Text style={styles.cardText}>Qualidade</Text>
          </TouchableOpacity>
        </View>

        {/* CARD DE RESUMO */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumo de Hoje</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryData, { color: Colors.brand.treino }]}>45</Text>
              <Text style={styles.summaryLabel}>min ativos</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryData, { color: Colors.brand.nutricao }]}>1.2k</Text>
              <Text style={styles.summaryLabel}>calorias</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryData, { color: Colors.brand.sono }]}>7.5h</Text>
              <Text style={styles.summaryLabel}>sono</Text>
            </View>
          </View>
        </View>

        {/* CARD DE DICA */}
        <View style={[styles.tipBox, { backgroundColor: Colors.brand.alertaBg }]}>
          <Ionicons name="bulb-outline" size={24} color={Colors.brand.alerta} />
          <Text style={styles.tipText}>
            <Text style={[styles.tipTitle, { color: Colors.brand.alerta }]}>Dica Diária: </Text>
            Beba pelo menos 8 copos de água ao longo do dia para manter-se hidratado.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
    width: '100%',
    height: 150,
  },
  weatherLeft: {
    marginRight: 16,
  },
  weatherIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brand.alerta,
  },
  weatherRight: {
    flex: 1,
  },
  weatherTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  weatherTemp: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  weatherDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  weatherDetailText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  weatherLocation: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summary: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 10,
    elevation: 2,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: Colors.text,
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
    color: Colors.textSecondary,
    marginTop: 4,
  },
  tipBox: {
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tipTitle: {
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  }
});