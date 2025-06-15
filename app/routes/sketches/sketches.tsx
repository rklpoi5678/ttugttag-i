// app/routes/sketches.$userId.$projectId.edit.tsx
import { data } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import EditorLayout from '@/components/sketches/editorLayout'; // 새로 만든 레이아웃 컴포넌트

// export async function loader({ params }: LoaderFunctionArgs) {
//   const userId = params.userId;
//   const projectId = params.projectId;

//   // 실제로는 여기서 프로젝트 데이터, 페이지 데이터, 컴포넌트 데이터 등을 불러옵니다.
//   // 이 데이터는 EditorLayout 내부의 Canvas 컴포넌트에 전달되어 렌더링됩니다.
//   // 예: const projectData = await getProjectData(projectId, userId);
//   // return json({ projectData });
//   return data({}); // 현재는 더미 데이터
// }

export default function ProjectEditorPage() {
  // const { projectData } = useLoaderData<typeof loader>(); // 로더에서 데이터 받기

  return (
    // <EditorLayout projectData={projectData} />
    <EditorLayout /> // 일단 데이터 없이 레이아웃만 렌더링
  );
}

// 사용자가 캔버스에서 변경한 내용을 저장하는 action
// export async function action({ request, params }: ActionFunctionArgs) {
//   // ... 저장 로직 (이전 답변 참조)
// }