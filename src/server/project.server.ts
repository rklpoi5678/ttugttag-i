import { type LoaderFunctionArgs, type ActionFunctionArgs, data } from 'react-router';
import { getAuth } from '@clerk/react-router/ssr.server';
import { and, eq } from 'drizzle-orm';
import * as schema from '../../database/schema';
import { type StoreSnapshot, type TLRecord } from 'tldraw';

/** 기본 사이즈 설정(디폴트값) */
const CUSTOM_CANVAS_WIDTH = 1920;
const CUSTOM_CANVAS_HEIGHT = 1080;

export async function loader(args: LoaderFunctionArgs) {
  const { db } = args.context
  const { userId } = await getAuth(args)
  const projectId = args.params.projectId as string;

  if (!userId) {
    throw data({ message: "인증되지 않았습니다. 로그인이 필요합니다." }, { status: 401 });
  }

  if (!projectId) {
    throw data({ message: "프로젝트 ID가 필요합니다." }, { status: 400 });
  }
  
  let tldrawContent: StoreSnapshot<TLRecord> = {
    schema: { record: { type: 'record', version: 0 }, document: { type: 'document', version: 1 } },
    store: {}
  };

  try {
    const project = await db.query.userProjects.findFirst({
      where: () => and(eq(schema.userProjects.id, projectId), eq(schema.userProjects.clerkUserId, userId)),
      columns: {
        id: true,
        projectName: true,
        tldrawContent: true,
        canvasWidth: true,
        canvasHeight: true,
      }
    });

    if (!project) {
      throw data({ message: "프로젝트를 찾을 수 없거나 접근권한이 없습니다." }, { status: 404 });
    }

    if(project.tldrawContent){
      const parsedContent = JSON.parse(project.tldrawContent)
      if(parsedContent && typeof parsedContent === 'object' && 'store' in parsedContent && 'schema' in parsedContent){
        tldrawContent = parsedContent as StoreSnapshot<TLRecord>
      } else {
        console.warn("로딩된 tldrawContent가 Tldraw V3.x Store Snapshot 형식이 아닙니다. 빈 콘텐츠로 초기화합니다.")
      }
    }
    return data({
      projectId: project.id,
      initialContent: tldrawContent,
      projectName: project.projectName,
      initialCanvasWidth: project.canvasWidth ?? CUSTOM_CANVAS_WIDTH,
      initialCanvasHeight: project.canvasHeight ?? CUSTOM_CANVAS_HEIGHT
    });

  } catch (error: any) {
    console.error("프로젝트 로딩 중 오류:", error)
    throw data({ message: "프로젝트 로딩 중 오류가 발생했습니다.", error: error.message }, { status: 500 })
  }
}

export async function action(args: ActionFunctionArgs) {
    const { db } = args.context;
    const { userId } = await getAuth(args);
    const projectId = args.params.projectId as string;
  
    if (!userId) {
      throw data({ message: "인증되지 않았습니다. 로그인이 필요합니다." }, { status: 401 });
    }
    if (!projectId) {
      throw data({ message: "프로젝트 ID가 필요합니다." }, { status: 400 });
    }
  
    if (args.request.method !== 'PATCH') {
      throw data({ message: "허용되지 않는 메서드입니다. PATCH를 사용하세요." }, { status: 405 });
    }
  
    try {
      const requestBody = await args.request.json();
      interface TidrawUpdatePayload {
        tldrawContent: StoreSnapshot<TLRecord>;
      }
      const { tldrawContent } = requestBody as TidrawUpdatePayload;
  
      if (!tldrawContent) {
        throw data({ message: "업데이트할 Tldraw 콘텐츠가 필요합니다." }, { status: 400 });
      }
  
      await db.update(schema.userProjects)
        .set({
          tldrawContent: JSON.stringify(tldrawContent),
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(schema.userProjects.id, projectId), eq(schema.userProjects.clerkUserId, userId)))
        .execute();
  
      return data({ message: "프로젝트가 성공적으로 저장되었습니다." }, { status: 200 });
  
    } catch (error: any) {
      console.error("프로젝트 저장 중 오류 발생:", error);
      throw data({ message: "프로젝트 저장 중 오류가 발생했습니다.", error: error.message }, { status: 500 });
    }
}