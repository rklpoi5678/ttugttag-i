import { useEffect, useState } from "react"
import {Link, useLoaderData, useLocation,data, type ActionFunctionArgs, type LoaderFunctionArgs, redirect} from "react-router"

import { useAuth, useUser } from "@clerk/clerk-react"
import * as schema from "~/database/schema"; // Drizzle 스키마 임포트

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input" // Input 컴포넌트를 가정하여 추가
import { Button } from "@/components/ui/button"
import {nanoid} from "nanoid"
import {
  Plus,
  Search,
  Sparkles, // 목업 아이디어에 어울리는 아이콘으로 변경
} from "lucide-react"
import NewProjectModal from "../modal/NewProjectModal"
import type { InferInsertModel } from "drizzle-orm"
import type { Route } from "./+types/dashboard.projects";
import { getAuth } from "@clerk/react-router/ssr.server";

/** Drizzle 스키마에서 타입 가져오기 */
type NewProjectData = InferInsertModel<typeof schema.userProjects>

export const action = async ({request, context}: ActionFunctionArgs) => {
  const { db , cloudflare } = context;

  if (request.method! !== 'POST') {
    throw data({ message: "메서드가 허용되지 않습니다." }, { status: 405 })
  }

  try {
    const formData = await request.formData();
    const clerkUserId = formData.get("clerkUserId") as string
    const projectName = formData.get("projectName") as string
    const projectDescription = formData.get("projectDescription") as string | null
    const selectedScreenSize = formData.get("screenSize") as string;
    const customWidth = formData.get("customWidth") as string | null
    const customHeight = formData.get("customHeight") as string | null
    const projectType = formData.get("projectType") as string
    const tags = '새 프로젝트' as string | null
    // const imageUrl = "" as string | null

    if (!clerkUserId || !projectName) {
      throw data({ message: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const newProjectId = nanoid()

    const projectToInsert: NewProjectData = {
      id: newProjectId,
      clerkUserId: clerkUserId,
      projectName: projectName,
      projectDescription: projectDescription || null,
      tldrawContent: JSON.stringify({document:{elements:[]}}), // 초기 빈 Tldraw 데이터
      screenSize: selectedScreenSize === 'custom' ? `<span class="math-inline">\{customWidth\}x</span>{customHeight}` : selectedScreenSize,
      projectType: projectType,
      tags: tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // imageUrl: "", // 당분간 사용하지 않을 예정 tldraw의 썸네일 여부확인후 수정
    };

    await db.insert(schema.userProjects).values(projectToInsert).execute()

    /** 성공시 리다이렉트 또는 성공 메시지 반환 -> 생성된 프로젝트 페이지로 이동 */
    return redirect(`/sketches/${newProjectId}`)
  } catch (error:any) {
    console.error("프로젝트 생성 중 오류 발생:", error)
    throw data({ message: "프로젝트 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

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

export async function loader(args: LoaderFunctionArgs) {
  
  const { userId } = await getAuth(args)
  
  const db = args.context.db


  /** 로그인 검증 로그인 안된경우 빈 프로젝트 목록을 반환하거나 로그인 페이지로 리다이렉트 */
  if(!userId) {
    return redirect("/login")
  }

  try {
    const userProjects = await db.query.userProjects.findMany({
      where: (project, { eq }) => eq(project.clerkUserId, userId),
      orderBy: (projects, { desc }) => desc(projects.updatedAt)
    })
    const transformedProjects = userProjects.map(project => ({
      id: project.id,
      clerkUserId: project.clerkUserId,
      name: project.projectName,
      description: project.projectDescription || '',
      // imageUrl:project.imageUrl || "https://placehold.co/400x200/FFDDC1/FF6600?text=Mockup+1",
      status: project.projectType === 'whiteboard' ? 'in-progress' : 'draft',
      lastEdited: project.updatedAt?.split('T')[0] || '',
      tags: project.tags ? project.tags.split(",") : []
    }));

    return { projects:transformedProjects}
  } catch (error) {
    console.error("Error fetching user projects:", error)
    /** 에러 발생시 빈 배열 반환 또는 적절한 에러 처리를 해준다. */
    throw new Response("Failed to load projects", {status: 500})
  }
}

export default function DesignMockupList({ loaderData }: Route.ComponentProps) {
  const location = useLocation()
  const isNewProjectModalOpen = location.pathname.endsWith('/new')
  // 실제 백엔드에서 데이터를 불러올 useState와 useEffect 주석 처리
  const { projects: initialMockups} = useLoaderData() as { projects: DesignMockup[] };
  const [mockups, setMockups] = useState<DesignMockup[]>(initialMockups)
  // const [loading, setLoading] = useState(true)
  const { user, isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  /** UI/UX 시연을 위한 가상의 목업 데이터 (초기에는 비어있게 하여 "아직 목업이 없습니다" 상태를 보여줌) */

  // 필터링 로직 (searchQuery 상태에 따라 목업을 필터링합니다.)
  const filteredMockups = mockups.filter(
    (mockup) =>
      mockup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mockup.description && mockup.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mockup.tags && mockup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  /** clerk 로그인/로그아웃 시 데이터 새로고침 */
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      
    } else if (isLoaded && !isSignedIn) {
      setMockups([])
    }
  }, [isLoaded, isSignedIn, user])

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
          <Link to="/dashboard/projects/new"> {/* 목업 생성 페이지 경로 */}
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
              <Link to="/dashboard/projects/new">
                <span className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  <p>새 목업 만들기</p>
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        // 목업 리스트 그리드 (목업이 있을 때)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredMockups.map((mockup) => (
            <Card key={mockup.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transform hover:scale-102 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link to={`/sketches/${mockup.id}`}> {/* 목업 수정 페이지로 링크 */}
                {/* <image
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
                      <Link to={`/sketches/${mockup.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
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
                      <Link to={`/sketches/${mockup.id}`}>미리보기</Link>
                    </Button>
                    {/* <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700">
                      공유
                    </Button> */}
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
      {isNewProjectModalOpen && <NewProjectModal onProjectCreated={() => {/** 프로젝트 생성 후 재검증 로직 */}} />}
    </div>
  )
}