import { ArrowLeft, GalleryVerticalEnd } from "lucide-react"
import { useNavigate } from "react-router"
import { SignupForm } from "@/components/auth/singup-form"

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div className="flex w-full max-w-sm flex-col gap-6 relative">
    <button onClick={() => navigate(-1)} className="absolute left-0 flex items-center">
      <ArrowLeft className="size-8" />
    </button>
    <div className="flex items-center gap-2 font-medium justify-center">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        똑딱이
    </div>
    <SignupForm />
  </div>
</div>
  )
}
