import { useCallback, useState } from 'react';
import { useEditor, useValue, type TLPageId, type Editor, type TLPage } from 'tldraw';
import { ShapeList } from '@/components/sketches/ShapeList';
import WireframePagesPanel from '@/components/sketches/WireframePagesPanel';
import '../../../styles/layer.panel.css'; // 경로는 실제 위치에 맞게 조정해주세요.

export function LayerAndWireframePanel() {
  const editor = useEditor();
  const [activeTab, setActiveTab] = useState<'layers' | 'wireframe'>('layers');

  const layerShapeIds = useValue(
    'shapeIds',
    () => editor.getSortedChildIdsForParent(editor.getCurrentPageId()),
    [editor]
  );

  const allPages = useValue('allPages', () => editor.getPages(), [editor]);
  const currentPageId = useValue('currentPageId', () => editor.getCurrentPageId(), [editor]);

  const handleAddPage = useCallback(() => {
    const newPage = editor.createPage({ name: `새 페이지 ${allPages.length + 1}` });
    editor.setCurrentPage(newPage.id as TLPageId);
  }, [editor, allPages]);

  const handleSelectPage = useCallback((pageId: TLPageId) => {
    editor.setCurrentPage(pageId);
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
        {activeTab === 'layers' && <ShapeList shapeIds={layerShapeIds} depth={0} />}
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