import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ForecastData, WeatherData, WeatherState } from './types';

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  recentSearches: [],
  loading: false,
  error: null,
  currentLocation: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentWeather: (state, action: PayloadAction<WeatherData>) => {
      state.currentWeather = action.payload;
    },
    setForecast: (state, action: PayloadAction<ForecastData[]>) => {
      state.forecast = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches = [action.payload, ...state.recentSearches].slice(0, 5);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<{ lat: number; lon: number; name: string }>) => {
      state.currentLocation = action.payload;
    },
  },
});

export const {
  setCurrentWeather,
  setForecast,
  addRecentSearch,
  setLoading,
  setError,
  setCurrentLocation,
} = weatherSlice.actions;

export default weatherSlice.reducer; 