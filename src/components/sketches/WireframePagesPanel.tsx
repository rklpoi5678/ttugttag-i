import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Editor, type TLPage, type TLPageId, type TLRecord, useValue } from 'tldraw'; 
import { Pencil, Trash2, Star, Plus} from 'lucide-react';

interface WireframePagesPanelProps {
    editor: Editor;
    allPages: TLPage[];
    currentPageId: TLPageId | null;
    onPageSelect: (pageId: TLPageId) => void;
    onAddPage: () => void;
}

const WireframePagesPanel: React.FC<WireframePagesPanelProps> = ({
    editor,
    allPages,
    currentPageId,
    onPageSelect,
    onAddPage,
}) => {
    // pageThumbnails는 이제 UI 렌더링에만 사용하고, 실제 캐시는 useRef로 관리합니다.
    const [pageThumbnails, setPageThumbnails] = useState<Record<string, string>>({});
    const [editingPageId, setEditingPageId] = useState<TLPageId | null>(null);
    const [editingPageName, setEditingPageName] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    // useRef를 컴포넌트 최상위 레벨로 이동
    const thumbnailUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); 
    // 썸네일 데이터 캐시 (useRef로 관리하여 리렌더링을 유발하지 않음)
    const thumbnailCache = useRef<Record<string, string>>({});
    // 마지막으로 썸네일을 생성한 페이지 ID를 추적 (useRef로 관리)
    const lastGeneratedThumbnailPageIdRef = useRef<TLPageId | null>(null);


    const thumbnailWidth = 120;
    const thumbnailHeight = 180;

    const blankCanvasSvg = `
        <svg viewBox="0 0 ${thumbnailWidth} ${thumbnailHeight}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <rect x="0" y="0" width="${thumbnailWidth}" height="${thumbnailHeight}" fill="#f8f8f8" stroke="#e0e0e0" stroke-width="1"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="10" fill="#a0a0a0" text-anchor="middle" dominant-baseline="middle">
                비어있는 페이지
            </text>
        </svg>
    `;
    const blankCanvasSvgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(blankCanvasSvg)}`;

    // useValue 콜백을 최대한 단순하게 유지
    const instanceState = useValue('instanceState', () => editor ? editor.getInstanceState() : null, [editor]);

    // instanceState에서 필요한 속성들을 안전하게 추출
    const isEditing = instanceState ? (typeof (instanceState as any).editingShapeId !== 'undefined' && (instanceState as any).editingShapeId !== null) : false;
    const isTranslating = instanceState ? (typeof (instanceState as any).isTranslating !== 'undefined' && (instanceState as any).isTranslating) : false;
    
    let currentToolId: string | null = null;
    if (editor && editor.getCurrentToolId) {
        currentToolId = editor.getCurrentToolId();
    } else if (instanceState && typeof (instanceState as any).currentToolId !== 'undefined') {
        currentToolId = (instanceState as any).currentToolId;
    }
    
    const isDrawing = currentToolId === 'draw';

    // 썸네일 생성 로직 - 이제 pageThumbnails를 직접 업데이트하지 않고, 캐시를 업데이트합니다.
    const generateThumbnail = useCallback(async (pageId: TLPageId) => {
        if (!editor || !pageId) return;

        // 여기서는 캐시를 직접 확인하여 불필요한 SVG 생성 방지
        // (단, 내용 변경 감지는 별도의 메커니즘이 필요할 수 있습니다.
        // Tldraw는 변경된 내용에 대한 해시나 타임스탬프를 제공하지 않는 한 어렵습니다.)
        if (lastGeneratedThumbnailPageIdRef.current === pageId && thumbnailCache.current[pageId]) {
            // console.log(`[generateThumbnail] Cached thumbnail for page ${pageId} is recent.`);
            return;
        }

        const originalPageId = editor.getCurrentPageId();
        editor.setCurrentPage(pageId); 

        const shapeIdsOnPage = editor.getSortedChildIdsForParent(pageId);
        
        let svgResult;
        if (shapeIdsOnPage.length > 0) {
            svgResult = await editor.getSvgString(shapeIdsOnPage);
        }

        let newThumbnailData = blankCanvasSvgDataUrl;
        if (svgResult?.svg) {
            newThumbnailData = `data:image/svg+xml;utf8,${encodeURIComponent(svgResult.svg)}`;
        }

        // 캐시 업데이트
        if (thumbnailCache.current[pageId] !== newThumbnailData) {
            thumbnailCache.current = {
                ...thumbnailCache.current,
                [pageId]: newThumbnailData,
            };
            // UI를 업데이트하기 위해 pageThumbnails 상태도 업데이트합니다.
            // 이로 인해 리렌더링이 발생하지만, generateThumbnail의 의존성에는 pageThumbnails가 없으므로
            // 무한 루프는 발생하지 않을 것입니다.
            setPageThumbnails(prev => ({
                ...prev,
                [pageId]: newThumbnailData,
            }));
            // console.log(`[generateThumbnail] Updated thumbnail for page ${pageId}`);
        } else {
             // console.log(`[generateThumbnail] Thumbnail data for page ${pageId} is the same, skipping state update.`);
        }


        editor.setCurrentPage(originalPageId);
        lastGeneratedThumbnailPageIdRef.current = pageId; 
    }, [editor, blankCanvasSvgDataUrl]); // pageThumbnails를 의존성에서 제거!

    // 모든 페이지의 초기 썸네일 생성 (컴포넌트 마운트 시)
    useEffect(() => {
        if (!editor) return;

        allPages.forEach(page => {
            generateThumbnail(page.id);
        });
    }, [editor, allPages, generateThumbnail]);

    // Tldraw의 상태 변화에 따라 썸네일 업데이트를 트리거
    useEffect(() => {
        if (!editor) return;

        const currentActivePageId = editor.getCurrentPageId();

        // 페이지 전환 시 즉시 업데이트
        if (currentPageId && lastGeneratedThumbnailPageIdRef.current !== currentPageId) {
            if (thumbnailUpdateTimerRef.current) {
                clearTimeout(thumbnailUpdateTimerRef.current);
            }
            generateThumbnail(currentPageId);
        }

        const unsub = editor.store.listen(
            ({ changes }) => {
                let relevantChangeHappened = false;

                // 인스턴스 변경 감지 (예: active tool 변경, isTranslating 변경 등)
                // if (changes.updated.hasOwnProperty('instance')) {
                //     relevantChangeHappened = true;
                // }

                // 도형 추가/삭제
                if (Object.values(changes.added).some(r => r.typeName === 'shape') ||
                    Object.values(changes.removed).some(r => r.typeName === 'shape')) {
                    relevantChangeHappened = true;
                }

                // 도형 속성 변경 또는 페이지 이름 변경
                for (const [, [oldRecord, newRecord]] of Object.entries(changes.updated)) {
                    if (newRecord.typeName === 'shape') {
                        // 변경된 도형이 현재 페이지에 속하는 경우
                        // @ts-ignore (parentId는 모든 TLRecord에 있는 것은 아님)
                        if ((newRecord as any).parentId === currentActivePageId) { 
                            relevantChangeHappened = true;
                            break; 
                        }
                    } else if (newRecord.typeName === 'page' && newRecord.id === currentActivePageId) {
                        // 현재 페이지의 메타데이터 변경 (예: 이름 변경)
                        relevantChangeHappened = true;
                        break;
                    }
                }

                // 관련 변경이 있었고, 현재 에디터가 어떤 활성 편집 모드도 아닐 때만 썸네일 업데이트 트리거
                if (relevantChangeHappened && !isEditing && !isTranslating && !isDrawing) {
                    if (thumbnailUpdateTimerRef.current) {
                        clearTimeout(thumbnailUpdateTimerRef.current);
                    }
                    thumbnailUpdateTimerRef.current = setTimeout(() => {
                        // 디바운스 후 최종 확인: 여전히 편집 모드가 아닌지 확인
                        const latestInstanceState: any = editor.getInstanceState();
                        const latestIsEditing = typeof latestInstanceState.editingShapeId !== 'undefined' && latestInstanceState.editingShapeId !== null;
                        const latestIsTranslating = typeof latestInstanceState.isTranslating !== 'undefined' && latestInstanceState.isTranslating;
                        
                        let latestCurrentToolId: string | null = null;
                        if (editor.getCurrentToolId) {
                            latestCurrentToolId = editor.getCurrentToolId();
                        } else if (typeof latestInstanceState.currentToolId !== 'undefined') {
                            latestCurrentToolId = latestInstanceState.currentToolId;
                        }
                        const latestIsDrawing = latestCurrentToolId === 'draw';

                        // 최종 확인 후에도 유휴 상태라면 썸네일 생성
                        if (!latestIsEditing && !latestIsTranslating && !latestIsDrawing) {
                            generateThumbnail(currentActivePageId);
                        }
                    }, 300);
                }
            },
            { scope: 'document' }
        );

        // useEffect 클린업
        return () => {
            if (thumbnailUpdateTimerRef.current) {
                clearTimeout(thumbnailUpdateTimerRef.current);
            }
            unsub();
        };
    }, [
        editor, 
        currentPageId, 
        generateThumbnail, 
        isEditing, 
        isTranslating, 
        isDrawing
    ]);
    
    const handleStartEditing = (page: TLPage) => {
        setEditingPageId(page.id);
        setEditingPageName(page.name || '');
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 0);
    };

    const handleSavePageName = (pageId: TLPageId) => {
        if (!editor || editingPageName.trim() === '') {
            setEditingPageId(null);
            return;
        }

        const currentPageRecord = editor.getPage(pageId);
        if (currentPageRecord && currentPageRecord.name !== editingPageName) {
            editor.updatePage({ id: pageId, name: editingPageName });
        }
        setEditingPageId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, pageId: TLPageId) => {
        if (e.key === 'Enter') {
            handleSavePageName(pageId);
        } else if (e.key === 'Escape') {
            setEditingPageId(null);
        }
    };

    const handleDeletePage = (pageId: TLPageId) => {
        if (!editor) return;

        if (window.confirm('정말로 이 페이지를 삭제하시겠습니까?')) {
            editor.deletePage(pageId);
            setPageThumbnails(prev => {
                const newThumbnails = { ...prev };
                delete newThumbnails[pageId];
                return newThumbnails;
            });
            // 캐시에서도 삭제
            if (thumbnailCache.current[pageId]) {
                const newCache = { ...thumbnailCache.current };
                delete newCache[pageId];
                thumbnailCache.current = newCache;
            }

            const remainingPages = editor.getPages().filter(p => p.id !== pageId);
            if (remainingPages.length > 0) {
                editor.setCurrentPage(remainingPages[0].id);
            } else {
                editor.createPage({ name: '새로운 빈 페이지' });
            }
        }
    };

    /** 페이지가 하나 이상이면 삭제 버튼 표시(예외 사항 방지) */
    const showDeleteButton = allPages.length > 1;
    return (
        <div className="wireframe-pages-list">
            {allPages.map((page: TLPage, index: number) => (
                <div
                    key={page.id}
                    className={`page-preview-item ${currentPageId === page.id ? 'active-page' : ''}`}
                    onClick={() => onPageSelect(page.id)}
                    draggable={false}
                >
                    <div className="page-thumbnail-placeholder">
                        {/* 썸네일은 pageThumbnails 상태에서 가져오도록 유지 */}
                        <img
                            src={pageThumbnails[page.id] || blankCanvasSvgDataUrl}
                            alt={`Page ${index + 1} thumbnail`}
                            className="page-thumbnail-img"
                            draggable={false}
                        />
                    </div>
                    {editingPageId === page.id ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={editingPageName}
                            onChange={(e) => setEditingPageName(e.target.value)}
                            onBlur={() => handleSavePageName(page.id)}
                            onKeyDown={(e) => handleKeyDown(e, page.id)}
                            className="page-name-input"
                        />
                    ) : (
                        <span className="page-name" onDoubleClick={() => handleStartEditing(page)}>
                            {index + 1}. {page.name || '(이름 없음)'}
                        </span>
                    )}
                    <div className="page-action-buttons-group">
                        <button
                            className="page-action-button edit-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditing(page);
                            }}
                            title="이름 수정"
                        >
                            <Pencil size={16}/>
                        </button>
                        {showDeleteButton && 
                        <button
                            className="page-action-button delete-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePage(page.id);
                            }}
                            title="페이지 삭제"
                        >
                            <Trash2 size={16}/>
                        </button>
                        }
                    </div>
                </div>
            ))}
            <button
                className="add-page-button"
                onClick={onAddPage}
            >
                <Plus size={16}/> 페이지 추가
            </button>
        </div>
    );
};

export default WireframePagesPanel;