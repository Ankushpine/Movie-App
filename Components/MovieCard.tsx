import { icons } from '@/constants/icons'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const MovieCard = (
    { id,
        title,
        adult,
        backdrop_path,
        genre_ids,
        original_language,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        video,
        vote_average,
        vote_count }: Movie) => {
    
    const getImageUri = () => {
        if (!poster_path || poster_path.trim() === '') {
            return "https://placehold.co/600x400/1a1a1a/FFFFFF.png";
        }
        if (poster_path.startsWith('http')) {
            return poster_path;
        }
        // Ensure poster_path starts with / for relative paths
        const path = poster_path.startsWith('/') ? poster_path : `/${poster_path}`;
        return `https://image.tmdb.org/t/p/w500${path}`;
    };

    return (
        <Link href={`/Movies/${id}`} asChild >
            <TouchableOpacity className='w-[30%]' >
                <Image
                    source={{ uri: getImageUri() }}
                    className="w-full h-52 rounded-lg"
                    resizeMode="cover"
                    onError={(error) => {
                        console.log('Image load error for movie:', id, 'poster_path:', poster_path, error);
                    }}
                />
                <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>{title}</Text>

                <View className='flex-row items-centre justify-start gap-x-1' >
                    <Image source={icons.star} className='size-4' />
                    <Text className='text-xs text-white font-bold' >{Math.round(vote_average / 2)}</Text>
                </View>

                <View className='flex-row items-centre justify-between' >
                    <Text className='text-xs text-light-100 font-bold mt-1 ' >
                        {release_date && release_date.includes("-") ? release_date.split("-")[0] : release_date || "N/A"}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default MovieCard

