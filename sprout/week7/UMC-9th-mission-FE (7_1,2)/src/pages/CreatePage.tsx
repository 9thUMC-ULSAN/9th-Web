import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus } from 'lucide-react';
import { axiosInstance } from '../apis/axios';
import { QUERY_KEY } from '../constants/key';

const CreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ✅ LP 등록 Mutation
  const createLpMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // 🚨 서버 주소 확인: /v1/lps
      const { data } = await axiosInstance.post('/v1/lps', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      // ✅ 등록 성공 시 목록 쿼리 무효화하여 홈 화면 즉시 갱신
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      alert('LP가 성공적으로 등록되었습니다!');
      navigate('/');
    },
    onError: (error: any) => {
      console.error('등록 실패 상세:', error.response?.data);
      alert(
        error.response?.data?.message ||
          '저장 중 오류가 발생했습니다. 필드명을 확인해주세요.'
      );
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (target: string) => {
    setTags(tags.filter((t) => t !== target));
  };

  const handleSubmit = () => {
    if (!title || !content || !imageFile) {
      return alert('이미지, 제목, 내용을 모두 입력해주세요!');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 🚨 [해결 포인트 1] 필드명 변경
    // 400 에러의 주범일 확률이 높습니다. 'thumbnail' 대신 'image'로 전송합니다.
    formData.append('image', imageFile);

    // 🚨 [해결 포인트 2] 태그 전송 방식
    // 서버가 문자열 배열을 기대한다면 아래처럼 하나씩 append 합니다.
    tags.forEach((tag) => {
      formData.append('tags', tag);
    });

    createLpMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-[#25262B] p-8 rounded-2xl border border-gray-800 shadow-2xl relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h1 className="text-2xl font-bold text-pink-500 mb-8 text-center tracking-widest uppercase">
          New LP Record
        </h1>

        <div className="space-y-6">
          {/* 이미지 업로드 영역 */}
          <div className="flex justify-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-48 h-48 rounded-full border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-pink-500 transition-all group shadow-inner"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Plus
                    className="text-gray-500 group-hover:text-pink-500"
                    size={32}
                  />
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    Add LP Cover
                  </span>
                </div>
              )}
              <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-[#25262B] rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-gray-700 shadow-inner z-10" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* 입력 폼 */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LP Name"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-1 focus:ring-pink-500 outline-none transition-all"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="LP Content"
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg h-24 resize-none outline-none focus:ring-1 focus:ring-pink-500 transition-all"
          />

          {/* 태그 섹션 */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="LP Tag"
                className="flex-1 bg-gray-800 border border-gray-700 p-2 rounded-lg outline-none focus:border-pink-500 transition-colors"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 font-bold transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-xs border border-pink-500/30"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-white transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={createLpMutation.isPending}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all mt-4 disabled:bg-gray-700 disabled:text-gray-400"
          >
            {createLpMutation.isPending ? 'Processing...' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
