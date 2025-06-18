import { Form, useActionData, useNavigation } from "react-router"
import { Resend } from "resend";
import type { Route } from "../+types/home";

interface ActionData {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    server?: string;
  };
}
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export async function loader({request}: Route.LoaderArgs) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_RESEND_API_KEY is not defined in loader.");
  }

  return Response.json({ message: "Loader executed, API key checked." });
}

export async function action({ request }: Route.ActionArgs) {
  const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
  
  if (!import.meta.env.VITE_RESEND_API_KEY) {
    console.error('VITE_RESEND_API_KEY is not defined');
    return Response.json({ message: 'VITE_RESEND_API_KEY is not defined' }, { status: 500 });
  }

  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  const errors: Record<string, string> = {};
  if(!name) errors.name = '이름을 입력해주세요';
  if(!email) errors.email = '이메일을 입력해주세요';
  if(!subject) errors.subject = '제목을 입력해주세요';
  if(!message) errors.message = '내용을 입력해주세요';

  if(Object.keys(errors).length > 0) {
    return Response.json({
      errors,
      message: '모든 필드를 채워주세요'
    }, { status: 400 });
  }
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>새로운 문의가 접수되었습니다</title>
    <style>
      body { font-family: sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
      .header { background-color: #f6f6f6; padding: 10px 20px; border-bottom: 1px solid #eee; }
      .content { padding: 20px; }
      .footer { text-align: center; font-size: 0.8em; color: #777; margin-top: 20px; }
      .info-label { font-weight: bold; margin-bottom: 5px; display: block;}
      .info-value { margin-bottom: 10px; display: block;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>새로운 문의가 접수되었습니다.</h2>
      </div>
      <div class="content">
        <p><span class="info-label">보낸 분:</span> <span class="info-value">${name}</span></p>
        <p><span class="info-label">이메일 주소:</span> <span class="info-value">${email}</span></p>
        <p><span class="info-label">제목:</span> <span class="info-value">${subject}</span></p>
        <p><span class="info-label">메시지:</span></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="footer">
        <p>이 이메일은 문의 양식을 통해 자동 발송되었습니다.</p>
      </div>
    </div>
  </body>
  </html>
`;
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `[문의] ${subject} - From: ${name} (${email})`,
      html: htmlContent,
      replyTo: email,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return Response.json({ errors: { server: error.message }, message: '이메일 전송 실패: ' + error.message }, { status: 500 });
    }

    return Response.json({ success: true, message: '이메일이 성공적으로 전송되었습니다!' });
    // 성공리 return redirect('/contact/success'); 같은것을 넣을수있다는점...
  } catch (error: any) {
    console.error('Server Error during email send:', error);
    return Response.json({ errors: { server: error.message || '알 수 없는 서버 오류' }, message: '이메일 전송 중 오류 발생.' }, { status: 500 });
  }
}

export default function ContactPage() {
  const navigation = useNavigation();
  const actionData = useActionData<ActionData>();
  //form 제출 확인
  const isSubmitting = navigation.state === 'submitting';

  const initialFormData = {
    name: actionData?.success ? '' : (actionData?.errors?.name ? '' : navigation.formData?.get('name') as string || ''),
    email: actionData?.success ? '' : (actionData?.errors?.email ? '' : navigation.formData?.get('email') as string || ''),
    subject: actionData?.success ? '' : (actionData?.errors?.subject ? '' : navigation.formData?.get('subject') as string || ''),
    message: actionData?.success ? '' : (actionData?.errors?.message ? '' : navigation.formData?.get('message') as string || ''),
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">문의하기</h1>
        <p className="text-lg mt-4">뚝딱이에 대해 궁금한 점이 있으신가요? 언제든지 문의해 주세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* 연락처 정보 */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
          <h2 className="text-2xl font-semibold mb-6">연락처 정보</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">이메일</h3>
              <p className="text-gray-600 dark:text-gray-400">contact@metaos.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">주소</h3>
              <p className="text-gray-600 dark:text-gray-400">서울특별시 강남구 테헤란로 123</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">운영 시간</h3>
              <p className="text-gray-600 dark:text-gray-400">평일 09:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg text-gray-800 dark:text-gray-200">
          <h2 className="text-2xl font-semibold mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Q: 뚝딱이는 어떤 서비스인가요?</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">A: 뚝딱이는 AI 기반 프로젝트 관리 플랫폼으로, 사용자의 생각을 현실로 만들어주는 도구입니다.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Q: 무료 체험 기간이 있나요?</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">A: 네, 14일간의 무료 체험 기간을 제공합니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 문의 양식 */}
      <section className="bg-white dark:bg-gray-900 w-full max-w-screen-md text-gray-800 dark:text-gray-200">
        <div className="py-8 lg:py-16 px-4 mx-auto">
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-center">문의하기</h2>
          <p className="mb-8 lg:mb-16 font-light text-center sm:text-lg">기술적인 문제가 있으신가요? 베타 기능에 대한 피드백을 보내고 싶으신가요? 비즈니스 플랜에 대한 세부사항이 필요하신가요? 언제든지 알려주세요.</p>
          <Form method="post" className="space-y-8">
          <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">이름(별명)</label>
              <input type="text" name="name" defaultValue={initialFormData.name} className="shadow-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="뚝딱이" required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">이메일</label>
              <input type="email" name="email" defaultValue={initialFormData.email} className="shadow-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@myemail.com" required />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium">제목</label>
              <input type="text" name="subject" defaultValue={initialFormData.subject} className="block p-3 w-full text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="도움이 필요하신 내용을 알려주세요" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block mb-2 text-sm font-medium">메시지</label>
              <textarea name="message" rows={6} defaultValue={initialFormData.message} className="block p-2.5 w-full text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" placeholder="메시지을 남겨주세요..."></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-600 dark:bg-blue-700 sm:w-fit hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">{isSubmitting ? '로딩 중...' : '메시지 보내기'}</button>
          </Form>
          {actionData?.message && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{actionData.message}</p>
          )}
          {actionData?.errors?.server && (
            <p className="mt-4 text-sm text-red-500">
              서버 오류: {actionData.errors.server}
            </p>
          )}
        </div>
      </section>
    </div>
  )
} 