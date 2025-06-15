import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Plus, Mail, MoreHorizontal, Edit, Trash2, UserCheck, UserX, Crown, Eye, Settings } from "lucide-react"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "pending" | "suspended"
  joinedAt: string
  lastActive: string
  permissions: string[]
}

const rolePermissions = {
  admin: [
    "목업 생성 및 편집",
    "목업 삭제 및 아카이브",
    "프로젝트 공유 및 협업 관리",
    "템플릿 관리",
    "계정 및 설정 관리",
  ],
  editor: [
    "목업 생성 및 편집",
    "초안 목업 공유 (읽기 전용)",
    "템플릿 사용",
  ],
  viewer: [
    "공유된 목업 보기",
    "목업 댓글 남기기",
  ],
}

const roleColors = {
  admin: "bg-red-500",
  editor: "bg-blue-500",
  viewer: "bg-green-500",
}

const statusColors = {
  active: "bg-green-500",
  pending: "bg-yellow-500",
  suspended: "bg-red-500",
}

export default function SellerCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("viewer")

  useEffect(() => {
    fetchCollaborators()
  }, [])

  const fetchCollaborators = async () => {
    try {
      setTimeout(() => {
        setCollaborators([
          {
            id: "1",
            name: "홍길동",
            email: "hong@example.com",
            avatar: "/placeholder.svg",
            role: "admin",
            status: "active",
            joinedAt: "2024-01-15",
            lastActive: "2024-01-20",
            permissions: rolePermissions.admin,
          },
          {
            id: "2",
            name: "김철수",
            email: "kim@example.com",
            role: "editor",
            status: "active",
            joinedAt: "2024-01-10",
            lastActive: "2024-01-19",
            permissions: rolePermissions.editor,
          },
          {
            id: "3",
            name: "이영희",
            email: "lee@example.com",
            role: "viewer",
            status: "pending",
            joinedAt: "2024-01-18",
            lastActive: "없음",
            permissions: rolePermissions.viewer,
          },
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("협력자 정보를 가져오는데 실패했습니다:", error)
      setLoading(false)
    }
  }

  const handleInviteCollaborator = async () => {
    if (!inviteEmail) return

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0],
      lastActive: "없음",
      permissions: rolePermissions[inviteRole],
    }

    setCollaborators([...collaborators, newCollaborator])
    setInviteEmail("")
    setInviteRole("viewer")
    setInviteDialogOpen(false)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getPermissionDescription = (permissions: string[]) => {
    return permissions.map((p) => p.replace("_", " ")).join(", ")
  }

  return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">협력자 관리</h1>
            <p className="text-gray-600 dark:text-gray-400">팀 접근 권한 및 관리</p>
          </div>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                협력자 초대
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새로운 협력자 초대</DialogTitle>
                <DialogDescription>
                  스토어 협업을 위한 초대장을 보내세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">이메일 주소</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="collaborator@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">역할</Label>
                  <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">조회자 - 조회만 가능</SelectItem>
                      <SelectItem value="editor">편집자 - 상품 및 주문 관리 가능</SelectItem>
                      <SelectItem value="admin">관리자 - 모든 권한</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleInviteCollaborator} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                    초대장 보내기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">전체 협력자</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{collaborators.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">활성</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {collaborators.filter((c) => c.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">대기중</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {collaborators.filter((c) => c.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Crown className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">관리자</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {collaborators.filter((c) => c.role === "admin").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 협력자 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>팀 멤버</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                        {collaborator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">{collaborator.name}</h3>
                        <Badge className={`${roleColors[collaborator.role]} text-white`}>
                          {getRoleIcon(collaborator.role)}
                          <span className="ml-1">
                            {collaborator.role === "admin" ? "관리자" : 
                             collaborator.role === "editor" ? "편집자" : "조회자"}
                          </span>
                        </Badge>
                        <Badge className={`${statusColors[collaborator.status]} text-white`}>
                          {collaborator.status === "active" ? "활성" : 
                           collaborator.status === "pending" ? "대기중" : "정지"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{collaborator.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        가입일: {collaborator.joinedAt} • 마지막 활동: {collaborator.lastActive}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>작업</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        역할 수정
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        권한 관리
                      </DropdownMenuItem>
                      {collaborator.status === "active" ? (
                        <DropdownMenuItem>
                          <UserX className="mr-2 h-4 w-4" />
                          접근 정지
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <UserCheck className="mr-2 h-4 w-4" />
                          접근 활성화
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 dark:text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" />
                        협력자 제거
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 역할 권한 참조 */}
        <Card>
          <CardHeader>
            <CardTitle>역할별 권한</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <div key={role} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {getRoleIcon(role)}
                    <h3 className="font-medium capitalize">{role}</h3>
                  </div>
                  <ul className="space-y-1">
                    {permissions.map((permission) => (
                      <li key={permission} className="text-muted-foreground text-sm">
                        • {permission.replace("_", " ")}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
