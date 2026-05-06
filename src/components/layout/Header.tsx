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
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
            <Link to="/" className="text-xl font-bold tracking-tight text-background">
                lnkshrtr
            </Link>
            <nav className="flex basis-full flex-wrap items-center gap-x-4 gap-y-2 sm:ml-auto sm:basis-auto sm:justify-end sm:gap-x-6">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="text-sm text-background/70 cursor-pointer transition-colors hover:text-background"
                >
                    {isDark ? "light mode" : "dark mode"}
                </button>
                {!user && (
                    <Link
                        to="/login"
                        className="text-sm text-background/70 cursor-pointer transition-colors hover:text-background"
                    >
                        sign in
                    </Link>
                )}
                {user && !isDashboard && (
                    <Link
                        to="/dashboard"
                        className="text-sm text-background/70 cursor-pointer transition-colors hover:text-background"
                    >
                        dashboard
                    </Link>
                )}
                {user && !isHome && !isProfile && (
                    <Link
                        to={`/u/${user.username}`}
                        className="text-sm text-background/70 cursor-pointer transition-colors hover:text-background"
                    >
                        profile
                    </Link>
                )}
                {user && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm text-background/70 cursor-pointer transition-colors hover:text-background"
                    >
                        sign out
                    </button>
                )}
            </nav>
        </header>
    )
}
