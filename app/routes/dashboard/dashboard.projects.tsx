import { useEffect, useState } from "react"
import { Link, useLoaderData, useLocation, useFetcher, data, redirect} from "react-router"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

/** Clerk 관련 임포트*/
import { getAuth } from "@clerk/react-router/ssr.server"; // 서버 사이드 (loader, action)
import { useUser } from "@clerk/clerk-react" // 클라이언트 사이드 (components)

/** Drizzle ORM 및 스키마 임포트*/
import * as schema from "~/database/schema"; // Drizzle 스키마 임포트
import type { InferInsertModel} from "drizzle-orm" // Drizzle 타입 임포트

/** 유틸리티 임포트 */
import {nanoid} from "nanoid"

/** UI 컴포넌트 임포트 */
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input" // Input 컴포넌트를 가정하여 추가
import { Button } from "@/components/ui/button"

/** 루시드 아이콘 임포트 */
import {
  Plus,
  Search,
  Sparkles, // 목업 아이디어에 어울리는 아이콘으로 변경
} from "lucide-react"

/** 모달 컴포넌트 임포트 */
import NewProjectModal from "../modal/NewProjectModal"
/** 대시보드 통계 요약 컴포넌트 임포트 */
import StatsSummary from "@/components/dashboard/StatsSummary";

/** 타입 정의 */
import type { DesignMockup } from "@/lib/dashboard/project";

/** Drizzle 스키마에서 새로운 프로젝트 데이터 타입 추론 */
type NewProjectData = InferInsertModel<typeof schema.userProjects>

/**
 * Remix Action함수: 새 프로젝트 생성 요청을 처리합니다.
 * POST 요청만 허용하며, 폼 데이터를 받아 데이터베이스에 새 프로젝트를 삽입
 * @param {ActionFunctionArgs} args - Remix 액션 인자 
 * @returns {Response} - 성공시 리다이렉트, 실패시 에러 응답
 */
