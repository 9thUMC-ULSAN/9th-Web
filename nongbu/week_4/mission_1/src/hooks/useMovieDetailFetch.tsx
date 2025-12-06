import { useEffect, useState } from "react";
import axios from "axios";
import type { MovieDetails } from "../types/movie";

// 파라미터로 movieId를 받는다
export function useMovieDetailFetch(movieId: string | undefined) {
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!movieId) return;

        const fetchMovieDetail = async (): Promise<void> => {
            setIsPending(true);
            setIsError(false);
            try {
                const { data } = await axios.get<MovieDetails>(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovie(data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieDetail();
    }, [movieId]); // movieId가 바뀔 때마다 다시 실행

    // 필요한 상태들을 반환
    return { movie, isPending, isError };
}