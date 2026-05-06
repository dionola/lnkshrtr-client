import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface HeaderProps {
    isDark: boolean
    toggleTheme: () => void
}

export function Header({ isDark, toggleTheme }: HeaderProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const isHome = location.pathname === "/"
    const isDashboard = location.pathname === "/dashboard"
    const isProfile = user ? location.pathname === `/u/${user.username}` : false

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <header className="flex w-screen max-w-full items-center justify-between gap-3 overflow-hidden px-4 py-5 sm:px-6">
            <Link to="/" className="shrink-0 text-lg font-bold tracking-tight text-background sm:text-xl">
                lnkshrtr
            </Link>
            <nav className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-6">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="cursor-pointer text-xs text-background/70 transition-colors hover:text-background sm:text-sm"
                >
                    {isDark ? "light mode" : "dark mode"}
                </button>
                {!user && (
                    <Link
                        to="/login"
                        className="cursor-pointer text-xs text-background/70 transition-colors hover:text-background sm:text-sm"
                    >
                        sign in
                    </Link>
                )}
                {user && !isDashboard && (
                    <Link
                        to="/dashboard"
                        className="cursor-pointer text-xs text-background/70 transition-colors hover:text-background sm:text-sm"
                    >
                        dashboard
                    </Link>
                )}
                {user && !isHome && !isProfile && (
                    <Link
                        to={`/u/${user.username}`}
                        className="cursor-pointer text-xs text-background/70 transition-colors hover:text-background sm:text-sm"
                    >
                        profile
                    </Link>
                )}
                {user && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="cursor-pointer text-xs text-background/70 transition-colors hover:text-background sm:text-sm"
                    >
                        sign out
                    </button>
                )}
            </nav>
        </header>
    )
}
