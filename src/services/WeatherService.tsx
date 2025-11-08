import { Ionicons } from "@expo/vector-icons";

const API_KEY = '0f9e04d27069c5dafbc255ad81086a2e';
const LAT = '-23.5505'; // Coordenadas de São Paulo
const LON = '-46.6333';
const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=pt_br`;

// Mapeia ícones da API para ícones do Ionicons
const iconMap: { [key: string]: string } = {
  '01d': 'sunny-outline',
  '01n': 'moon-outline',
  '02d': 'partly-sunny-outline',
  '02n': 'cloudy-night-outline',
  '03d': 'cloudy-outline',
  '03n': 'cloudy-outline',
  '04d': 'cloudy-outline',
  '04n': 'cloudy-outline',
  '09d': 'rainy-outline',
  '09n': 'rainy-outline',
  '10d': 'rainy-outline',
  '10n': 'rainy-outline',
  '11d': 'thunderstorm-outline',
  '11n': 'thunderstorm-outline',
  '13d': 'snow-outline',
  '13n': 'snow-outline',
  '50d': 'menu-outline', // Mist/Fog
  '50n': 'menu-outline',
};

export interface WeatherData {
  temp: string;
  location: string;
  description: string;
  humidity: string;
  wind: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const fetchWeather = async (): Promise<WeatherData | null> => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error('Falha ao buscar dados do clima');
    }
    const data = await response.json();
    
    const description = data.weather[0].description;
    const capitalizedDesc = description.charAt(0).toUpperCase() + description.slice(1);

    return {
      temp: `${Math.round(data.main.temp)}°C`,
      location: `${data.name}, ${data.sys.country}`,
      description: capitalizedDesc,
      humidity: `${data.main.humidity}%`,
      wind: `${Math.round(data.wind.speed * 3.6)} km/h`, // m/s para km/h
      icon: (iconMap[data.weather[0].icon] || 'sunny-outline') as keyof typeof Ionicons.glyphMap,
    };
  } catch (error) {
    console.error("Erro no WeatherService:", error);
    return null; // Retorna nulo em caso de erro
  }
};