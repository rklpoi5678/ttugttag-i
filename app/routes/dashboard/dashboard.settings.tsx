
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SellerSettingPage() {
  const [email, setEmail] = useState("kjdeok87@gmail.com")
  const [notifications, setNotifications] = useState({
    purchase: true,
    recurring: true,
    free: false,
    announce: true,
    comment: false,
    review: true,
  })
  const [supportEmail, setSupportEmail] = useState("kjdeok87@gmail.com")
  const [currency, setCurrency] = useState("KRW")
  const [parity, setParity] = useState(false)
  const [adult, setAdult] = useState(false)
  const pathname = usePathname()
  const tabs = [
    { label: "설정", href: "/dashboard/settings" },
    { label: "프로필", href: "/dashboard/settings/profile" },
    { label: "결제", href: "/dashboard/settings/checkout" },
  ]

  return (
      <div className="max-w-2xl mx-auto">
        {/* 가로형 탭 네비게이션 */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-8">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors duration-150
                ${pathname === tab.href ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-pink-500"}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form className="space-y-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">설정</h1>
            <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">설정 저장</Button>
          </div>

          {/* 사용자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" />
            </CardContent>
          </Card>

          {/* 고객지원 */}
          <Card>
            <CardHeader>
              <CardTitle>고객지원</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="supportEmail">고객지원 이메일</Label>
              <Input id="supportEmail" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} type="email" autoComplete="email" />
              <div className="text-xs text-gray-500 dark:text-gray-400">모든 판매 알림이 이 이메일로 발송됩니다.</div>
            </CardContent>
          </Card>
        </form>
      </div>
  )
} 