import { useState, useCallback, useEffect, useRef } from 'react';
import { Editor, getSvgAsImage } from 'tldraw';

/**
 * @typedef {Object} AiComponentProps - AI 관련 컴포넌트들이 받을 props의 타입 정의
 * @property {string | null} apiKey - 현재 설정된 Gemini API 키입니다.
 * @property {React.Dispatch<React.SetStateAction<string | null>>} setApiKey - API 키를 설정하는 함수입니다.
 * @property {string} selectedModel - 현재 선택된 Gemini 모델입니다.
 * @property {React.Dispatch<React.SetStateAction<string>>} setSelectedModel - 모델을 설정하는 함수입니다.
 * @property {boolean} isLoading - AI 생성 작업이 진행 중인지 여부를 나타냅니다.
 * @property {string | null} error - AI 생성 중 발생한 에러 메시지입니다.
 * @property {string | null} toastMessage - 사용자에게 표시할 토스트 메시지입니다.
 * @property {() => void} clearToast - 토스트 메시지를 지우는 함수입니다.
 * @property {(prompt: string, editor: Editor, includeCurrentView?: boolean) => Promise<void>} generate - AI 생성을 트리거하는 함수입니다.
 */
export type AiComponentProps = {
  apiKey: string | null;
  setApiKey: React.Dispatch<React.SetStateAction<string | null>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  error: string | null;
  toastMessage: string | null;
  clearToast: () => void;
  generate: (prompt: string, editor: Editor, includeCurrentView?: boolean) => Promise<void>;
};

/**
 * @function useAIGeneration
 * @description
 * Tldraw 에디터 내에서 AI (Gemini) 기반 콘텐츠 생성을 관리하는 커스텀 훅입니다.
 * API 키 관리, 모델 선택, 로딩/에러 상태, 토스트 알림 및 AI 호출 로직을 포함합니다.
 * @returns {AiComponentProps} AI 생성 관련 상태 및 함수들
 */
export function useAIGeneration(): AiComponentProps {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.0-flash');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const clearToast = useCallback(() => {
    setToastMessage(null);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
  }, []);

  const showToast = useCallback((message: string, duration: number = 3000) => {
    clearToast();
    setToastMessage(message);
    toastTimer.current = setTimeout(clearToast, duration);
  }, [clearToast]);

  const generate = useCallback(async (prompt: string, editor: Editor, includeCurrentView: boolean = false) => {
    if (isLoading) return;

    if (!apiKey) {
      setError('Gemini API 키가 설정되지 않았습니다.');
      showToast('API 키가 필요합니다!', 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    clearToast();

    try {
      let base64ImageData: string | null = null;
      if (includeCurrentView) {
        const svg = await editor.getSvg([editor.currentPageId]); // editor.get 대신 editor.getSvg 사용
        if (svg) {
          const img = await getSvgAsImage(svg, editor.background, {
            type: 'png',
            quality: 0.8,
            scale: 1,
          });
          if (img) {
            base64ImageData = img.src.split(',')[1];
          }
        }
      }

      let contentsParts: any[] = [{ text: prompt }];

      if (base64ImageData) {
        contentsParts = [
          { text: prompt },
          { inlineData: { mimeType: "image/png", data: base64ImageData } }
        ];
      }

      const payload = {
        contents: [{ role: "user", parts: contentsParts }],
        generationConfig: {}
      };

      const API_KEY = apiKey;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${API_KEY}`;

      showToast('AI가 아이디어를 생성 중입니다...', 0);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'AI 응답 오류');
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;

        editor.createShape({
          type: 'text',
          x: editor.viewport.center.x - 100,
          y: editor.viewport.center.y,
          props: {
            text: text,
            w: 200,
            h: 50,
          }
        });
        showToast('아이디어 생성 완료!', 3000);
      } else {
        setError('AI 응답이 유효하지 않습니다.');
        showToast('AI 응답 오류!', 3000);
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError(err.message || 'AI 생성 중 알 수 없는 오류 발생');
      showToast(`오류: ${err.message || '알 수 없는 오류'}`, 5000);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, selectedModel, isLoading, showToast, clearToast]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  return {
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
    isLoading,
    error,
    toastMessage,
    clearToast,
    generate,
  };
}