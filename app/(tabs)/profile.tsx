import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { getSavedMoviesCount } from '@/services/savedMovies';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: any;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <View className="bg-dark-200 rounded-xl p-4 flex-1 items-center">
    <Image source={icon} className="size-6 mb-2" tintColor="#AB8BFF" />
    <Text className="text-white font-bold text-2xl mb-1">{value}</Text>
    <Text className="text-gray-400 text-xs text-center">{label}</Text>
  </View>
);

const profile = () => {
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          setLoading(true);
          const count = await getSavedMoviesCount();
          setSavedCount(count);
        } catch (error) {
          console.error('Error loading stats:', error);
        } finally {
          setLoading(false);
        }
      };
      loadStats();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#081828' }}>
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 105 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-5">
          {/* Header */}
          <View className="items-center mb-8 mt-5">
            <View className="bg-violet-500 rounded-full p-4 mb-4">
              <Image source={icons.person} className="size-12" tintColor="#fff" />
            </View>
            <Text className="text-white font-bold text-2xl mb-2">Movie Lover</Text>
            <Text className="text-gray-400 text-sm">Your Personal Movie Collection</Text>
          </View>

          {/* Stats Section */}
          <View className="mb-6">
            <Text className="text-white font-bold text-lg mb-4">Your Stats</Text>
            <View className="flex-row gap-3">
              <StatCard
                label="Saved Movies"
                value={loading ? '...' : savedCount}
                icon={icons.save}
              />
              <StatCard
                label="Collections"
                value={savedCount > 0 ? Math.ceil(savedCount / 10) : 0}
                icon={icons.star}
              />
            </View>
          </View>

          {/* App Info Section */}
          <View className="bg-dark-200 rounded-xl p-5 mb-6">
            <Text className="text-white font-bold text-lg mb-4">About</Text>
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-1">App Version</Text>
              <Text className="text-white font-semibold">1.0.0</Text>
            </View>
            <View className="mb-4">
              <Text className="text-gray-400 text-sm mb-1">Data Source</Text>
              <Text className="text-white font-semibold">The Movie Database (TMDB)</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-sm mb-1">Powered By</Text>
              <Text className="text-white font-semibold">React Native & Expo</Text>
            </View>
          </View>

          {/* Features Section */}
          <View className="bg-dark-200 rounded-xl p-5">
            <Text className="text-white font-bold text-lg mb-4">Features</Text>
            <View className="gap-3">
              <View className="flex-row items-center gap-3">
                <View className="bg-violet-500/20 rounded-full p-2">
                  <Image source={icons.search} className="size-4" tintColor="#AB8BFF" />
                </View>
                <Text className="text-white flex-1">Search & Discover Movies</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="bg-violet-500/20 rounded-full p-2">
                  <Image source={icons.save} className="size-4" tintColor="#AB8BFF" />
                </View>
                <Text className="text-white flex-1">Save Your Favorites</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="bg-violet-500/20 rounded-full p-2">
                  <Image source={icons.star} className="size-4" tintColor="#AB8BFF" />
                </View>
                <Text className="text-white flex-1">View Trending Movies</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="bg-violet-500/20 rounded-full p-2">
                  <Image source={icons.play} className="size-4" tintColor="#AB8BFF" />
                </View>
                <Text className="text-white flex-1">Detailed Movie Information</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center mt-8">
            <Image source={icons.logo} className="w-16 h-14 mb-2" />
            <Text className="text-gray-500 text-xs">Made with ❤️ for movie enthusiasts</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;