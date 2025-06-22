import { useCallback, useRef, useState } from 'react';
import { Tldraw, useEditor, useValue, Editor} from 'tldraw';
import type { TLComponents, TLUiOverrides, TLUiActionsContextType, TLUiToolsContextType, TLPageId } from 'tldraw';

import 'tldraw/tldraw.css'
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'

import '../../../styles/layer.panel.css'
import NavBar from '@/components/sketches/NavBar';
import { ShapeList } from '@/components/sketches/ShapeList'
import WireframePagesPanel from '@/components/sketches/WireframePagesPanel';
import RightElementsPanel from '@/components/sketches/RightSidePanel';
import { MyButtonTool } from '@/components/sketches/MyButtinTool';

import { MyShapeUtil } from '@/lib/MyCustomShape/MyCustomShape';
// import snapshot from './snapshot.json'

const componets: TLComponents = {
  QuickActions:null,
  MenuPanel:null,
  Minimap: null,
  StylePanel:RightElementsPanel,
  SharePanel: null,
  //레이어 패널
  InFrontOfTheCanvas: () => {
    const editor = useEditor()
    const [activeTab, setActiveTab] = useState<'layers' | 'wireframe'>('layers')

    const layerShapeIds = useValue(
      'shapeIds',
      () => editor.getSortedChildIdsForParent(editor.getCurrentPageId()),
      [editor]
    )

    const allPages = useValue(
      'allPages',
      () => editor.getPages(),
      [editor]
    )


    const currentPageId = useValue(
      'currentPageId',
      () => editor.getCurrentPageId(),
      [editor]
    );

    const handleAddPage = useCallback(() => {
      if (editor) {
        const newPage = editor.createPage({ name: `새 페이지 ${allPages.length + 1}` });
        editor.setCurrentPage(newPage.id as TLPageId);
        // 새 페이지에 기본 도형 추가 (예: 베이직 레이아웃)
      }
    },[editor, allPages])

    const handleSelectPage = useCallback((pageId: TLPageId) => {
      if(editor){
        editor.setCurrentPage(pageId)
      }
    }, [editor]);

    return (
      <div className='layer-panel'>
        <div className='layer-panel-header'> {/* 헤더 영역 분리 */}
            {/* 탭 버튼들 */}
            <div className='layer-panel-tabs'>
                <button
                    className={`tab-button ${activeTab === 'layers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('layers')}
                >
                    레이어
                </button>
                <button
                    className={`tab-button ${activeTab === 'wireframe' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wireframe')}
                >
                    와이어프레임
                </button>
            </div>
        </div>

        {/* 탭 내용 */}
        <div className='tab-content'>
            {activeTab === 'layers' && (
                <ShapeList
                    shapeIds={layerShapeIds}
                    depth={0}
                />
            )}
            {activeTab === 'wireframe' && (
                <WireframePagesPanel
                    editor={editor}
                    allPages={allPages}
                    currentPageId={currentPageId}
                    onPageSelect={handleSelectPage}
                    onAddPage={handleAddPage}
                />
            )}
        </div>
      </div>
    );
  }
}

const uiOverrides: TLUiOverrides = {
  actions(_editor, actions, helpers): TLUiActionsContextType {
    const newActions = {
      ...actions,
			'toggle-grid': { ...actions['toggle-grid'], kbd: 's' },
			'copy-as-png': { ...actions['copy-as-png'], kbd: 'cmd+a,ctrl+a' },
    }
    return newActions
  },
  tools(_editor, tools): TLUiToolsContextType {
    const newTools = {
      ...tools,
      draw: { ...tools.draw, kbd: 'p'}
    }
    return newTools
  }
}

const customTools = [MyButtonTool]
const customShapeUtil = [MyShapeUtil]

export default function ProjectEditorPage() {
  const assetUrls = getAssetUrlsByMetaUrl();
  const editorRef = useRef<Editor | null>(null);
  const tldrawContainerRef = useRef<HTMLDivElement>(null); // Tldraw를 감싸는 div 참조

  const handleTldrawMount = useCallback((e: Editor) => {
    editorRef.current = e;
    console.log("Tldraw editor mounted.");

  }, []);

  // 외부 HTML 요소에 대한 onDragOver 핸들러 (유지)
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault(); // <-- 필수! 이것이 없으면 drop 이벤트가 발생하지 않습니다.
    event.dataTransfer.dropEffect = 'copy';
    console.log("Custom handleDragOver fired!");
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, display:'flex', flexDirection:'column'}}>
      <NavBar />
      <Tldraw
        persistenceKey='layer-panel-examle'
        components={componets}
        shapeUtils={customShapeUtil}
        tools={customTools}
        getShapeVisibility={(s) =>
          s.meta.force_show ? 'visible' : s.meta.hidden ? 'hidden' : 'inherit'
        }
        assetUrls={assetUrls}
        overrides={uiOverrides}
        onMount={handleTldrawMount}
        // snapshot={snapshot as any as TLEditorSnapshot}
      >
      </Tldraw>
    </div>
  );
}
