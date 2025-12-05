import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { useTheme } from "@/hooks/useTheme"

export function Layout() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <div className="relative flex min-h-screen flex-col bg-foreground">
            <Header isDark={isDark} toggleTheme={toggleTheme} />
            <Outlet />
        </div>
    )
}
