import { useState } from "react"
import type { Link as LinkType } from "@/types"
import { Modal } from "@/components/common/Modal"

interface LinkUpdates extends Partial<LinkType> {
    password?: string
}

interface EditLinkModalProps {
    link: LinkType
    onClose: () => void
    onSave: (updates: LinkUpdates) => Promise<void>
}

export function EditLinkModal({ link, onClose, onSave }: EditLinkModalProps) {
    const [title, setTitle] = useState(link.title)
    const [isPublic, setIsPublic] = useState(link.isPublic)
    const [isActive, setIsActive] = useState(link.isActive)
    const [isPasswordProtected, setIsPasswordProtected] = useState(link.isPasswordProtected)
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isPasswordProtected && password.length < 6) {
            setError("password must be at least 6 characters")
            return
        }
        setError("")
        setIsSubmitting(true)
        try {
            await onSave({
                title,
                isPublic,
                isActive,
                isPasswordProtected,
                password: isPasswordProtected ? password : undefined,
            })
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update link")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal title="edit link" onClose={onClose} maxWidth="lg" subtitle={`/${link.shortCode}`} closeOnBackdropClick={false}>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {error && <p className="text-sm text-red-400">{error}</p>}

                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="title"
                        className="w-full border-b-2 border-background/30 bg-transparent pb-3 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                        required
                        autoFocus
                    />
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-background/70">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">active</span>
                    </label>

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
                        className="flex-1 border-2 border-background/30 py-3 text-base font-medium text-background/70 transition-colors hover:border-background hover:text-background"
                    >
                        cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 border-2 border-background bg-background py-3 text-base font-medium text-foreground transition-colors hover:bg-transparent hover:text-background disabled:opacity-50"
                    >
                        {isSubmitting ? "saving..." : "save"}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
