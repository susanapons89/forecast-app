import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { weatherService } from '../../services/weatherService';
import { RootState } from '../../store';
import { addRecentSearch, setCurrentLocation, setCurrentWeather } from '../../store/weatherSlice';

export default function SearchScreen() {
  const dispatch = useDispatch();
  const { recentSearches } = useSelector((state: RootState) => state.weather);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const results = await weatherService.searchLocation(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (location: any) => {
    try {
      setLoading(true);
      setError(null);

      dispatch(setCurrentLocation({
        lat: location.lat,
        lon: location.lon,
        name: location.name,
      }));

      const weather = await weatherService.getCurrentWeather(location.lat, location.lon);
      dispatch(setCurrentWeather(weather));
      dispatch(addRecentSearch(location.name));

      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      setError('Failed to get weather data');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleLocationSelect(item)}>
      <Text style={styles.resultName}>{item.name}</Text>
      <Text style={styles.resultCountry}>{item.country}</Text>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => setSearchQuery(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Enter city name"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => `${item.lat}-${item.lon}`}
          style={styles.resultsList}
        />
      ) : (
        recentSearches.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearch}
              keyExtractor={(item) => item}
              style={styles.recentList}
            />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCountry: {
    fontSize: 14,
    color: '#666',
  },
  recentContainer: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentList: {
    flex: 1,
  },
  recentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
}); 