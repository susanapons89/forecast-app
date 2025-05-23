export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface ForecastData {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData[];
  recentSearches: string[];
  loading: boolean;
  error: string | null;
  currentLocation: {
    lat: number;
    lon: number;
    name: string;
  } | null;
} 