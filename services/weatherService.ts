import axios from 'axios';
import { ForecastData, WeatherData } from '../store/types';

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch current weather');
    }
  },

  async getForecast(lat: number, lon: number): Promise<ForecastData[]> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast/daily`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          cnt: 5,
        },
      });
      return response.data.list;
    } catch (error) {
      throw new Error('Failed to fetch forecast');
    }
  },

  async searchLocation(query: string) {
    try {
      const response = await axios.get(`${BASE_URL}/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search location');
    }
  },
}; 