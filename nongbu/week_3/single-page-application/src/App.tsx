
const NongbuPage = () => <h1>농부 페이지</h1>;
const GokgwaengiPage = () => <h1>곡괭이 페이지</h1>;
const SapPage = () => <h1>삽 페이지</h1>;
const NotFoundPage = () => <h1>404 Not Found</h1>;


function App() {
  const { pathname } = window.location;

  switch (pathname) {
    case '/Nongbu':
      return <NongbuPage />;
    case '/Gokgwaengi':
      return <GokgwaengiPage />;
    case '/Sap':
      return <SapPage />;
    default:
      return <h1>404</h1>;
  }
}


export default App;
