import { useState } from "react"
import type { Link as LinkType } from "@/types"
import { Copy, Check, Trash2, EyeOff, Lock, Globe, Pencil } from "lucide-react"

export function LinkRow({
    link,
    onEdit,
    onDelete,
    onView,
}: {
    link: LinkType
    onEdit: () => void
    onDelete: () => void
    onView: () => void
}) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(
            `${window.location.origin}/${link.shortCode}`
        )
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="border-b border-background/10 py-6 last:border-b-0">
            <div className="flex items-start justify-between gap-4">
                <div
                    className="flex-1 space-y-1 cursor-pointer"
                    onClick={onView}
                >
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-lg font-medium text-background">
                            /{link.shortCode}
                        </span>
                        <div className="flex items-center gap-2">
                            {link.isPasswordProtected && (
                                <Lock className="h-4 w-4 text-background/40" />
                            )}
                            {link.isPublic ? (
                                <Globe className="h-4 w-4 text-background/40" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-background/40" />
                            )}
                            {!link.isActive && (
                                <span className="text-xs text-red-400">inactive</span>
                            )}
                        </div>
                    </div>
                    <p className="max-w-md truncate text-sm text-background/40">
                        {link.originalUrl}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-2xl font-bold text-background">{link.visits}</span>
                        <p className="text-xs text-background/40">visits</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleCopy}
                            className="p-2 text-background/40 cursor-pointer transition-colors hover:text-background"
                            title="Copy link"
                        >
                            {copied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={onEdit}
                            className="p-2 text-background/40 cursor-pointer transition-colors hover:text-background"
                            title="Edit link"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-background/40 cursor-pointer transition-colors hover:text-red-400"
                            title="Delete link"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
