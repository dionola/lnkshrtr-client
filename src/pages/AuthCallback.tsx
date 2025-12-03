import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      window.history.replaceState({}, "", "/auth/callback")
      loginWithToken(token)
        .then(() => {
          navigate("/dashboard")
        })
        .catch(() => {
          navigate("/login?error=" + encodeURIComponent("Authentication failed"))
        })
    } else {
      navigate("/login?error=" + encodeURIComponent("No token received"))
    }
  }, [searchParams, loginWithToken, navigate])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-foreground">
      <div className="text-background/50">completing sign in...</div>
    </main>
  )
}

