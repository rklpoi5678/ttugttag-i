import { useCallback, useMemo, useState } from 'react';
import { useEditor } from 'tldraw';
import { uiTemplates, type UiTemplate } from '@/lib/uiTempates'; 

import ExportCanvasButton from './ExportCanvasButton';

import '../../../styles/right.elements.panel.css'; 

/** 카테고리 배경색 정의 */
const tabColors: Record<string, string> = {
    'elements': 'var(--color-blue-100)', // 요소 (연한 파랑)
    'icons': 'var(--color-yellow-100)', // 아이콘 (노랑)
    'images': 'var(--color-green-100)', // 이미지 (초록)
    'library': 'var(--color-purple-100)', // 보관함 (보라색)
};

const RightElementsPanel = () => {
    const editor = useEditor();
    const [searchText, setSearchText] = useState<string>(''); /** 검색어 */
    const [activeTab, setActiveTab] = useState<keyof typeof tabColors>('elements'); /** 현재 탭 */
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({}); /** 펼쳐진 카테고리 */

    const handleTemplateClick = (template: UiTemplate) => {
        if (!editor) return;

        // templateId에 따라 활성화할 도구를 결정
        let toolIdToActivate: string | null = null;
        if (template.id === 'common-button') {
            toolIdToActivate = 'my-button-tool'; // 위에서 정의한 도구 ID
        }
        // 다른 템플릿에 대한 도구 ID도 여기에 추가

        if (toolIdToActivate) {
            editor.setCurrentTool(toolIdToActivate); // 해당 도구 활성화
            console.log(`Tool '${toolIdToActivate}' activated.`);
        } else {
            console.warn(`No tool found for template ID: ${template.id}`);
        }
    };

    /** 카테고리 토글 */
    const toggleCategory = useCallback((categoryName: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    }, []);

    const filteredTemplates = useMemo(() => {
        let templatesToFilter = uiTemplates
        if(activeTab === 'elements'){
            templatesToFilter = templatesToFilter.filter(t => t.category === 'UI Controls' || t.category === 'Chart')
        } else if (activeTab === 'icons'){
            templatesToFilter = templatesToFilter.filter(template => template.category === 'icons')
        } else if (activeTab === 'images'){
            templatesToFilter = templatesToFilter.filter(template => template.category === 'images')
        } else if (activeTab === 'library'){
            templatesToFilter = templatesToFilter.filter(template => template.category === 'library')
        }

        /** 검색어에 따른 필터링 */
        if (searchText) {
            const lowerCaseSearchText = searchText.toLowerCase()
            templatesToFilter = templatesToFilter.filter(template => 
                template.name.toLowerCase().includes(lowerCaseSearchText) ||
                template.category.toLowerCase().includes(lowerCaseSearchText) ||
                template.subCategory?.toLowerCase().includes(lowerCaseSearchText)
            )
        }

        /** 그룹화 */
        const grouped: Record<string, UiTemplate[]> = {};
        templatesToFilter.forEach(template => {
            const categoryName = template.category || '기타';
            if (!grouped[categoryName]) {
                grouped[categoryName] = [];
            }
            grouped[categoryName].push(template);
        }) 
        return grouped;

    }, [searchText, activeTab, uiTemplates])
    const currentTabColor = tabColors[activeTab];

    return (
        <div className='tldraw-right-elements-panel'>
            {/* 최상단 ExportCanvasButton */}
            <div className="panel-section export-button-section">
                <ExportCanvasButton />
            </div>

            {/* 검색 기능 */}
            <div className="panel-section search-section" style={{ backgroundColor: currentTabColor }}>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="검색"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            {/* 탭 바 */}
            <div className="panel-section tab-bar-section" style={{ backgroundColor: currentTabColor }}>
                {Object.keys(tabColors).map(tabKey => (
                    <button
                        key={tabKey}
                        className={`tab-button ${activeTab === tabKey ? 'active' : ''}`}
                        onClick={() => setActiveTab(tabKey as keyof typeof tabColors)}
                    >
                        {
                            // 탭 이름 표시: 'elements' -> '요소', 'icons' -> '아이콘' 등 매핑
                            tabKey === 'elements' ? '요소' :
                            tabKey === 'icons' ? '아이콘' :
                            tabKey === 'images' ? '이미지' :
                            tabKey === 'library' ? '보관함' : tabKey
                        }
                    </button>
                ))}
            </div>

            {/* 드롭다운 섹션 (카테고리별 템플릿 목록) */}
            <div className="panel-content-scrollable">
                {Object.entries(filteredTemplates).map(([categoryName, templates]) => (
                    <div key={categoryName} className="category-section">
                        <div 
                            className="category-header" 
                            onClick={() => toggleCategory(categoryName)}
                            style={{ backgroundColor: currentTabColor }} // 배경색 적용
                        >
                            <span className="category-toggle-icon">
                                {expandedCategories[categoryName] ? '▼' : '▶'}
                            </span>
                            <h3>{categoryName}</h3>
                        </div>
                        {expandedCategories[categoryName] && (
                            <div className="templates-grid">
                                {templates.map(template => (
                                    <button
                                        key={template.id}
                                        className="template-button"
                                        onClick={() => handleTemplateClick(template)}
                                        draggable={false}
                                    >
                                        <div className="template-icon">{template.icon}</div>
                                        <div className="template-name">{template.name}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RightElementsPanel;