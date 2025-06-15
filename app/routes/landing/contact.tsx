import { useState } from "react"
import { Form } from "react-router"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Supabase 연동
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">문의하기</h1>
        <p className="text-lg mt-4">MetaOS에 대해 궁금한 점이 있으신가요? 언제든지 문의해 주세요.</p>
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
              <h3 className="text-lg font-medium">Q: MetaOS는 어떤 서비스인가요?</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">A: MetaOS는 AI 기반 프로젝트 관리 플랫폼으로, 사용자의 생각을 현실로 만들어주는 도구입니다.</p>
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
          <Form action="#" className="space-y-8">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">이메일</label>
              <input type="email" name="email" className="shadow-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@flowbite.com" required />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium">제목</label>
              <input type="text" name="subject" className="block p-3 w-full text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="도움이 필요하신 내용을 알려주세요" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block mb-2 text-sm font-medium">메시지</label>
              <textarea id="message" rows={6} className="block p-2.5 w-full text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500" placeholder="댓글을 남겨주세요..."></textarea>
            </div>
            <button type="submit" className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-600 dark:bg-blue-700 sm:w-fit hover:bg-blue-700 dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">메시지 보내기</button>
          </Form>
        </div>
      </section>
    </div>
  )
} 