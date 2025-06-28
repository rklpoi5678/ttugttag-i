// 목업 데이터 타입을 정의합니다. (실제 프로젝트에서는 별도 파일에 정의)
export interface DesignMockup {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    status: 'draft' | 'in-progress' | 'completed' | 'archived';
    lastEdited: string; // ISO 8601 형식 날짜 문자열
    tags: string[];
  }