import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocation } from "react-router"
import { Link } from "react-router"

export default function SellerProfilePage() {
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const location = useLocation()
  const tabs = [
    { label: "설정", href: "/dashboard/settings" },
    { label: "프로필", href: "/dashboard/settings/profile" },
    { label: "결제", href: "/dashboard/settings/checkout" },
  ]

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {/* 가로형 탭 네비게이션 */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-8">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              to={tab.href}
              className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition-colors duration-150
                ${location.pathname === tab.href ? "border-pink-500 text-pink-600 dark:text-pink-400" : "border-transparent text-gray-500 hover:text-pink-500"}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        {/* 기존 팀 관리 UI */}
        <div className="space-y-8 py-8">{/* ... 이하 기존 UI ... */}</div>
      </div>
      <form className="max-w-xl mx-auto space-y-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">프로필 설정</h1>
          <Button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">저장</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-4xl font-bold">
                {/* 프로필 사진 업로드 자리 */}
                <span>+</span>
              </div>
              <Button variant="outline" className="text-xs">프로필 사진 변경</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="이름 입력" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="닉네임 입력" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">소개</Label>
              <Input id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="간단한 자기소개" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="연락처 입력" />
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  )
} 