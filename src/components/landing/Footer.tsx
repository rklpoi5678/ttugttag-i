import { Link } from "react-router"

export default function Footer() {

  return (
    <footer className="bg-white rounded-lg shadow-sm dark:bg-gray-900">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">뚝딱이</span>
                </a>
                <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <Link to="/about" className="hover:underline me-4 md:me-6">소개</Link>
                    </li>
                    <li>
                        <Link to="/privacy" className="hover:underline me-4 md:me-6">개인정보 처리방침</Link>
                    </li>
                    <li>
                        <Link to="/terms" className="hover:underline me-4 md:me-6">이용약관</Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:underline">문의하기</Link>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. 모든 권리 보유.</span>
        </div>
    </footer>

  )
} 