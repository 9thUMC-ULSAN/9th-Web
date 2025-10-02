import { useEffect, useState } from "react";
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from "../components/MovieCard";

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);


    useEffect(() : void => {
        const fetchMovies = async () : Promise<void> => {
            const {data} = await axios.get<MovieResponse>(
            'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc',
            {
                headers: {
                    Authorization : `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                }
            );
            setMovies(data.results)
        };
        fetchMovies();
    }, []);
    return (
    <div className="p-10 grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies &&
        movies.map((movie) => (
            <MovieCard movie={movie}/>
        ))}
    </div>)
}

