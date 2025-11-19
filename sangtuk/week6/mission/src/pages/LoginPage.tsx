import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postSignin } from '../apis/apis';
import { setAuthTokens } from '../utils/storage';
import { GoogleLoginButton } from '../components/GoogleLoginButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await postSignin({ email, password });

      if (response.data?.accessToken && response.data?.refreshToken) {
        // 토큰 저장
        setAuthTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        // 홈으로 이동
        navigate('/');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-500 mb-2">DOLIGO</h1>
          <p className="text-gray-400">로그인하여 계속하세요</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="이메일을 입력하세요."
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="비밀번호를 입력하세요."
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 구분선 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-400">또는</span>
            </div>
          </div>

          {/* 구글 로그인 */}
          <GoogleLoginButton
            text="Google로 로그인"
            className="w-full hover:opacity-80"
          />

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              계정이 없으신가요?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-pink-500 hover:text-pink-400 font-medium transition-colors"
              >
                회원가입
              </button>
            </p>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
