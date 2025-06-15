import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Menu, Settings, Zap } from "lucide-react";
import { Link } from "react-router";

interface DashbardHeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

export default function DashbardHeader({ setSidebarOpen }: DashbardHeaderProps) {

    return (
<header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between h-16">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="lg:hidden text-gray-600 dark:text-gray-300" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl text-gray-900 dark:text-white">뚝딱이</span>
      </Link>
    </div>

    <div className="flex items-center gap-3">
        뚝딱이 어드민님

      <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
        {/* <Bell className="h-5 w-5" /> */}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
              <AvatarImage src={"/placeholder.svg"} alt={"ладно"} />
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">{"ладно"?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">ладно</p>
              <p className="text-xs leading-none text-gray-500 dark:text-gray-400">ладно</p>
              <p className="text-xs leading-none text-gray-500 dark:text-gray-400">ладно</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem asChild className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Link to="/seller/settings">
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</div>
</header>
    )
}