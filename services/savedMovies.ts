import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_MOVIES_KEY = '@saved_movies';

export interface SavedMovie extends Movie {
  savedAt: string;
}

export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    const savedMoviesJson = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    if (savedMoviesJson) {
      return JSON.parse(savedMoviesJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting saved movies:', error);
    return [];
  }
};

export const saveMovie = async (movie: Movie): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    const movieExists = savedMovies.some((m) => m.id === movie.id);
    
    if (!movieExists) {
      const savedMovie: SavedMovie = {
        ...movie,
        savedAt: new Date().toISOString(),
      };
      savedMovies.push(savedMovie);
      await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(savedMovies));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving movie:', error);
    return false;
  }
};

export const unsaveMovie = async (movieId: number): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    const filteredMovies = savedMovies.filter((m) => m.id !== movieId);
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(filteredMovies));
    return true;
  } catch (error) {
    console.error('Error unsaving movie:', error);
    return false;
  }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const savedMovies = await getSavedMovies();
    return savedMovies.some((m) => m.id === movieId);
  } catch (error) {
    console.error('Error checking if movie is saved:', error);
    return false;
  }
};

export const getSavedMoviesCount = async (): Promise<number> => {
  try {
    const savedMovies = await getSavedMovies();
    return savedMovies.length;
  } catch (error) {
    console.error('Error getting saved movies count:', error);
    return 0;
  }
};
