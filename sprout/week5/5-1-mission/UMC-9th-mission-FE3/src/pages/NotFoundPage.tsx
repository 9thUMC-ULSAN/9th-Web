const NotFoundPage = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg text-center text-red-500">
      <h1 className="text-4xl font-bold mb-4">
        404 - 페이지를 찾을 수 없습니다
      </h1>
      <p className="text-lg text-gray-600">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
    </div>
  );
};

export default NotFoundPage;
