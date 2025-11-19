import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LPDetailPage from './pages/LPDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 레이아웃 없는 페이지 */}
          <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 레이아웃이 있는 페이지 */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/lps/:lpId" element={<Layout><LPDetailPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
