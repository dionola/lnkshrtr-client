import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/auth/LoginForm"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"

export default function Login() {
    const { login, isLoading } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const errorParam = searchParams.get("error")
    const [error, setError] = useState(() => errorParam ? decodeURIComponent(errorParam) : "")

    const handleSubmit = async (email: string, password: string) => {
        setError("")
        const result = await login(email, password)
        if (result.success) {
            navigate("/dashboard")
        } else {
            setError(result.error || "invalid credentials")
        }
    }

    return (
        <main className="flex flex-1 flex-col bg-foreground">
            <div className="flex flex-1 flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    <h1 className="text-4xl font-bold tracking-tight text-background md:text-5xl">
                        sign in
                    </h1>

                    <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-background/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-foreground text-background/50">or</span>
                            </div>
                        </div>
                        <GoogleSignInButton label="sign in with google" disabled={isLoading} />
                    </div>

                    <p className="mt-8 text-sm text-background/50">
                        {"don't have an account? "}
                        <Link to="/signup" className="text-background underline">
                            sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}
