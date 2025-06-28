import { useEffect, useState } from 'react';
import { Form, useActionData, useNavigate, useNavigation } from 'react-router';
import { X } from 'lucide-react'; // 닫기 버튼 아이콘
import { useUser } from '@clerk/react-router';
/** 새 목업 만들기 모달에 props 정의 */
interface NewProjectModalProps {
  onProjectCreated: () => void
}

/**
 * 새로운 프로젝트를 생성하는 모달 컴포넌트
 * @param {NewProjectModalProps} props - 프로젝트 생성 완료 후 호출될 콜백 함수를 포함
 */
function NewProjectModal({ onProjectCreated }: NewProjectModalProps) {
  /** React Router 훅 사용 */
  const navigate = useNavigate();
  const actionData = useActionData() as {message?:string; error?:string} | undefined; // action 반환값
  const navigation = useNavigation();

  /** Clerk 훅 사용 - 사용자 정보 가져오기 */
  const { user, isSignedIn } = useUser();

  /** 프로젝트 관련 상태 관리 */
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedScreenSize, setSelectedScreenSize] = useState('mobile_portrait'); // 기본 선택값

  /** 커스텀 사이즈 관련 상태 및 유효성 검사 */
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [customSizeError, setCustomSizeError] = useState(''); // 커스텀 사이즈 에러 메시지 상태
  
  /** 프로젝트 타입 관련 상태 관리 */
  const [projectType, setProjectType] = useState('whiteboard'); // 기본 선택값

  /** 제출 상태 확인 */
  const isSubmitting = navigation.state === 'submitting';

  /** 커스텀 사이즈 입력 범위 정의 */
  const MIN_CUSTOM_SIZE = 100;
  const MAX_CUSTOM_SIZE = 4000;

  /** 
   * 모달 닫기 핸들러
   * 이전 경로로 돌아가 모달을 닫는다.
   */
  const handleClose = () => {
    navigate(-1);
  };

  /** actionData를 사용하여 에러나 성공 메시지 처리 */
  useEffect(() => {
    if (actionData) {
      if (actionData.error) {
        alert(`프로젝트 생성 실패: ${actionData.error}`);
      } else if (actionData.message) {
        console.log(actionData.message)
        /** 성공 메시지, 특정 라우트로 리다이렉트된 경우 모달 닫기 */
        if (navigation.state === 'idle') {
          handleClose();
          onProjectCreated?.(); // 선택적 호출 (action이 revalidate 해줍니다.)
        }
      }
    }
  }, [actionData, navigation.state, onProjectCreated])

  /** 커스텀 사이즈 입력 유효성 검사 */
  useEffect(() => {
    if (selectedScreenSize === 'custom') {
      const width = parseInt(customWidth, 10);
      const height = parseInt(customHeight, 10);

      if (
        (customWidth && (isNaN(width) || width < MIN_CUSTOM_SIZE || width > MAX_CUSTOM_SIZE)) ||
        (customHeight && (isNaN(height) || height < MIN_CUSTOM_SIZE || height > MAX_CUSTOM_SIZE))
      ) {
        setCustomSizeError(`너비와 높이는 ${MIN_CUSTOM_SIZE}px에서 ${MAX_CUSTOM_SIZE}px 사이여야 합니다.`);
      } else {
        setCustomSizeError('');
      }
    } else {
      setCustomSizeError('');
    }
  }, [selectedScreenSize, customWidth, customHeight]);

  /** 미리 정의된 화면 화면 사이즈 옵션 */
  const screenSizes = [
    { id: 'mobile_portrait', name: 'Mobile 세로모드', size: '360 px', description: '360 px' },
    { id: 'mobile_landscape', name: 'Mobile 가로모드', size: '640 px', description: '640 px' },
    { id: 'tablet_600', name: 'Tablet', size: '600 px', description: '600 px' },
    { id: 'tablet_768', name: 'Tablet', size: '768 px', description: '768 px' },
    { id: 'pc_978', name: 'PC', size: '978 px', description: '978 px' },
    { id: 'pc_1200', name: 'PC', size: '1200 px', description: '1200 px' },
  ];

  /** 폼 제출 버튼 활성화 조건 */
  const isFormValid = 
    projectName.trim() !== '' &&
    isSignedIn &&
    user &&
    (!customSizeError) && // 커스텀 사이즈 에러가 없어야 한다는 조건
    (selectedScreenSize !== 'custom' || (customWidth.trim() !== '' && customHeight.trim() !== '')); // 커스텀 선택 시 값이 필수

  return (
    /** 모달 오버레이 */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      {/* 모달 내용 컨테이너 */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-auto flex flex-col max-h-[90vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">새로운 프로젝트 만들기</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 모달 바디 (폼 내용) */}
        <Form method="post" className="p-6 space-y-6 overflow-y-auto flex-grow">
          {/* 프로젝트 이름 입력 섹션 */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              프로젝트 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="프로젝트의 이름을 입력해주세요 (필수)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          {/* 프로젝트 상세 내용 입력 섹션 */}
          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              상세내용
            </label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="프로젝트에 대한 설명을 기입해주세요 (선택)"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            ></textarea>
          </div>

          {/* 기본 화면 사이즈 선택 섹션 */}
          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">기본 화면 사이즈</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {screenSizes.map((size) => (
                <label
                  key={size.id}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                    ${selectedScreenSize === size.id
                      ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                >
                  <input
                    type="radio"
                    name="screenSize"
                    value={size.id}
                    checked={selectedScreenSize === size.id}
                    onChange={() => setSelectedScreenSize(size.id)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-gray-800 dark:text-white">{size.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{size.description}</span>
                  {/* 실제 이미지 대체: img src={...} */}
                  <div className="w-16 h-12 bg-gray-200 dark:bg-gray-600 rounded-sm mt-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    {size.size}
                  </div>
                </label>
              ))}
              {/* 커스텀 사이즈 입력 섹션 */}
              <label
                className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                  ${selectedScreenSize === 'custom'
                    ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
              >
                <input
                  type="radio"
                  name="screenSize"
                  value="custom"
                  checked={selectedScreenSize === 'custom'}
                  onChange={() => setSelectedScreenSize('custom')}
                  className="sr-only"
                />
                <span className="font-semibold text-gray-800 dark:text-white">커스텀</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">직접 입력</span>
                {selectedScreenSize === 'custom' && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="number"
                      placeholder="폭"
                      name="customWidth"
                      className="w-20 text-center border border-gray-300 rounded-md py-1 px-2 text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // 라디오 버튼 선택 막기
                      min={MIN_CUSTOM_SIZE} // 최소값 설정
                      max={MAX_CUSTOM_SIZE} // 최대값 설정
                    />
                    <span className="text-gray-600 dark:text-gray-400">x</span>
                    <input
                      type="number"
                      placeholder="높이"
                      name="customHeight"
                      className="w-20 text-center border border-gray-300 rounded-md py-1 px-2 text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // 라디오 버튼 선택 막기
                      min={MIN_CUSTOM_SIZE} // 최소값 설정
                      max={MAX_CUSTOM_SIZE} // 최대값 설정
                    />
                  </div>
                )}
              </label>
            </div>
            {/* 커스텀 사이즈 유효성 검사 에러 메시지 */}
            {customSizeError && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{customSizeError}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              신규 페이지 생성 시 적용되는 화면비율이며, 프로젝트 생성 후 페이지별 변경 가능합니다.
            </p>
          </div>

          {/* 프로젝트 타입 선택: Whiteboard / Slideshow */}
          <div>
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">프로젝트 타입</p>
            <div className="flex gap-4">
              <label
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                  ${projectType === 'whiteboard'
                    ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
              >
                <input
                  type="radio"
                  name="projectType"
                  value="whiteboard"
                  checked={projectType === 'whiteboard'}
                  onChange={() => setProjectType('whiteboard')}
                  className="mr-2"
                />
                <span className="font-semibold text-gray-800 dark:text-white">화이트보드 (Free Camera)</span>
              </label>
              <label
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                  ${projectType === 'slideshow'
                    ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
              >
                <input
                  type="radio"
                  name="projectType"
                  value="slideshow"
                  checked={projectType === 'slideshow'}
                  onChange={() => setProjectType('slideshow')}
                  className="mr-2"
                />
                <span className="font-semibold text-gray-800 dark:text-white">슬라이드쇼</span>
              </label>
            </div>
          </div>

          {/** 클럭 유저아이디는 히든으로 전송 */}
          {isSignedIn && user && <input type="hidden" name="userId" value={user?.id} />}
          <input type="hidden" name="clerkUserId" value={user?.id} />
          {/** 초기 TldrawContent  (hidden input) */}
          <input type="hidden" name="tldrawContent" value={JSON.stringify({document:[]})} />
          {/** 초기 태그 값 (hidden input) */}
          <input type="hidden" name="tags" value={'새 프로젝트'} />

          {/* 테스트 URL 공유 섹션 (UI/UX 예시) */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">테스트URL 공유</p>
            <div className="flex gap-2 mb-2">
              <button
                type="button" // 폼 제출 방지
                className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              >
                로그인없이 보기 허용
              </button>
              <button
                type="button" // 폼 제출 방지
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                특정 사용자에게만 허용
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              테스트페이지 URL을 전달받은 유저는 Oven 계정 생성이나 로그인을 하지 않아도 테스트페이지에 접근할 수 있습니다. 프로젝트 생성 후에는 '공유옵션'을 통해 변경 가능합니다.
            </p>
          </div>

          {/* 모달 푸터 */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              type="submit"
              formMethod='post'
              formAction='/dashboard/projects'
              disabled={isSubmitting || !isFormValid} //로딩 상태 및 유효성 검사로 비활
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300"
              >
              {isSubmitting ? '로딩중...' : '새로운 프로젝트 만들기'}
            </button>
          </div>
        </Form>
      </div>
    </div>
    );
}

export default NewProjectModal;