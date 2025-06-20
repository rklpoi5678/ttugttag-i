import { Tldraw, type TLComponents, useEditor, useValue, type TLUiOverrides, type TLUiActionsContextType, type TLUiToolsContextType, type BaseRecord, type TLPageId, Editor, createShapeId, type TLPointer} from 'tldraw';
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import 'tldraw/tldraw.css'
import { ShapeList } from '@/components/sketches/ShapeList'
import '../../../styles/layer.panel.css'
import NavBar from '@/components/sketches/NavBar';
import { useCallback, useRef, useState } from 'react';
import WireframePagesPanel from '@/components/sketches/WireframePagesPanel';
import RightElementsPanel from '@/components/sketches/RightSidePanel';
import type { UiTemplate } from '@/components/sketches/uiTempates';
import { MyShapeUtil } from '@/lib/MyCustomShape/MyCustomShape';
// import snapshot from './snapshot.json'

const componets: TLComponents = {
  QuickActions:null,
  MenuPanel:null,
  ZoomMenu: null,
  Minimap: null,
  NavigationPanel:null,
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

const customShapeUtil = [MyShapeUtil]

export default function ProjectEditorPage() {
  const assetUrls = getAssetUrlsByMetaUrl()

  // Tldraw 에디터가 마운트될 때 호출될 콜백 함수
  const handleMount = useCallback((editor: Editor) => {
    editor.on('drop' as any, (info: { point: TLPointer, dataTransfer: DataTransfer }) => { // Cast event name to any if TS complains, and type info explicitly
      
      console.log("Drop event received:", info)
      console.log('dataTransfer types:', info.dataTransfer.types); // 어떤 타입의 데이터가 넘어오는지 확인
      const templateData = info.dataTransfer.getData('tldraw/template');
      console.log('Retrieved templateData:', templateData); // 이 값이 비어있거나 이상하면 문제!

      if (templateData) {
        try {
          const template: UiTemplate = JSON.parse(templateData);
          const { x, y } = info.point; // Access point directly from info

          // !!! 중요 디버깅 포인트 !!!
          console.log('Parsed template:', template);
          console.log('Drop coordinates (x, y):', x, y);

          if (template.type === 'group' && template.getChildren) {
              const childShapes = template.getChildren(x, y);
              editor.createShapes(childShapes.map(s => ({
                  ...s,
                  id: createShapeId(),
              })));
              console.log('Created group shapes:', childShapes);
          } else {
              editor.createShape({
                  id: createShapeId(),
                  type: template.type as any,
                  x: x,
                  y: y,
                  props: template.defaultProps,
              });
              console.log('Created single shape:', {
                id: createShapeId(), // 이 ID는 매번 새로 생성되므로 실제 생성된 ID와 다를 수 있습니다.
                type: template.type,
                x: x,
                y: y,
                props: template.defaultProps,
            });
          }
        } catch (e) {
          console.error('Failed to parse template data or create shape:', e);
        }
      
      }
    });
  }, []); // Depend on nothing so it only runs once on mount
  
  return (
    <div style={{ position: 'fixed', inset: 0, display:'flex', flexDirection:'column'}}>
      <NavBar />
      <Tldraw
        persistenceKey='layer-panel-examle'
        components={componets}
        shapeUtils={customShapeUtil}
        getShapeVisibility={(s) =>
          s.meta.force_show ? 'visible' : s.meta.hidden ? 'hidden' : 'inherit'
        }
        assetUrls={assetUrls}
        overrides={uiOverrides}
        onMount={handleMount}
        // snapshot={snapshot as any as TLEditorSnapshot}
      >
      </Tldraw>
    </div>
  );
}
