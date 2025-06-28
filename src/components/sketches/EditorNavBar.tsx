import { useState, type JSX } from "react";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router'

interface NavBarProps {
    projectName: string;
    children?: React.ReactNode
}

export default function NavBar({projectName, children}: NavBarProps): JSX.Element {
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
            <div>
                <h1>{projectName}</h1>
                {children}
            </div>
            <div className="w-auto">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    );
}