import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { MovieDetails } from "../types/movie";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import Credit from "../components/Credit"
import { useMovieDetailFetch } from "../hooks/useMovieDetailFetch";

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    // 훅 한 줄로 데이터 로직 끝!
    const { movie, isPending, isError } = useMovieDetailFetch(movieId);
    if (isError){
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }
    if (!movie){
        return <div>
            <LoadingSpinner/>
        </div>
    }
    return (
        <>
            <div className="p-10 text-white " style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 1)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
                <div className="backdrop-blur-md bg-white/10 bg-opacity-70 p-10 rounded-4xl flex gap-10 ">
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title}
                        className="w-1/3 rounded-lg "
                    />
                    <div className="w-2/3 flex flex-col justify-center">
                        <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                        <p className="text-lg italic text-gray-300 mb-4">"{movie.tagline}"</p>
                        <div className="flex gap-2 mb-4">
                            {movie.genres.map(genre => (
                                <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm">{genre.name}</span>
                            ))}
                        </div>
                        <p className="text-lg mb-2">개봉일: {movie.release_date}</p>
                        <p className="text-lg mb-2">평점: {movie.vote_average.toFixed(1)} / 10</p>
                        <p className="leading-relaxed">{movie.overview}</p>
                    </div>
                </div>
            </div>
            <Credit/>
        </>
    )
}

export default MovieDetailPage;