import { useState } from "react"
import { Modal } from "@/components/common/Modal"

interface CreateLinkModalProps {
    onClose: () => void
    onCreate: (
        url: string,
        customCode?: string,
        isPublic?: boolean,
        isPasswordProtected?: boolean,
        password?: string,
        userId?: string
    ) => Promise<void>
    userId: string
}

export function CreateLinkModal({ onClose, onCreate, userId }: CreateLinkModalProps) {
    const [url, setUrl] = useState("")
    const [customCode, setCustomCode] = useState("")
    const [isPublic, setIsPublic] = useState(true)
    const [isPasswordProtected, setIsPasswordProtected] = useState(false)
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isPasswordProtected && password.length < 6) {
            setError("password must be at least 6 characters")
            return
        }
        let finalUrl = url.trim()
        if (!finalUrl.match(/^https?:\/\//i)) {
            finalUrl = `https://${finalUrl}`
        }
        try {
            new URL(finalUrl)
        } catch {
            setError("invalid url")
            return
        }
        setError("")
        setIsSubmitting(true)
        try {
            await onCreate(
                finalUrl,
                customCode || undefined,
                isPublic,
                isPasswordProtected,
                isPasswordProtected ? password : undefined,
                userId
            )
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create link")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal title="create link" onClose={onClose} maxWidth="lg" closeOnBackdropClick={false}>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && <p className="text-sm text-red-400">{error}</p>}

                <div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="destination url"
                        className="w-full border-b-2 border-background/30 bg-transparent pb-3 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <input
                        type="text"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        placeholder="custom code (optional)"
                        className="w-full border-b-2 border-background/30 bg-transparent pb-3 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-background/30">
                        {window.location.host}/{customCode || "random"}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-background/70">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">public</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-background/70">
                        <input
                            type="checkbox"
                            checked={isPasswordProtected}
                            onChange={(e) => {
                                setIsPasswordProtected(e.target.checked)
                                if (!e.target.checked) setPassword("")
                            }}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">password</span>
                    </label>
                </div>

                {isPasswordProtected && (
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="enter password (min 6 characters)"
                        className="w-full border-b-2 border-background/30 bg-transparent pb-3 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                        required={isPasswordProtected}
                        minLength={6}
                    />
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border-2 border-background/30 py-3 text-base font-medium text-background/70 cursor-pointer transition-colors hover:border-background hover:text-background"
                    >
                        cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 border-2 border-background bg-background py-3 text-base font-medium text-foreground cursor-pointer transition-colors hover:bg-transparent hover:text-background disabled:opacity-50"
                    >
                        {isSubmitting ? "creating..." : "create"}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
