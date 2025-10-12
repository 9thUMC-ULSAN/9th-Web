export const LoadingSpinner = (): React.ReactElement => {
  return (
    <div className="relative">
      <div
        className="size-16 animate-spin rounded-full border-4 border-t-transparent border-purple-500"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <div className="absolute inset-0 size-16 animate-ping rounded-full border-4 border-pink-500 opacity-20"></div>
    </div>
  );
};
