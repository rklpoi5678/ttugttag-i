import { useCallback, useMemo, useState } from 'react';
import { useEditor } from 'tldraw';
import { uiTemplates, type UiTemplate } from '@/lib/uiTempates'; 

import type{ AiComponentProps } from '@/lib/tldraw/hooks/useAIGeneration';
import ExportCanvasButton from '@/components/sketches/ExportCanvasButton';

import { Spinner } from '@/components/sketches/ui/Spinner';

import '../../../../styles/right.elements.panel.css'; 

/** 카테고리 배경색 정의 */
const tabColors: Record<string, string> = {
    'elements': 'var(--color-blue-100)', // 요소 (연한 파랑)
    'icons': 'var(--color-yellow-100)', // 아이콘 (노랑)
    'images': 'var(--color-green-100)', // 이미지 (초록)
    'library': 'var(--color-purple-100)', // 보관함 (보라색)
    'ai': 'var(--color-red-100)', // AI (빨강)
};

/** 오픈쪽 패널이 AiComponentProps 외에 setIsAiSettingsModalOpen을 받도록 변경합니다. */
interface RightElementsPanelProps extends AiComponentProps {
    setIsAiSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightElementsPanel = ({ apiKey, setApiKey, selectedModel, setSelectedModel, isLoading, generate, setIsAiSettingsModalOpen }: RightElementsPanelProps) => {
    const editor = useEditor();
    const [searchText, setSearchText] = useState<string>(''); /** 검색어 */
    const [activeTab, setActiveTab] = useState<keyof typeof tabColors>('elements'); /** 현재 탭 */
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({}); /** 펼쳐진 카테고리 */

    const handleTemplateClick = (template: UiTemplate) => {
        if (!editor || isLoading || !apiKey) { // AI 키가 없거나 로딩 중일 때 AI 템플릿 클릭을 막습니다.
            if(template.category === 'AI Generation'){
                if (!apiKey){
                    setIsAiSettingsModalOpen(true);
                }
            }
            return; //그 외의 경우는 처리하지 않습니다.
        }

        if(template.category === 'AI Generation' && generate){
            const prompt = template.prompt || '현재 캔버스 내용을 바탕으로 새로운 디자인을 제안해줘.';
            generate(prompt, editor, true); // 현재 뷰 포함하여 AI 생성 함수 호출
            console.log(`AI Generation Triggered for template: ${template.name}`);
        } else {

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
    }

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
                <ExportCanvasButton 
                    setIsAiSettingsModalOpen={setIsAiSettingsModalOpen} 
                    apiKey={apiKey} 
                    isLoading={isLoading} 
                    generate={generate}
                    // useAiGeneration의 나머지 반환 값들도 필요하다면 여기에 전달 현재는 타입일치를 위해 더미화
                    setApiKey={() => {}} 
                    selectedModel={''} 
                    setSelectedModel={() => {}} 
                    error={null}
                    toastMessage={null}
                    clearToast={() => {}}
                />
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
                            tabKey === 'library' ? '보관함' : 
                            tabKey === 'ai' ? 'AI' : tabKey
                        }
                    </button>
                ))}
            </div>

            {/* 드롭다운 섹션 (카테고리별 템플릿 목록) */}
            <div className="panel-content-scrollable">
                {/* 🚨 AI 로딩 중 스피너 표시 (이전에 제안했던 위치) */}
                {isLoading && (
                    <div className="loading-overlay">
                        <Spinner />
                        <p>AI가 작업 중입니다...</p>
                    </div>
                )}
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
                                        disabled={isLoading || !apiKey} // AI 로딩 중 버튼 비활성화
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