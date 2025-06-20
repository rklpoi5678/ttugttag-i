// src/components/sketches/RightElementsPanel.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, createShapeId } from 'tldraw';

// uiTemplates 임포트 경로 통일 (src/utils/uiTemplates.ts에 정의되어 있다고 가정)
import { uiTemplates, type UiTemplate, mainCategories, getSubCategories } from '@/components/sketches/uiTempates'; 

// ExportCanvasButton 임포트
import ExportCanvasButton from './ExportCanvasButton';

// CSS 파일 임포트
import '../../../styles/right.elements.panel.css'; 

const RightElementsPanel: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<string>(mainCategories[0] || 'UI Controls');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // UI 템플릿 드래그 시작 시 호출될 함수
    const handleDragStart = useCallback((e: React.DragEvent, template: UiTemplate) => {
        e.dataTransfer.setData('tldraw/template', JSON.stringify(template));
        e.dataTransfer.effectAllowed = 'copy';

        const dragImage = new Image();
        dragImage.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">` +
            `<rect x="0" y="0" width="40" height="40" rx="8" ry="8" fill="rgba(0,0,0,0.5)" stroke="white" stroke-width="1.5"/>` +
            `<text x="20" y="28" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${template.icon}</text>` +
            `</svg>`
        );
        e.dataTransfer.setDragImage(dragImage, 20, 20);
        // !!! 중요 디버깅 포인트 !!!
        console.log('Drag Start: Setting dataTransfer with:', e.dataTransfer.types, e.dataTransfer.getData('tldraw/template'));
    }, []);

    // 활성 서브 탭과 검색어에 따라 필터링된 템플릿 목록 계산
    const filteredTemplates = uiTemplates.filter(template => {
        const matchesCategory = template.category === activeSubTab || (template.subCategory && template.subCategory === activeSubTab);
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 이제 activeMainPanelTab 조건 없이 직접 필터링
        return matchesCategory && matchesSearch;
    });

    // activeSubTab이 유효하지 않은 경우 초기화 (이제 항상 'elements' 탭이므로, activeMainPanelTab 의존성 제거)
    useEffect(() => {
        if (!mainCategories.includes(activeSubTab)) {
            const firstMainCategory = mainCategories[0];
            if (firstMainCategory) {
                setActiveSubTab(firstMainCategory);
            }
        }
    }, [activeSubTab]); // activeMainPanelTab 의존성 제거

    return (
        <div className='tldraw-right-elements-panel'>
            
            {/* ExportCanvasButton은 여기서 직접 렌더링 */}
            {/* 클래스 추가하여 간격 조정 (CSS에서 정의) */}
            <ExportCanvasButton />

            {/* 메인 패널 탭 (이제 '요소' 탭만 남음) */}
            <div className="main-panel-tabs-container">
                <button 
                    className="main-panel-tab active" // 항상 활성 상태
                    // onClick 핸들러 제거 (탭 전환 로직 불필요)
                >
                    요소 (Elements)
                </button>
                {/* 미디어, 이미지, 보관함 탭은 제거됨 */}
            </div>
            
            {/* 검색창 */}
            <div className="template-search-bar">
                <input
                    type="text"
                    placeholder="검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='search-input'
                />
                <span className="search-icon">🔍</span>
            </div>

            {/* --- '요소' 탭 콘텐츠만 항상 렌더링 --- */}
            <>
                {/* 메인 카테고리 탭 (UI Controls, Icons, Images, Templates) */}
                <div className="template-main-category-tabs">
                    {mainCategories.map(cat => (
                        <button
                            key={cat}
                            className={`category-tab-button ${activeSubTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveSubTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                {/* 서브 카테고리 탭 (Common, Forms, iOS 등) */}
                {activeSubTab === 'UI Controls' && getSubCategories('UI Controls').length > 0 && (
                    <div className="template-sub-tabs-container-inner">
                        <div className="template-sub-tabs">
                            {getSubCategories('UI Controls').map(subCat => (
                                <button
                                    key={subCat}
                                    className={`sub-tab-button ${activeSubTab === subCat ? 'active' : ''}`}
                                    onClick={() => setActiveSubTab(subCat)}
                                >
                                    {subCat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* UI 템플릿 목록 */}
                <div className="ui-templates-grid-container">
                    {filteredTemplates.length > 0 ? (
                        filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="ui-template-item"
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, template)}
                            >
                                <span className="ui-template-icon">{template.icon}</span>
                                <span className="ui-template-name">{template.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">검색 결과가 없습니다.</p>
                    )}
                </div>
            </>
            {/* --- '요소' 탭 콘텐츠 렌더링 끝 --- */}

        </div>
    );
};

export default RightElementsPanel;