export const action = async (args: ActionFunctionArgs) => {
  const { db } = args.context; 

  /** POST 메서드만 허용 */
  if (args.request.method !== 'POST') {
    throw data({ message: "허용되지 않는 메서드입니다." }, { status: 405 })
  }

  try {
    const formData = await args.request.formData();
    const clerkUserId = formData.get("clerkUserId") as string
    const projectName = formData.get("projectName") as string
    const projectDescription = formData.get("projectDescription") as string | null
    const selectedScreenSize = formData.get("screenSize") as string;
    const customWidthStr = formData.get("customWidth") as string | null
    const customHeightStr = formData.get("customHeight") as string | null
    const projectType = formData.get("projectType") as string
    const tags = '새 프로젝트' as string | null

    /** 필수 정보 누락 여부 검증 */
    if (!clerkUserId || !projectName) {
      throw data({ message: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const newProjectId = nanoid()

    let canvasWidth: number | null = null;
    let canvasHeight: number | null = null;

    /** 선택된 화면 크게에 따라 캔버스 너비,높이 설정 */
    if (selectedScreenSize === 'custom') {
      canvasWidth = customWidthStr ? parseInt(customWidthStr, 10) : null;
      canvasHeight = customHeightStr ? parseInt(customHeightStr, 10) : null;
    } else if (selectedScreenSize === 'mobile_portrait') {
      canvasWidth = 360;
      canvasHeight = 640;
    } else if (selectedScreenSize === 'mobile_landscape') {
      canvasWidth = 640;
      canvasHeight = 360;
    } else if (selectedScreenSize === 'tablet_600') {
      canvasWidth = 600;
      canvasHeight = 1024;
    } else if (selectedScreenSize === 'tablet_768') {
      canvasWidth = 768;
      canvasHeight = 1024;
    } else if (selectedScreenSize === 'pc_978') {
      canvasWidth = 978;
      canvasHeight = 1024;
    } else if (selectedScreenSize === 'pc_1200') {
      canvasWidth = 1200;
      canvasHeight = 1024;
    }
    /** 초기 빈 Tldraw 스냅샷 */
    const initialTldrawSnapshot = JSON.stringify({
      schema: {
        record: { type: 'record', version: 0 },
        document: { type: 'document', version: 1 }
      },
      store: {}
    })

    /** 데이터베이스에 삽입할 프로젝트 객체 구성 */
    const projectToInsert: NewProjectData = {
      id: newProjectId,
      clerkUserId: clerkUserId,
      projectName: projectName,
      projectDescription: projectDescription || null,
      tldrawContent: initialTldrawSnapshot,
      screenSize: selectedScreenSize === 'custom' && customWidthStr && customHeightStr ? `${customWidthStr}x${customHeightStr}` : selectedScreenSize,
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      projectType: projectType,
      tags: tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    /** 프로젝트 데이터베이스 삽입 실행 */
    await db.insert(schema.userProjects).values(projectToInsert).execute()

    /** 성공시 리다이렉트 또는 성공 메시지 반환 -> 생성된 프로젝트 페이지로 이동 */
    return redirect(`/sketches/${newProjectId}`)
  } catch (error:any) {
    console.error("프로젝트 생성 중 오류 발생:", error)
    throw data({ message: "프로젝트 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

/**
 * Remix Loader함수: 사용자의 프로젝트 목록을 가져옵니다.
 * @param {LoaderFunctionArgs} args - Remix 로더 인자
 * @returns {Response<{projects: DesignMockup[]}>} - 성공시 사용자의 프로젝트 목록, 실패시 에러 응답
 */
export async function loader(args: LoaderFunctionArgs) {
  /** Clerk를 사용하여 사용자 ID 인증 */
  const { userId } = await getAuth(args)
  const db = args.context.db

  /** 로그인 여부 검증: 로그인되지 않은 경우 로그인 페이지로 리다이렉트 */
  if(!userId) {
    return redirect("/login")
  }

  try {
    /** Clerk userId를 기준으로 사용자 프로젝트 조회 */
    const userProjects = await db.query.userProjects.findMany({
      where: (project, { eq }) => eq(project.clerkUserId, userId),
      orderBy: (projects, { desc }) => desc(projects.updatedAt)
    });
    
    /** 조회된 프로젝트 데이터를 클라이언트에서 사용하기 쉬운 형태로 변환 */
    const transformedProjects = userProjects.map(project => ({
      id: project.id,
      clerkUserId: project.clerkUserId,
      name: project.projectName,
      description: project.projectDescription || '',
      status: project.projectType === 'whiteboard' ? 'in-progress' : 'draft',
      lastEdited: project.updatedAt?.split('T')[0] || '',
      tags: project.tags ? project.tags.split(",") : []
    }));

    /** 변환된 프로젝트 데이터 반환 */
    return { projects:transformedProjects}
  } catch (error) {
    console.error("Error fetching user projects:", error)
    throw new Response("Failed to load projects", {status: 500})
  }
}

/**
 * DesignMockupList 컴포넌트: 사용자의 프로젝트 목록을 표시하고 관리합니다.
 */
export default function DesignMockupList() {
  const location = useLocation()

  /** 새 프로젝트 생성 모달이 열려 있는지 여부 확인 (URL 경로를 통해) */
  const isNewProjectModalOpen = location.pathname.endsWith('/new')
  
  /** 로더 데이터에서 초기 목업 목록 가져오기 */
  const { projects: initialMockups} = useLoaderData() as { projects: DesignMockup[] };
  const [mockups, setMockups] = useState<DesignMockup[]>(initialMockups)
  
  /** Clerk useUser 훅 사용: 사용자 정보 가져오기 */
  const { user, isLoaded, isSignedIn } = useUser()
  
  /** 목업 검색 쿼리 상태 */
  const [searchQuery, setSearchQuery] = useState("")
  /** 검색 쿼리에 따라 목업 목록 필터링 */
  const filteredMockups = mockups.filter(
    (mockup) =>
      mockup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mockup.description && mockup.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mockup.tags && mockup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  /** clerk 로그인/로그아웃 시 목업 데이터 새로고침 */
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // 로그인 시 데이터 다시 로드 & 상태 업데이트 로직
    } else if (isLoaded && !isSignedIn) {
      setMockups([]) // 로그아웃 시 목업 목록 비우기
    }
  }, [isLoaded, isSignedIn, user])

  /** 목업 상태에 따른 색상 클래스 반환 */
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

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* --- Header 섹션 --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">나의 디자인 목업</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">당신의 아이디어를 빠르고 쉽게 시각화하고 관리하세요.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"> {/* 버튼 스타일 조정 */}
          {/* 새 목업 생성 모달로 이동하는 경로 */}
          <Link to="/dashboard/projects/new"> 
            새 목업 만들기
          </Link>
        </Button>
      </div>

      {/* --- Search and Filters 섹션 --- */}
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

      {/* --- 목업 리스트 또는 "목업 없음" 상태 섹션 --- */}
      {filteredMockups.length === 0 ? (
        // "아직 목업이 없습니다" 상태 표시
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-8">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-20 w-20 text-blue-500 dark:text-blue-400 mx-auto mb-6 opacity-80" /> {/* 아이콘 변경 및 스타일 */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">아직 디자인 목업이 없습니다</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">첫 번째 아이디어를 시각화하고 검증을 시작하세요!</p>
            <Link to="/dashboard/projects/new" className="inline-block"> {/* Added inline-block for proper button sizing */}
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                <Plus className="mr-2 h-5 w-5" />
                새 목업 만들기
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        // 목업 리스트 그리드 (목업이 있을 때)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredMockups.map((mockup) => (
            <Card key={mockup.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transform hover:scale-102 hover:shadow-lg transition-all duration-300 cursor-pointer">
              {/* 목업 상세 페이지로 이동하는 경로 */}
              <Link to={`/sketches/${mockup.id}`} className="block">
                <CardContent className="p-4 flex flex-col justify-between h-48"> {/* 내용 높이 고정 */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                          {mockup.name}
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
                </CardContent>
              </Link>

              {/* Delete 버튼 섹션 */}
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 p-4 pt-0">
                <span>최근 수정: {mockup.lastEdited}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-red-600 hover:bg-blue-50 dark:text-red-400 dark:hover:bg-gray-700"
                    asChild // shadcn/ui Button에 Link 컴포넌트를 자식으로 넘기려면 asChild prop 사용
                  >
                    {/* 삭제 모달로 이동하는 경로 */}
                    <Link
                      to="/dashboard/projects/delete"
                      // state를 통해 삭제할 mockup 정보를 모달로 전달
                      state={{ projectId: mockup.id, projectName: mockup.name }}
                    >
                      삭제
                    </Link>
                  </Button>
                </div>
              </div>
          </Card>
        ))}
    </div>
  )}
  
  {/* --- 통계 요약 섹션 --- */}
  <StatsSummary mockups={mockups} />
  
  {/* --- NewProjectModal 조건부 랜더링 --- */}
  {isNewProjectModalOpen && <NewProjectModal onProjectCreated={() => {/** 프로젝트 생성 후 재검증 로직 */}} />}
  </div>
  )
}