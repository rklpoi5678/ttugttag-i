import { useCallback, useState } from 'react';
import { useEditor, useValue, type TLPageId, type Editor, type TLPage } from 'tldraw';
import { ShapeList } from '@/components/sketches/ShapeList';
import WireframePagesPanel from '@/components/sketches/WireframePagesPanel';
import '../../../styles/layer.panel.css'; // 경로는 실제 위치에 맞게 조정해주세요.

/**
 * @property {React.ComponentType} LayerAndWireframePanel - 레이어 및 와이어프레임 패널을 정의합니다.
 * @description 레이어 패널 및 와이어프레임 패널을 포함합니다.
 */
export function LayerAndWireframePanel() {
  const editor = useEditor();
  /** @type {['layers' | 'wireframe', React.Dispatch<React.SetStateAction<'layers' | 'wireframe'>>]} 활성 탭 상태 */
  const [activeTab, setActiveTab] = useState<'layers' | 'wireframe'>('layers');

  /** useValue 훅 대신 editor 인스턴스에서 직접 값 가져오기 */
  const layerShapeIds = useValue(
    'shapeIds',
    () => editor.getSortedChildIdsForParent(editor.getCurrentPageId()),
    [editor]
  );
  const allPages = useValue('allPages', () => editor.getPages(), [editor]);
  const currentPageId = useValue('currentPageId', () => editor.getCurrentPageId(), [editor]);

  /**
   * @function handleAddPage
   * @description 새 페이지를 생성하고 현재 페이지로 설정합니다.
   */
  const handleAddPage = useCallback(() => {
    const newPage = editor.createPage({ name: `새 페이지 ${allPages.length + 1}` });
    editor.setCurrentPage(newPage.id as TLPageId);
  }, [editor, allPages]);

  /**
   * @function handleSelectPage
   * @description 지정된 페이지 ID로 현재 페이지를 변경합니다.
   * @param {TLPageId} pageId - 변경할 페이지 ID
   */
  const handleSelectPage = useCallback((pageId: TLPageId) => {
    if(editor){
      editor.setCurrentPage(pageId);
    }
  }, [editor]);

  return (
    <div className='layer-panel'>
      <div className='layer-panel-header'>
        <div className='layer-panel-tabs'>
          <button className={`tab-button ${activeTab === 'layers' ? 'active' : ''}`} onClick={() => setActiveTab('layers')}>
            레이어
          </button>
          <button className={`tab-button ${activeTab === 'wireframe' ? 'active' : ''}`} onClick={() => setActiveTab('wireframe')}>
            와이어프레임
          </button>
        </div>
      </div>
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