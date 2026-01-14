import MovieCard from '@/Components/MovieCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { getSavedMovies, SavedMovie, unsaveMovie } from '@/services/savedMovies';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const saved = () => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSavedMovies = useCallback(async () => {
    try {
      const movies = await getSavedMovies();
      setSavedMovies(movies);
    } catch (error) {
      console.error('Error loading saved movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, [loadSavedMovies])
  );

  const handleUnsave = async (movieId: number) => {
    try {
      await unsaveMovie(movieId);
      setSavedMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (error) {
      console.error('Error unsaving movie:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSavedMovies();
  }, [loadSavedMovies]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#081828' }}>
      <Image source={images.bg} className="absolute w-full z-0" />
      <View className="flex-1">
        <View className="flex-row items-center justify-between mt-5 mb-5 px-5">
          <View className="flex-row items-center gap-2">
            <Image source={icons.save} className="size-6" tintColor="#AB8BFF" />
            <Text className="text-white font-bold text-xl">Saved Movies</Text>
          </View>
          {savedMovies.length > 0 && (
            <Text className="text-gray-400 text-sm">
              {savedMovies.length} {savedMovies.length === 1 ? 'movie' : 'movies'}
            </Text>
          )}
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#AB8BFF" />
            <Text className="text-gray-500 mt-4">Loading saved movies...</Text>
          </View>
        ) : savedMovies.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Image source={icons.save} className="size-20 mb-5" tintColor="#4B5563" />
            <Text className="text-gray-500 text-lg font-semibold mb-2">
              No Saved Movies
            </Text>
            <Text className="text-gray-600 text-sm text-center px-10">
              Movies you save will appear here. Start exploring and save your favorites!
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => (
              <MovieCard {...item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              gap: 20,
              paddingHorizontal: 17,
              marginBottom: 10,

            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#AB8BFF"
              />
            }
            contentContainerStyle={{
              paddingBottom: 80,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default saved;