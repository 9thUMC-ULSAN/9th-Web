import { useState } from "react";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string; }>();

    // 훅 호출! 필요한 값을 넘겨주고, 결과만 받아서 쓴다.
    const { movies, isPending, isError } = useCustomFetch(category, page);

    if (isError){
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }
    return (
    <>
        <div className='flex items-center justify-center gap-6 mt-5'>
            <button
                className="bg-[#8eb2ff] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#5779c4] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed
                cursor-pointer hover:scale-105"
                disabled={page===1}
                onClick={(): void => setPage((prev): number => prev -1)}
            >{`<`}</button>
            <span>{page} 페이지</span>
            <button
                className="bg-[#8eb2ff] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#5779c4] transition-all duration-200 cursor-pointer
                hover:scale-105"
                onClick={(): void => setPage((prev): number => prev +1)}
            >{`>`}</button>
        </div>
        {isPending && (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner/>
            </div>
        )}
        {!isPending && (
            <div className="p-10 grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies &&
                movies.map((movie) => (
                    <MovieCard movie={movie}/>
            ))}
        </div>
        )}
        
    </>
    )
}

