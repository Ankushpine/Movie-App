import MovieCard from "@/Components/MovieCard";
import Searchbar from "@/Components/Searchbar";
import TendingCard from "@/Components/TendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  if (moviesLoading || trendingMoviesLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "#081828" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (moviesError || trendingMoviesError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>
          Error: {moviesError?.message || trendingMoviesError?.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: "#081828" }}>
      <Image source={images.bg} className="absolute w-full z-0" />

      <FlatList
        data={movies?.results}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: 20 }}
        columnWrapperStyle={{
          gap: 20,
          marginBottom: 15,
        }}
        renderItem={({ item }) => <MovieCard {...item} />}
        ListHeaderComponent={
          <>
            <Image
              source={icons.logo}
              className="w-12 h-10 mx-auto mt-20 mb-5"
            />

            <Searchbar
              placeholder="Search for movies or TV shows"
              onPress={() => router.push("/search")}
            />

            {trendingMovies && (
              <View className="mt-5">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>

                <FlatList
                  horizontal
                  data={trendingMovies}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 26 }}
                  renderItem={({ item, index }) => (
                    <TendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item, index) => `${item.movie_id}-${index}`}
                />

              </View>
            )}

            <Text className="text-lg text-white font-bold mt-1 mb-3">
              Latest Movies
            </Text>
          </>
        }
      />
    </View>
  );
}
