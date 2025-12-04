import { useState, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useLinks } from "@/hooks/useLinks"
import { validateDomainTld } from "@/utils/url"
import { Eye, EyeOff, CornerDownLeft } from "lucide-react"

export interface ShortenResult {
    shortCode: string
    originalUrl: string
}

interface ShortenFormProps {
    onSuccess: (result: ShortenResult) => void
}

export function ShortenForm({ onSuccess }: ShortenFormProps) {
    const [url, setUrl] = useState("")
    const [urlError, setUrlError] = useState("")
    const [customCode, setCustomCode] = useState("")
    const [showCustomCodeOption, setShowCustomCodeOption] = useState(false)
    const [showPasswordOption, setShowPasswordOption] = useState(false)
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isPublic, setIsPublic] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverError, setServerError] = useState("")

    const inputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const customCodeRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const { user } = useAuth()
    const { createLink } = useLinks()

    const canSubmit = validateDomainTld(url).ok && !isSubmitting

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setServerError("")
        const validation = validateDomainTld(url)
        if (!validation.ok) {
            setUrlError(validation.message)
            return
        }

        const normalizedUrl = validation.normalized
        const isPasswordProtected = showPasswordOption && password.length > 0

        if (isPasswordProtected && password.length < 6) {
            setUrlError("password must be at least 6 characters")
            return
        }

        const hasCustomCode = showCustomCodeOption && customCode.trim().length > 0

        setIsSubmitting(true)
        try {
            const newLink = await createLink(
                normalizedUrl,
                hasCustomCode ? customCode.trim() : undefined,
                user ? isPublic : true,
                isPasswordProtected,
                isPasswordProtected ? password : undefined,
                user?.id
            )
            onSuccess({ shortCode: newLink.shortCode, originalUrl: normalizedUrl })
            setUrl("")
            setCustomCode("")
            setPassword("")
            setShowCustomCodeOption(false)
            setShowPasswordOption(false)
        } catch (err: unknown) {
            setServerError(err instanceof Error ? err.message : "Failed to shorten link")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div
                className="relative cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value)
                        if (urlError) setUrlError("")
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleSubmit(e as any)
                        }
                    }}
                    className="w-full border-b-2 border-background/30 bg-transparent pb-4 pr-12 text-3xl font-medium text-background placeholder:text-background/40 focus:border-background focus:outline-none md:text-4xl"
                    placeholder="insert link here"
                    required
                    autoFocus
                />
                {canSubmit && (
                    <button
                        type="submit"
                        className="absolute right-0 top-0 flex h-full items-center text-background/40 cursor-pointer transition-colors hover:text-background"
                        aria-label="Shorten link"
                        title="Shorten (Enter)"
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        <CornerDownLeft className="h-6 w-6" />
                    </button>
                )}
            </div>

            {urlError && (
                <p className="mt-3 text-sm text-red-400">{urlError}</p>
            )}
            {serverError && (
                <p className="mt-3 text-sm text-red-400">{serverError}</p>
            )}

            <div className="mt-6 space-y-3">
                <div className="relative">
                    {showCustomCodeOption ? (
                        <div className="relative">
                            <input
                                ref={customCodeRef}
                                type="text"
                                value={customCode}
                                onChange={(e) => setCustomCode(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleSubmit(e as any)
                                    }
                                }}
                                placeholder="enter custom code (optional)"
                                className="w-full border-b border-background/30 bg-transparent pb-2 text-sm text-background placeholder:text-background/30 focus:border-background/50 focus:outline-none pr-8"
                            />
                            <button
                                type="button"
                                onClick={() => { setShowCustomCodeOption(false); setCustomCode("") }}
                                className="absolute right-0 top-0 h-full text-background font-semibold cursor-pointer transition-all hover:text-background/70 hover:text-lg"
                                aria-label="Remove custom code"
                            >
                                -
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setShowCustomCodeOption(true)
                                setTimeout(() => customCodeRef.current?.focus(), 0)
                            }}
                            className="lnk-toggle"
                        >
                            + add custom code
                        </button>
                    )}
                </div>

                <div className="relative">
                    {showPasswordOption ? (
                        <div className="relative flex items-center gap-2">
                            <input
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleSubmit(e as any)
                                    }
                                }}
                                placeholder="enter password"
                                className="w-full border-b border-background/30 bg-transparent pb-2 text-sm text-background placeholder:text-background/30 focus:border-background/50 focus:outline-none pr-20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-7 top-0 flex h-full items-center text-background/60 cursor-pointer transition-colors hover:text-background"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordOption(false)
                                    setPassword("")
                                    setShowPassword(false)
                                }}
                                className="absolute right-0 top-0 h-full text-background font-semibold cursor-pointer transition-all hover:text-background/70 hover:text-lg"
                                aria-label="Remove password"
                            >
                                -
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setShowPasswordOption(true)
                                setTimeout(() => passwordRef.current?.focus(), 0)
                            }}
                            className="lnk-toggle"
                        >
                            + add password
                        </button>
                    )}
                </div>

                {user && (
                    <div className="mt-4 mb-4 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className="text-sm text-background/40 transition-colors hover:text-background hover:underline hover:underline-offset-4 cursor-pointer"
                        >
                            {isPublic ? "public" : "private"}
                        </button>
                    </div>
                )}
            </div>
        </form>
    )
}
