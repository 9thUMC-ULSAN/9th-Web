import type { ReactElement } from 'react';

const NotFoundPage = (): ReactElement => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-black text-white text-3xl font-bold">
      404 Not Found Page
    </div>
  );
};

export default NotFoundPage;
