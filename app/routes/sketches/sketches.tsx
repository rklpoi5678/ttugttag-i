import { useCallback, useRef, useState } from 'react';
import { Tldraw, useEditor, useValue, Editor, createShapeId} from 'tldraw';
import { type TLComponents, type TLPageId, type TLFrameShape, Box } from 'tldraw';

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

const CUSTOM_CANVAS_WIDTH = 1920; // 예시: 웹 디자인을 위한 1920px 너비
const CUSTOM_CANVAS_HEIGHT = 1080; // 예시: 1080px 높이
const INITIAL_VIEW_PADDING = 100; // 초기 줌 시 캔버스 내용 주위의 여백

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

const customTools = [MyButtonTool]
const customShapeUtil = [MyShapeUtil]

export default function ProjectEditorPage() {
  const assetUrls = getAssetUrlsByMetaUrl();
  const editorRef = useRef<Editor | null>(null);
  const tldrawContainerRef = useRef<HTMLDivElement>(null); // Tldraw를 감싸는 div 참조

  const handleTldrawMount = useCallback((e: Editor) => {
    editorRef.current = e;
    console.log("Tldraw editor mounted.");
    const customCanvasBounds: Box = new Box(
      0,                  // x 좌표
      0,                  // y 좌표
      CUSTOM_CANVAS_WIDTH,  // 너비 (w)
      CUSTOM_CANVAS_HEIGHT  // 높이 (h)
    );

    e.setCameraOptions({
      constraints: {
        // 'contain': 카메라(뷰포트)가 정의된 bounds 안에 항상 내용을 포함하도록 제한합니다.
        //           사용자가 bounds 밖으로 패닝하는 것을 제한하는 데 도움이 됩니다.
        behavior: 'contain',
        bounds: customCanvasBounds, // 제약을 적용할 영역
        initialZoom: 'fit-max',
        baseZoom: 'fit-max',
        origin: { x: 0.5, y: 0.5 },
        padding: { x: INITIAL_VIEW_PADDING, y: INITIAL_VIEW_PADDING },
      },
    });

    e.zoomToBounds(customCanvasBounds, {
      force: true,
      animation: { duration: 500 }
    });

    // 사용자가 작업할 영역을 명확히 보여주기 위해 프레임 셰이프를 추가합니다.
    // 이는 '시각적인' 가이드이며, 실제 그리기 영역을 하드 제한하지는 않습니다.
    const currentPageId = e.getCurrentPageId();
    const frameId = createShapeId('main-canvas-area-frame'); // 고유 ID

    // 해당 프레임이 아직 없으면 생성합니다.
    if (!e.getShape(frameId)) {
        e.createShape<TLFrameShape>({
            id: frameId,
            parentId: currentPageId, // 현재 페이지에 추가
            type: 'frame', // 프레임 타입 셰이프
            x: 0, // 캔버스의 (0,0)에 위치
            y: 0,
            props: {
                name: '작업 영역',
                w: CUSTOM_CANVAS_WIDTH,
                h: CUSTOM_CANVAS_HEIGHT,
            },
        });
    }

  }, [CUSTOM_CANVAS_WIDTH, CUSTOM_CANVAS_HEIGHT, INITIAL_VIEW_PADDING]); // useCallback 의존성 배열에 상수 추가


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
        onMount={handleTldrawMount}
        // snapshot={snapshot as any as TLEditorSnapshot}
      >
      </Tldraw>
    </div>
  );
}
