import { useEffect, useState } from "react";
import axios from 'axios';
import type { Credit, CreditResponse } from '../types/movie';
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import CastCard from "./CastCard";

export default function Credit() {
    const params = useParams();
    const [casts, setCasts] = useState<Credit[]>([]);

    // 1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    // 2. 에러 상태
    const [isError, setIsError] = useState(false);

    useEffect(() : void => {
        const fetchCredit = async () : Promise<void> => {
            setIsPending(true)
            try {
                const {data} = await axios.get<CreditResponse>(
                    `https://api.themoviedb.org/3/movie/${params.movieId}}/credits?language=en-US`,
                {
                    headers: {
                        Authorization : `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                }
            );
            setCasts(data.cast);
        } catch {
            setIsError(true);
        } finally {
            setIsPending(false)
        }
    } 
        fetchCredit();
    }, [params.movieId]);

    if (isError){
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }
    if (isPending) {
        return <LoadingSpinner />;
    }
    return (
    <div className="bg-black text-white min-h-screen">
        {!isPending && (
            <div className="p-10 grid gap-2 grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
            {casts &&
                casts.map((cast) => (
                    <CastCard key={cast.id} cast={cast}/>
            ))}
        </div>
        )}
        
    </div>
    )
}

