import { useState } from "react"
import {Link} from "react-router"
import { useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  CreditCard,
  Settings,
  X,
} from "lucide-react"
import DashbardHeader from "@/components/dashboard/DashbardHeader"
import { Outlet } from "react-router"

const sidebarItems = [
  {
    title: "디자인",
    href: "/dashboard/projects",
    icon: Home,
  },
  {
    title: "협력자",
    href: "/dashboard/collaborators",
    icon: Users,
  },
  {
    title: "결제",
    href: "/dashboard/checkout",
    icon: CreditCard,
  },
  {
    title: "설정",
    href: "/dashboard/settings",
    icon: Settings,
  },
//   {
//     title: "보관함",
//     href: "/dashboard/library",
//     icon: PackageOpen,
//   },
]


export default function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top header */}
        <DashbardHeader setSidebarOpen={setSidebarOpen} />

      <div className="flex max-w-[1920px] mx-auto">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Button variant="ghost" size="icon" className="lg:hidden text-gray-600 dark:text-gray-300" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="flex-1 px-3 py-4 overflow-y-auto">
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
