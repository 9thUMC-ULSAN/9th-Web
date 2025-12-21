import { useEffect, useState, useRef } from 'react';
import { getMyInfo } from '../apis/auth.ts';
import type { ResponseMyInfoDto } from '../types/auth.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../apis/axios';
import { Settings, LogOut, Check, Camera, X } from 'lucide-react'; // X 아이콘 추가
import { QUERY_KEY } from '../constants/key';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList';
import LpCard from '../components/LpCard/LpCard';
import { PAGINATION_ORDER } from '../enums/common.ts';

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout, accessToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [showResignModal, setShowResignModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'liked' | 'my'>('liked');

  // ✅ 정렬 상태 관리
  const [lpOrder, setLpOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );

  useEffect(() => {
    if (accessToken) {
      getMyInfo().then((res) => {
        setData(res);
        setEditName(res.data.nickname || res.data.name || '');
        setEditBio(res.data.bio || '');
        setPreviewUrl(res.data.avator || res.data.profileImage || null);
      });
    }
  }, [accessToken]);

  // ✅ [수정] 닉네임 변경 낙관적 업데이트 (onMutate) 적용
  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.patch('v1/auth/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onMutate: async (formData) => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });
      // 2. 이전 데이터 스냅샷 저장
      const previousInfo = queryClient.getQueryData([QUERY_KEY.myInfo]);

      // 3. 캐시를 즉시 업데이트 (Nav-Bar와 MyPage 닉네임 즉시 변경)
      queryClient.setQueryData([QUERY_KEY.myInfo], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          nickname: formData.get('nickname'),
          bio: formData.get('bio'),
        },
      }));

      return { previousInfo };
    },
    onError: (_err, _newInfo, context) => {
      // 에러 발생 시 이전 상태로 롤백
      queryClient.setQueryData([QUERY_KEY.myInfo], context?.previousInfo);
    },
    onSuccess: (res) => {
      setData(res);
      setIsEditMode(false);
      setImageFile(null);
      alert('변경 사항이 성공적으로 저장되었습니다!');
    },
    onSettled: () => {
      // 성공/실패 여부와 관계없이 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });

  const handleUpdateSubmit = () => {
    const formData = new FormData();
    formData.append('nickname', editName);
    formData.append('name', editName);
    formData.append('bio', editBio || '');
    if (imageFile) formData.append('avator', imageFile);

    updateProfileMutation.mutate(formData);
  };

  const deleteUserMutation = useMutation({
    mutationFn: async () => await axiosInstance.delete('v1/auth/me'),
    onSuccess: () => {
      alert('탈퇴 처리가 완료되었습니다.');
      logout();
      navigate('/login');
    },
  });

  // LP 리스트 가져오기 (정렬 상태 lpOrder 적용)
  const { data: lpList } = useGetInfiniteLpList(50, '', lpOrder);
  const allLps = lpList?.pages.flatMap((page) => page.data.data) || [];
  const myId = Number(data?.data?.id);

  const filteredLps = allLps.filter((lp) => {
    if (activeTab === 'liked')
      return lp.likes?.some((like: any) => Number(like.userId) === myId);
    return Number(lp.writer?.id) === myId;
  });

  if (!data)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <main className="pt-16 px-4 sm:px-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* 프로필 섹션 */}
          <div className="flex flex-col items-center mb-12 w-full max-w-xl text-center">
            <div className="relative mb-6">
              <div
                className={`w-32 h-32 rounded-full border-4 border-pink-500 overflow-hidden bg-gray-800 ${
                  isEditMode ? 'cursor-pointer' : ''
                }`}
                onClick={() => isEditMode && fileInputRef.current?.click()}
              >
                <img
                  src={previewUrl || 'https://placehold.co/150'}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
                {isEditMode && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Camera className="text-white" size={24} />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
              {!isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <Settings size={28} />
                </button>
              )}
            </div>

            {isEditMode ? (
              <div className="space-y-4 w-full max-w-xs mx-auto animate-in fade-in">
                <div className="relative flex items-center border-b-2 border-pink-500 pb-1">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-center outline-none text-2xl font-bold"
                  />
                  <button
                    onClick={handleUpdateSubmit}
                    className="absolute -right-10 text-pink-500 hover:scale-110 transition-transform"
                  >
                    <Check size={32} />
                  </button>
                </div>
                <input
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 text-center text-sm outline-none text-gray-400"
                  placeholder="자기소개"
                />
                <button
                  onClick={() => setIsEditMode(false)}
                  className="text-gray-500 text-xs underline mt-2 block mx-auto"
                >
                  수정 취소
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {data.data.nickname || data.data.name}
                </h1>
                <p className="text-gray-400 text-base mb-1">
                  {data.data.bio || '등록된 소개가 없습니다.'}
                </p>
                <p className="text-gray-500 text-sm font-mono">
                  {data.data.email}
                </p>
              </div>
            )}
          </div>

          {/* ✅ [수정] 탭 메뉴 & 우측 정렬 버튼 영역 */}
          <div className="w-full border-b border-gray-800 flex justify-between items-end mb-8 relative">
            <div className="flex gap-12">
              {['liked', 'my'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 px-4 text-base font-bold relative ${
                    activeTab === tab ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {tab === 'liked' ? '내가 좋아요 한 LP' : '내가 작성한 LP'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-500" />
                  )}
                </button>
              ))}
            </div>

            {/* ✅ 영상과 동일한 우측 정렬 버튼 UI 추가 */}
            <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800 mb-4">
              <button
                onClick={() => setLpOrder(PAGINATION_ORDER.asc)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  lpOrder === PAGINATION_ORDER.asc
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                오래된순
              </button>
              <button
                onClick={() => setLpOrder(PAGINATION_ORDER.desc)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  lpOrder === PAGINATION_ORDER.desc
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                최신순
              </button>
            </div>
          </div>

          {/* LP 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full mb-16">
            {filteredLps.map((lp: any) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>

          {/* 푸터 유틸리티 */}
          <div className="flex gap-8 text-sm border-t border-gray-900 pt-10 w-full justify-center">
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 text-gray-500 hover:text-white"
            >
              <LogOut size={18} /> 로그아웃
            </button>
            <button
              onClick={() => setShowResignModal(true)}
              className="text-gray-700 hover:text-red-500"
            >
              회원탈퇴
            </button>
          </div>
        </div>
      </main>

      {/* 회원 탈퇴 확인 모달 (영상/이미지 디자인 반영) */}
      {showResignModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1100] backdrop-blur-sm">
          <div className="bg-[#2A2B31] p-10 rounded-2xl border border-gray-800 max-w-sm w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowResignModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-10 mt-4">
              정말 탈퇴하시겠습니까?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => deleteUserMutation.mutate()}
                className="flex-1 py-3 bg-[#D1D5DB] text-black font-bold rounded-lg hover:bg-white transition-colors"
              >
                예
              </button>
              <button
                onClick={() => setShowResignModal(false)}
                className="flex-1 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
