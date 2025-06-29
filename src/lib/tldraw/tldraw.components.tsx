import { DefaultKeyboardShortcutsDialog, DefaultKeyboardShortcutsDialogContent, DefaultToolbar, DefaultToolbarContent, TldrawUiMenuItem, useIsToolSelected, useTools, type TLComponents } from 'tldraw'
import { LayerAndWireframePanel } from '@/components/sketches/LayerAndWireframePanel'
import { SlidesPanel } from '@/components/sketches/SlidesPanel'
import RightElementsPanel from '@/components/sketches/ui/RightSidePanel'
import { useMemo, useState } from 'react';

/**
 * @typedef {Object} CreateCustomComponentsProps
 * @property {ReturnType<typeof import('@/lib/tldraw/hooks/useAIGeneration').useAIGeneration>} aiGeneration - useAIGeneration 훅의 반환값입니다.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsAiSettingsModalOpen - AI 설정 모달 열림/닫힘 상태를 설정하는 함수
 */

interface CreateCustomComponentsProps {
  aiGeneration: ReturnType<typeof import('@/lib/tldraw/hooks/useAIGeneration').useAIGeneration>;
  setIsAiSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Tldraw UI 컴포넌트들을 오버라이드하여 사용자 정의 기능을 추가하는 함수입니다.
 * useMemo를 사용하여 객체를 동적으로 생성하고 AI props를 전달합니다.
 * @param {CreateCustomComponentsProps} props - AI 관련 props 및 모달 상태 설정 함수를 포함합니다.
 * @returns {TLComponents} 사용자 정의 TLComponents 객체
 */
export const createCustomComponents = ({ aiGeneration, setIsAiSettingsModalOpen }: CreateCustomComponentsProps): TLComponents => {

  return {
    QuickActions: null, // AI QuickActions를 사용하려면 여기에 CustomQuickActions 컴포넌트 추가
    MenuPanel: null,   // AI MenuPanel을 사용하려면 여기에 CustomMenuPanel 컴포넌트 추가
    Minimap: null,
    // AI 설정 모달을 위한 컴포넌트
    StylePanel: () => <RightElementsPanel {...aiGeneration} setIsAiSettingsModalOpen={setIsAiSettingsModalOpen} />,
    SharePanel: null,
    // HelperButtons는 이전과 동일
    HelperButtons: SlidesPanel,
    Toolbar(props) {
      const tools = useTools();
      const isSlideSelected = useIsToolSelected(tools['slide']);
      return (
        <DefaultToolbar {...props}>
          <TldrawUiMenuItem {...tools['slide']} isSelected={isSlideSelected} />
          <DefaultToolbarContent />
        </DefaultToolbar>
      );
    },
    KeyboardShortcutsDialog: (props) => {
      const tools = useTools();
      return (
        <DefaultKeyboardShortcutsDialog {...props}>
          <TldrawUiMenuItem {...tools['slide']} />
          <DefaultKeyboardShortcutsDialogContent />
        </DefaultKeyboardShortcutsDialog>
      );
    },
    InFrontOfTheCanvas: LayerAndWireframePanel,
  };
};