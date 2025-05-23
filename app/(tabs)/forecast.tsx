import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { weatherService } from '../../services/weatherService';
import { RootState } from '../../store';
import { setError, setForecast, setLoading } from '../../store/weatherSlice';

const ForecastScreen = () => {
  const dispatch = useDispatch();
  const { forecast, loading, error, currentLocation } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    const getForecast = async () => {
      if (!currentLocation) return;

      try {
        dispatch(setLoading(true));
        const forecastData = await weatherService.getForecast(
          currentLocation.lat,
          currentLocation.lon
        );
        dispatch(setForecast(forecastData));
      } catch (err) {
        dispatch(setError('Failed to get forecast data'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    getForecast();
  }, [dispatch, currentLocation]);

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

  if (!forecast.length) {
    return (
      <View style={styles.container}>
        <Text>No forecast data available</Text>
      </View>
    );
  }

  const renderForecastItem = ({ item }: { item: any }) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    return (
      <View style={styles.forecastItem}>
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.temperature}>
          {Math.round(item.temp.max)}° / {Math.round(item.temp.min)}°
        </Text>
        <Text style={styles.description}>
          {item.weather[0].description}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <FlatList
        data={forecast}
        renderItem={renderForecastItem}
        keyExtractor={(item) => item.dt.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    gap: 10,
  },
  forecastItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 60,
  },
  temperature: {
    fontSize: 16,
    width: 100,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default ForecastScreen; 