import { useState } from "react"
import { Mail, Lock } from "lucide-react"

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>
    isLoading: boolean
    error: string
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(email, password)
    }

    return (
        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="relative">
                <Mail className="absolute left-0 bottom-3.5 h-4 w-4 text-background/50" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    className="w-full border-b-2 border-background/30 bg-transparent pb-3 pl-7 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                    required
                    autoFocus
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-0 bottom-3.5 h-4 w-4 text-background/50" />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="w-full border-b-2 border-background/30 bg-transparent pb-3 pl-7 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full border-2 border-background py-3 text-base font-medium text-background cursor-pointer transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
            >
                {isLoading ? "signing in..." : "sign in"}
            </button>
        </form>
    )
}
