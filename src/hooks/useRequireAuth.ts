import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"

export function useRequireAuth() {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login")
        }
    }, [user, isLoading, navigate])

    return { user, isLoading }
}
