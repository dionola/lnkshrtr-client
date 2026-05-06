import { useState, useCallback, useEffect } from "react"

function getInitialTheme() {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
    return stored ? stored === "dark" : prefersDark
}

export function useTheme() {
    const [isDark, setIsDark] = useState(getInitialTheme)

    useEffect(() => {
        if (typeof window === "undefined") return
        document.documentElement.classList.toggle("dark", isDark)
    }, [isDark])

    const toggleTheme = useCallback(() => {
        if (typeof window === "undefined") return
        setIsDark((prev) => {
            const next = !prev
            document.documentElement.classList.toggle("dark", next)
            localStorage.setItem("theme", next ? "dark" : "light")
            return next
        })
    }, [])

    return { isDark, toggleTheme }
}
