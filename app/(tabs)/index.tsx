import * as Location from 'expo-location';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { weatherService } from '../../services/weatherService';
import { RootState } from '../../store';
import { setCurrentLocation, setCurrentWeather, setError, setLoading } from '../../store/weatherSlice';

export default function CurrentWeatherScreen() {
  const dispatch = useDispatch();
  const { currentWeather, loading, error, currentLocation } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    const getLocation = async () => {
      try {
        dispatch(setLoading(true));
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          dispatch(setError('Location permission denied'));
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        // Get location name
        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        dispatch(setCurrentLocation({
          lat: latitude,
          lon: longitude,
          name: address?.city || 'Current Location',
        }));

        const weather = await weatherService.getCurrentWeather(latitude, longitude);
        dispatch(setCurrentWeather(weather));
      } catch (err) {
        dispatch(setError('Failed to get weather data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    getLocation();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!currentWeather) {
    return (
      <View style={styles.container}>
        <Text>No weather data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.location}>{currentLocation?.name}</Text>
      <Text style={styles.temperature}>{Math.round(currentWeather.temp)}°C</Text>
      <Text style={styles.description}>
        {currentWeather.weather[0].description}
      </Text>
      <View style={styles.details}>
        <Text>Feels like: {Math.round(currentWeather.feels_like)}°C</Text>
        <Text>Humidity: {currentWeather.humidity}%</Text>
        <Text>Wind: {currentWeather.wind_speed} m/s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  details: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    gap: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
