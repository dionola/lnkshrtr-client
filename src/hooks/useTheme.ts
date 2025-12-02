import { useState, useCallback, useEffect } from "react"

export function useTheme() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return
        const stored = localStorage.getItem("theme")
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
        const shouldUseDark = stored ? stored === "dark" : prefersDark
        document.documentElement.classList.toggle("dark", shouldUseDark)
        setIsDark(shouldUseDark)
    }, [])

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
