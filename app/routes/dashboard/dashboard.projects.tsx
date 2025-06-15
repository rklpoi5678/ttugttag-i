import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Search,
  Filter,
  Sparkles, // 목업 아이디어에 어울리는 아이콘으로 변경
  FileText, // 추가적으로 활용할 수 있는 아이콘
  LayoutGrid, // 그리드 레이아웃 관련 아이콘
} from "lucide-react"
import {Link} from "react-router"
import { useState } from "react"
import { Input } from "@/components/ui/input" // Input 컴포넌트를 가정하여 추가


// 목업 데이터 타입을 정의합니다. (실제 프로젝트에서는 별도 파일에 정의)
interface DesignMockup {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  lastEdited: string; // ISO 8601 형식 날짜 문자열
  tags: string[];
}

export default function DesignMockupList() {
  // 실제 백엔드에서 데이터를 불러올 useState와 useEffect 주석 처리
  // const [mockups, setMockups] = useState<DesignMockup[]>([])
  // const [loading, setLoading] = useState(true)
  // const [searchQuery, setSearchQuery] = useState("")

  // UI/UX 시연을 위한 가상의 목업 데이터 (초기에는 비어있게 하여 "아직 목업이 없습니다" 상태를 보여줌)
  const [mockups, setMockups] = useState<DesignMockup[]>([
    {
      id: "1",
      name: "뚝딱이 메인 페이지 V1",
      description: "사용자 온보딩 및 핵심 기능 소개",
      imageUrl: "https://placehold.co/400x200/FFDDC1/FF6600?text=Mockup+1",
      status: "in-progress",
      lastEdited: "2025-06-14",
      tags: ["웹", "랜딩페이지"]
    },
    {
      id: "2",
      name: "모바일 앱 - 로그인 화면",
      description: "간결한 로그인/회원가입 UI",
      imageUrl: "https://placehold.co/400x200/C1E1FF/0066FF?text=Mockup+2",
      status: "draft",
      lastEdited: "2025-06-12",
      tags: ["모바일", "인증"]
    },
    {
      id: "3",
      name: "관리자 대시보드 - 통계",
      description: "핵심 데이터 시각화",
      imageUrl: "https://placehold.co/400x200/D1FFC1/00CC00?text=Mockup+3",
      status: "completed",
      lastEdited: "2025-06-10",
      tags: ["웹", "관리자"]
    },
    {
      id: "4",
      name: "서비스 이용약관 페이지",
      description: "약관 및 개인정보 처리방침",
      imageUrl: "https://placehold.co/400x200/F1F1F1/333333?text=Mockup+4",
      status: "archived",
      lastEdited: "2025-05-01",
      tags: ["웹", "정보"]
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // 필터링 로직 (searchQuery 상태에 따라 목업을 필터링합니다.)
  const filteredMockups = mockups.filter(
    (mockup) =>
      mockup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  // 목업 상태에 따른 색상 정의
  const getStatusColor = (status: DesignMockup['status']) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-500 text-white"; // 진행 중: 파란색 강조
      case "draft":
        return "bg-yellow-500 text-white"; // 초안: 노란색 경고
      case "completed":
        return "bg-green-500 text-white"; // 완료: 초록색 성공
      case "archived":
        return "bg-gray-500 text-white"; // 아카이브: 회색
      default:
        return "bg-gray-500 text-white";
    }
  };

  // 목업이 없을 때의 로딩 상태는 생략 (로딩 스켈레톤은 필요 시 주석 해제하여 활용)
  // if (loading) { ... }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"> {/* 전체 배경색 및 패딩 조정 */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">나의 디자인 목업</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">당신의 아이디어를 빠르고 쉽게 시각화하고 관리하세요.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"> {/* 버튼 스타일 조정 */}
          <Link to="/sketches"> {/* 목업 생성 페이지 경로 */}
            새 목업 만들기
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md"> {/* 너비 조정 */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" /> {/* 아이콘 크기 조정 */}
          <Input
            placeholder="목업 검색 (이름, 설명, 태그)..." // 플레이스홀더 변경
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Products/Mockups Grid */}
      {filteredMockups.length === 0 ? (
        // "아직 목업이 없습니다" 상태
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-8">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-20 w-20 text-blue-500 dark:text-blue-400 mx-auto mb-6 opacity-80" /> {/* 아이콘 변경 및 스타일 */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">아직 디자인 목업이 없습니다</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">첫 번째 아이디어를 시각화하고 검증을 시작하세요!</p>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/designs/new">
                <Plus className="mr-2 h-5 w-5" />
                새 목업 만들기
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        // 목업 리스트 그리드 (목업이 있을 때)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredMockups.map((mockup) => (
            <Card key={mockup.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transform hover:scale-102 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to={`/designs/${mockup.id}/edit`}> {/* 목업 수정 페이지로 링크 */}
                {/* <img
                  src={mockup.imageUrl}
                  alt={mockup.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/400x200/E0E0E0/666666?text=No+Preview"; }} // 이미지 오류 시 대체
                /> */}
              </Link>
              <CardContent className="p-4 flex flex-col justify-between h-48"> {/* 내용 높이 고정 */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                      <Link to={`/designs/${mockup.id}/edit`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                        {mockup.name}
                      </Link>
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(mockup.status)}`}>
                      {mockup.status === 'draft' ? '초안' :
                       mockup.status === 'in-progress' ? '진행 중' :
                       mockup.status === 'completed' ? '완료' :
                       mockup.status === 'archived' ? '아카이브' : '알 수 없음'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate"> {/* 설명 한 줄로 제한 */}
                    {mockup.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mockup.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>최근 수정: {mockup.lastEdited}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="p-1 h-auto text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700">
                      <Link to={`/designs/${mockup.id}/preview`}>미리보기</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700">
                      공유
                    </Button>
                    {/* 추가 액션 메뉴 (예: 삭제, 복사)는 드롭다운 컴포넌트 사용 */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{mockups.length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">전체 목업</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{mockups.filter(m => m.status === 'in-progress').length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">진행 중인 목업</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{mockups.filter(m => m.status === 'completed').length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">완료된 목업</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{mockups.filter(m => m.status === 'draft').length}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">초안 목업</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}