import { useState } from "react"
import { User, Mail, Lock } from "lucide-react"

interface SignupFormProps {
    onSubmit: (username: string, email: string, password: string) => Promise<void>
    isLoading: boolean
    error: string
}

export function SignupForm({ onSubmit, isLoading, error }: SignupFormProps) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localError, setLocalError] = useState("")

    const displayError = localError || error

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError("")

        if (username.length < 3) {
            setLocalError("username must be at least 3 characters")
            return
        }
        if (password.length < 6) {
            setLocalError("password must be at least 6 characters")
            return
        }

        await onSubmit(username, email, password)
    }

    return (
        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            {displayError && <p className="text-sm text-red-400">{displayError}</p>}

            <div>
                <div className="relative">
                    <User className="absolute left-0 bottom-3.5 h-4 w-4 text-background/50" />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className="w-full border-b-2 border-background/30 bg-transparent pb-3 pl-7 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                        required
                        autoFocus
                    />
                </div>
                <p className="mt-2 text-xs text-background/30">
                    your profile: {window.location.host}/u/{username || "username"}
                </p>
            </div>

            <div className="relative">
                <Mail className="absolute left-0 bottom-3.5 h-4 w-4 text-background/50" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    className="w-full border-b-2 border-background/30 bg-transparent pb-3 pl-7 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                    required
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
                {isLoading ? "creating account..." : "create account"}
            </button>
        </form>
    )
}
