import { useEffect, useState } from "react";
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';

// category와 page를 파라미터로
export function useCustomFetch(category: string | undefined, page: number) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // category가 아직 없으면 (렌더링 초기) 아무것도 안 함
        if (!category) return;

        const fetchMovies = async (): Promise<void> => {
            setIsPending(true);
            setIsError(false); // 새로 요청할 땐 에러 상태 초기화
            try {
                const { data } = await axios.get<MovieResponse>(
                    // 파라미터로 받은 category와 page를 URL에 사용
                    `https://api.themoviedb.org/3/movie/${category}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                
                setMovies(data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
        // useEffect의 의존성 배열에도 파라미터를 넣어준다.
        // -> category나 page가 바뀔 때마다 이 useEffect가 다시 실행됨
    }, [category, page]);

    // 컴포넌트에서 필요한 값들을 객체로 묶어서 반환한다.
    return { movies, isPending, isError };
}