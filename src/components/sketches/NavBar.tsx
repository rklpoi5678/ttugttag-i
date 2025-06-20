// NavBar.tsx (이전과 동일)
import { useState } from "react";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router'


export default function NavBar() {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const handleToggleDropdown = (id: string) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    return (
        <nav className="w-full bg-gray-50 py-2 px-5 border-b border-gray-200 flex justify-between items-center shadow-md z-40">
            <div className="w-auto">
                <Link to="/dashboard/projects" className="flex items-center text-gray-500">
                    <ArrowLeft /> 대시보드로 돌아가기
                </Link>
            </div>

            {/* <div className="flex flex-grow justify-center">
                <NavDropdown
                    id="ui32"
                    buttonText="자주 쓰는 UI 32가지"
                    isOpen={openDropdownId === "ui32"}
                    onToggle={handleToggleDropdown}
                    editor={editor}
                >
                </NavDropdown>

                <NavDropdown
                    id="loginTemplate"
                    buttonText="로그인 템플릿"
                    isOpen={openDropdownId === "loginTemplate"}
                    onToggle={handleToggleDropdown}
                    editor={editor}
                >
                    <div className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors">로그인 폼 1</div>
                    <div className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors">로그인 폼 2</div>
                </NavDropdown>

                <NavDropdown
                    id="misc1"
                    buttonText="기타 편의 기능 1"
                    isOpen={openDropdownId === "misc1"}
                    onToggle={handleToggleDropdown}
                    editor={editor}
                >
                    <div className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors">기능 아이템 A</div>
                    <div className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors">기능 아이템 B</div>
                </NavDropdown>

                <NavDropdown
                    id="misc2"
                    buttonText="기타 편의 기능 2"
                    isOpen={openDropdownId === "misc2"}
                    onToggle={handleToggleDropdown}
                    editor={editor}
                >
                    <div className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors">기능 아이템 X</div>
                    <div className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-sm transition-colors">기능 아이템 Y</div>
                </NavDropdown>
            </div> */}

            <div className="w-auto">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
}