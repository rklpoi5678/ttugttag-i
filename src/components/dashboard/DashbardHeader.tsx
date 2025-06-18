import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Settings, Zap } from "lucide-react";
import { Link } from "react-router";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";

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
        {useUser().user?.fullName} 님 안녕하세요

      <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
        {/* <Bell className="h-5 w-5" /> */}
      </Button>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </div>
</div>
</header>
    )
}