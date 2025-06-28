import { useCallback, useRef, useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router';
import { Tldraw, getSnapshot, type Editor, type StoreSnapshot, type TLRecord, type TLUiOverrides } from 'tldraw';
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls';
import 'tldraw/tldraw.css';

// 분리된 서버 로직 import
export { loader, action } from '../../../src/server/project.server';

// 분리된 tldraw 설정 import
import { customComponents } from '@/lib/tldraw/tldraw.components';
import { customActions } from '@/lib/tldraw/tldraw.actions';
import { customTools } from '@/lib/tldraw/tldraw.tools';
import { handleEditorMount } from '@/lib/tldraw/tldraw.handlers';

// 유틸 및 커스텀 Shapes/Tools import
import EditorNavBar from '@/components/sketches/EditorNavBar';
import { MyButtonTool } from '@/components/sketches/MyButtinTool';
import { MyShapeUtil } from '@/lib/MyCustomShape/MyCustomShape';
import { SlideShapeUtil } from '@/lib/SlideShapeUtils';
import { SlideShapeTool } from '@/components/sketches/SlideShapeTool';

// tldraw 설정 통합
const shapeUtils = [MyShapeUtil, SlideShapeUtil];
const tools = [SlideShapeTool, MyButtonTool];
const overrides: TLUiOverrides = {
  actions: customActions,
  tools: customTools,
};

export default function ProjectEditorPage() {
  const assetUrls = getAssetUrlsByMetaUrl();
  const editorRef = useRef<Editor | null>(null);

  const { projectId, initialContent, projectName, initialCanvasWidth, initialCanvasHeight } = useLoaderData() as {
    projectId: string;
    initialContent: StoreSnapshot<TLRecord>;
    projectName: string;
    initialCanvasWidth: number;
    initialCanvasHeight: number;
  };

  const fetcher = useFetcher();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const onMount = useCallback((editor: Editor) => {
    editorRef.current = editor;
    const dispose = handleEditorMount(editor, initialCanvasWidth, initialCanvasHeight, setHasUnsavedChanges);
    // onMount에서 cleanup 함수를 반환하면 tldraw가 컴포넌트 unmount 시 호출해줍니다.
    return dispose;
  }, [initialCanvasWidth, initialCanvasHeight]);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <EditorNavBar projectName={projectName}>
        <button
          onClick={saveProject}
          disabled={!hasUnsavedChanges || fetcher.state === 'submitting'}
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
      <Tldraw
        persistenceKey={projectId}
        initialStore={initialContent}
        components={customComponents}
        shapeUtils={shapeUtils}
        tools={tools}
        overrides={overrides}
        getShapeVisibility={(s) =>
          s.meta.force_show ? 'visible' : s.meta.hidden ? 'hidden' : 'inherit'
        }
        assetUrls={assetUrls}
        onMount={onMount}
      />
    </div>
  );
}