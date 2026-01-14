import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import { isMovieSaved, saveMovie, unsaveMovie } from '@/services/savedMovies';
import useFetch from '@/services/useFetch';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const MovieDeatails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string))
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      if (movie?.id) {
        const isSaved = await isMovieSaved(movie.id);
        setSaved(isSaved);
      }
    };
    checkSaved();
  }, [movie?.id]);

  const handleSaveToggle = async () => {
    if (!movie || saving) return;

    setSaving(true);
    try {
      if (saved) {
        await unsaveMovie(movie.id);
        setSaved(false);
      } else {
        await saveMovie({
          id: movie.id,
          title: movie.title,
          adult: movie.adult,
          backdrop_path: movie.backdrop_path || '',
          genre_ids: movie.genres?.map(g => g.id) || [],
          original_language: movie.original_language,
          original_title: movie.original_title,
          overview: movie.overview || '',
          popularity: movie.popularity,
          poster_path: movie.poster_path || '',
          release_date: movie.release_date,
          video: movie.video,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
        });
        setSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setSaving(false);
    }
  };

  const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );

  return (
    <View className='flex-1' style={{ backgroundColor: '#081828' }} >
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
          }}
          className="w-full h-[550px]"
          resizeMode="stretch"
        />
        <View className='flex-col items-start justify-center mt-5 px-5' >
          <Text className='text-white font-bold text-xl' >{movie?.title}</Text>
          <View className='flex-row items-center gap-x-1 mt-2' >
            <Text className='text-light-200 text-sm' >{movie?.release_date?.split('-')?.[0]}</Text>
            <Text className='text-light-200 text-sm' >{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>
      <View className="absolute bottom-5 left-0 right-0 mx-5 flex flex-row gap-3 z-50">
        <TouchableOpacity
          className={`flex-1 rounded-lg py-3.5 flex flex-row items-center justify-center ${saved ? "bg-red-500" : "bg-violet-500"
            }`}
          onPress={handleSaveToggle}
          disabled={saving || !movie}
        >
          <Image
            source={icons.save}
            className="size-5 mr-2"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">
            {saving ? "..." : saved ? "Remove" : "Save"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-violet-500 rounded-lg py-3.5 flex flex-row items-center justify-center"
          onPress={router.back}
        >
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Back</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default MovieDeatails