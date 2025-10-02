export const LoadingSpinner = () => {
    return (
        <div
            className="size-27 animate-spin rounded-full border-17 border-t-transparent border-[gray]"
            role='status'
        >
            <span className='sr-only'>로딩 중...</span>
        </div>
    )
}