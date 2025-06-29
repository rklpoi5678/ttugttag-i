import { useCallback, useMemo, useRef, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';
import { Tldraw, getSnapshot, type Editor, type StoreSnapshot, type TLComponents, type TLRecord, type TLUiOverrides } from 'tldraw';
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls';
import 'tldraw/tldraw.css';

// 분리된 서버 로직 import
export { loader, action } from '../../../src/server/project.server';

// 분리된 tldraw 설정 import
import { createCustomComponents } from '@/lib/tldraw/tldraw.components';
import { customActions } from '@/lib/tldraw/tldraw.actions';
import { customTools } from '@/lib/tldraw/tldraw.tools';
import { handleEditorMount } from '@/lib/tldraw/tldraw.handlers';

// 유틸 및 커스텀 Shapes/Tools import
import EditorNavBar from '@/components/sketches/EditorNavBar';
import { MyButtonTool } from '@/lib/MyThirtyTwoCustomTool/MyButtonTool';
import { MyShapeUtil } from '@/lib/MyThirtyTwoCustomShape/MyCustomShape';
import { SlideShapeUtil } from '@/lib/SlideShapeUtils';
import { SlideShapeTool } from '@/components/sketches/SlideShapeTool';
import { useAIGeneration } from '@/lib/tldraw/hooks/useAIGeneration';

// UI 컴포넌트 import
import { Toast } from '@/components/sketches/ui/Toast';
import { Spinner } from '@/components/sketches/ui/Spinner';
import AiSettingsModal from '@/components/sketches/modal/AiSettingsModal';

//  새로운 아코디언 도형 유틸리티와 툴을 임포트
import { AccordionTool } from '@/lib/MyThirtyTwoCustomTool/AccordionTool';

// tldraw 설정 통합
const shapeUtils = [MyShapeUtil, SlideShapeUtil];
const tools = [SlideShapeTool, MyButtonTool, AccordionTool];
const overrides: TLUiOverrides = {
  actions: customActions,
  tools: customTools,
};

/**
 * @function ProjectEditorPage
 * @description 
 * Tldraw  에디터를 렌더링하고, 프로젝트 데이터 로드, 저장
 * 그리고 AI 생성 기능을 통합하는 메인 페이지 컴포넌트입니다.
 */
export default function ProjectEditorPage() {
  const assetUrls = getAssetUrlsByMetaUrl();
  const editorRef = useRef<Editor | null>(null);

  // 로더를 통해 초기 프로젝트 데이터 가져오기
  const { projectId, initialContent, projectName, initialCanvasWidth, initialCanvasHeight } = useLoaderData() as {
    projectId: string;
    initialContent: StoreSnapshot<TLRecord>;
    projectName: string;
    initialCanvasWidth: number;
    initialCanvasHeight: number;
  };

  // Fetcher 훅: 데이터 뮤테이션 (프로젝트 저장)
  const fetcher = useFetcher();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /** AI 설정 모달 열림/닫힘 상태를 이곳에서 관리 */
  const [isAiSettingsModalOpen, setIsAiSettingsModalOpen] = useState(false);
  /** AI 생성 훅 */
  const aiGeneration = useAIGeneration();

  /**
   * @function saveProject
   * @description 
   * 현재 Tldraw 에디터의 스냅샷을 가져와 서버에 저장 요청을 보냅니다.
   * 저장 완료 후 `hasUnsavedChanges` 상태를 초기화합니다.
   */
  const saveProject = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentContent = getSnapshot(editor.store);
    fetcher.submit(JSON.stringify({ tldrawContent: currentContent }), {
      method: 'PATCH',
      action: `/sketches/${projectId}`,
      encType: 'application/json',
    });
    setHasUnsavedChanges(false);
  }, [fetcher, projectId]);

  /**
   * @function onMount
   * @description 
   * Tldraw 에디터가 마운트 될 때 호출되는 콜백 함수입니다.
   * 에디터 인스턴스를 ref에 저장하고, 초기 캔버스 크기 및 변경 감지로직을 초기화합니다.
   * @param {Editor} editor - 마운트된 Tldraw 에디터 인스턴스
   * @returns {() => void} cleanup 함수
   */
  const onMount = useCallback((editor: Editor) => {
    editorRef.current = editor;
    const dispose = handleEditorMount(editor, initialCanvasWidth, initialCanvasHeight, setHasUnsavedChanges);
    // onMount에서 cleanup 함수를 반환하면 tldraw가 컴포넌트 unmount 시 호출해줍니다.
    return dispose;
  }, [initialCanvasWidth, initialCanvasHeight]);

  /** useMemo사용 customComponents 함수호출 TLComponents 객체를 생성 */
  const components: TLComponents = useMemo(() => {
    return createCustomComponents({ aiGeneration, setIsAiSettingsModalOpen });
  }, [aiGeneration, setIsAiSettingsModalOpen]); // aiGeneration과 setIsAiSettingsModalOpen이 변경될 때마다 components 객체 재생성

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* 네비게이션 바 */}
      <EditorNavBar projectName={projectName}>
        <button
          onClick={saveProject}
          disabled={!hasUnsavedChanges || fetcher.state === 'submitting' || aiGeneration.isLoading} // AI로딩 중에 저장 비활성화
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            backgroundColor: hasUnsavedChanges ? '#4CAF50' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
          }}
        >
          {fetcher.state === 'submitting' ? '저장 중...' : (hasUnsavedChanges ? '저장' : '저장됨')}
        </button>
      </EditorNavBar>

      {/* Tldraw 에디터 */}
      <Tldraw
        persistenceKey={projectId}
        initialStore={initialContent} 
        components={components} // 사용자 정의 UI 컴포넌트
        shapeUtils={shapeUtils} // 사용자 정의 세이프 유틸리티
        tools={tools} // 사용자 정의 도구
        overrides={overrides} // UI 오버라이드 (액션,도구 등)
        getShapeVisibility={(s) =>
          s.meta.force_show ? 'visible' : s.meta.hidden ? 'hidden' : 'inherit'
        }
        assetUrls={assetUrls}
        onMount={onMount} // 에디터 마운트 시 콜백
      />

      {/* AI 로딩 스피너 (AI 생성 중일 때만 표시) */}
      {aiGeneration.isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40'>
          <Spinner />
        </div>
      )}

      {/* 토스트 메시지 */}
      <Toast message={aiGeneration.toastMessage} onClose={aiGeneration.clearToast} />

      {/** AI Settings Modal 조건부 렌더링 */}
      {isAiSettingsModalOpen && (
        <AiSettingsModal
          onClose={() => setIsAiSettingsModalOpen(false)}
          {...aiGeneration} // aiGeneration 훅의 모든 상태와 함수를 props로 전달
        />
      )}
    </div>
  );
}