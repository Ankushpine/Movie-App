import MovieCard from '@/Components/MovieCard';
import Searchbar from '@/Components/Searchbar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { updateSearchCount } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

const search = () => {

  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
    reset
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {

    const timeOutSearch = setTimeout(
      async () => {
        if (searchQuery.trim()) {
          await refetch()
        } else {
          reset()
        }
      }, 500)
    return () => clearTimeout(timeOutSearch)

  }, [searchQuery])

  useEffect(() => {
    if (movies?.results?.[0]) {
      updateSearchCount(searchQuery, movies?.results?.[0])
    }
  }, [movies?.results])


  return (
    <View className='flex-1' style={{ backgroundColor: '#081828' }} >

      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />

      <FlatList
        data={movies?.results}
        renderItem={({ item }) => (
          <MovieCard {...item} />
        )}
        keyExtractor={(items) => items?.id}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingHorizontal: 17,
          marginBottom: 10
        }}
        contentContainerStyle={{
          paddingBottom: 90,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center items-center mt-20 ">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className='my-5'>
              <Searchbar placeholder={"Search for movies or TV shows"} value={searchQuery} onChangeText={(text: string) => setSearchQuery(text)} />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size={"large"}
                color={"#0000ff"}
                className="mt-10 self-center"
              />
            )}

            {moviesError && <Text>Error :{moviesError?.message}</Text>}

            {!moviesLoading && !moviesError && searchQuery.trim() && movies?.results.length > 1 &&
              <Text className='text-xl px-2 text-white font-bold mb-2' >
                Search results for{" "}
                <Text className='text-violet-500' >{searchQuery}</Text>
              </Text>
            }

          </>
        }

        ListEmptyComponent={
          !moviesLoading && !moviesError ?
            (
              <View className='mt-10 px-5' >
                <Text className='text-center text-gray-500' >{searchQuery.trim() ? "No movies found!" : "Search for a movie.."} </Text>
              </View>

            ) :
            null
        }
      />

    </View>
  )
}

export default search