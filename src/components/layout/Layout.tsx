import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { useTheme } from "@/hooks/useTheme"

export function Layout() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <div className="relative flex min-h-screen min-h-[100lvh] flex-col bg-foreground">
            <Header isDark={isDark} toggleTheme={toggleTheme} />
            <Outlet />
        </div>
    )
}
