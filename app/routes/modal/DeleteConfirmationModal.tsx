import { useState, useEffect } from 'react'
import { data, useFetcher, useLocation, useNavigate, type ActionFunctionArgs } from 'react-router';

import * as schema from '~/database/schema';

import { getAuth } from '@clerk/react-router/ssr.server';
import { and, eq } from 'drizzle-orm';

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { db } = context;
  const { userId } = await getAuth({ request, params, context });

  if (!userId) {
    throw data({ message: "인증되지 않았습니다. 로그인이 필요합니다." }, { status: 401 });
  }

  // POST 요청으로 formData를 받습니다.
  const formData = await request.formData();
  const projectId = formData.get("projectId") as string; // hidden input 등으로 전달받음

  if (!projectId) {
    throw data({ message: "프로젝트 ID가 필요합니다." }, { status: 400 });
  }

  if (request.method !== 'DELETE' && request.method !== 'POST') { // fetcher.submit의 method가 DELETE라도 form POST로 전달될 수 있음
    throw data({ message: "허용되지 않는 메서드입니다." }, { status: 405 });
  }

  try {
    const result = await db.delete(schema.userProjects)
      .where(and(
        eq(schema.userProjects.id, projectId),
        eq(schema.userProjects.clerkUserId, userId)
      ))
      .execute();

    if (result.rowsAffected === 0) {
      throw data({ message: "프로젝트를 찾을 수 없거나 삭제 권한이 없습니다." }, { status: 404 });
    }

    return data({ success: true, message: "프로젝트가 성공적으로 삭제되었습니다." }, { status: 200 });

  } catch (error: any) {
    console.error("프로젝트 삭제 중 오류 발생:", error);
    throw data({ message: "프로젝트 삭제 중 오류가 발생했습니다.", error: error.message }, { status: 500 });
  }
}




export default function DeleteConfirmationModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const fetcher = useFetcher();
  
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName;

  const [inputValue, setInputValue] = useState('');
  const [isDeleteBtnEnabled, setIsDeleteBtnEnabled] = useState(false);
  
  /** Id,Name없을경우 모달을 닫고 대시보드로 리다이렉트 */
  useEffect(() => {
    if (!projectId || !projectName) {
      console.warn("프로젝트 ID나 이름이 없습니다.")
      navigate('/dashboard/projects', { replace: true});
    }
  }, [projectId, projectName, navigate]);

  /** 프로젝트 이름과 일치 확인 - 버튼 활성화/비활성화 */
  useEffect(() => {
    setIsDeleteBtnEnabled(inputValue === projectName);
  }, [inputValue, projectName]);

  /** 패처 상태 변화 감지하여 모달 닫기 */
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && fetcher.data.success) {
      navigate('/dashboard/projects', { replace: true }); // 삭제 성공 시 대시보드로 이동
    }
    if (fetcher.state === 'idle' && fetcher.data && !fetcher.data.success) {
        // 에러 처리
        console.error("삭제 실패:", fetcher.data.message);
        // 사용자에게 에러 메시지 표시
    }
  }, [fetcher.state, fetcher.data, navigate]);

  /** 모달 닫기 */
  const handleClose = () => {
    navigate('/dashboard/projects', { replace: true });
  }
  
  /** 
   * fetcher.submit을 사용하여 formData로 전달할 데이터, _method는 Remix의 HTTP 메서드 오버라이드 컨벤션
   * 후 라우트의 action을 호출
   */
  const handleConfirm = () => {
    if(inputValue === projectName && projectId) {
      fetcher.submit(
        { projectId: projectId, _method: 'DELETE' },
        { method: 'post', action: '/dashboard/projects/delete' }
      );
    }
  };

  /** Id,Name이 없으면 로딩 중이거나 바로 리다이렉트 */
  if (!projectId || !projectName) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
          <p className="text-gray-900 dark:text-white">로딩 중...</p>
      </div>
  </div>
    )
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">프로젝트 삭제</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          이 작업을 되돌릴 수 없습니다. 프로젝트를 삭제하려면 아래 입력란에 "
          <strong className="text-red-500">{projectName}</strong>"을(를) 정확히 입력하십시오.
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="프로젝트 이름 입력"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose} // 닫기 버튼
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isDeleteBtnEnabled || fetcher.state !== 'idle'} // 삭제 중일 때는 비활성화
            className={`px-4 py-2 rounded-md ${
              isDeleteBtnEnabled && fetcher.state === 'idle'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {fetcher.state === 'submitting' ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}