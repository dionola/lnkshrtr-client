import { useState } from "react"
import type { Link as LinkType } from "@/types"
import { Copy, Check, ExternalLink } from "lucide-react"
import QRCode from "react-qr-code"
import { Modal } from "@/components/common/Modal"
import { useTheme } from "@/hooks/useTheme"

interface LinkDetailModalProps {
    link: LinkType
    onClose: () => void
}

export function LinkDetailModal({ link, onClose }: LinkDetailModalProps) {
    const [copied, setCopied] = useState(false)
    const fullUrl = `${window.location.origin}/${link.shortCode}`
    const { isDark } = useTheme()
    const qrFg = isDark ? "#ffffff" : "#000000"
    const qrBg = isDark ? "#000000" : "#ffffff"

    const handleCopy = async () => {
        await navigator.clipboard.writeText(fullUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Modal title="link details" onClose={onClose} maxWidth="md">
            <div className="mt-6 space-y-4">
                <div>
                    <p className="text-sm text-background/50">short code</p>
                    <p className="mt-1 font-mono text-lg font-medium text-background">
                        /{link.shortCode}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-background/50">full url</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="flex-1 truncate text-background">{fullUrl}</span>
                        <button
                            onClick={handleCopy}
                            className="p-2 text-background/40 cursor-pointer transition-colors hover:text-background"
                            title="Copy"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <a
                            href={`/${link.shortCode}`}
                            target="_blank"
                            className="p-2 text-background/40 cursor-pointer transition-colors hover:text-background"
                            title="Open"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-background/50">destination</p>
                    <p className="mt-1 truncate text-background">{link.originalUrl}</p>
                </div>

                <div>
                    <p className="mb-3 text-sm text-background/50">qr code</p>
                    <div className="flex items-center justify-center rounded border border-background/20 bg-background p-3">
                        <QRCode
                            value={fullUrl}
                            size={150}
                            className="h-auto w-full"
                            fgColor={qrFg}
                            bgColor={qrBg}
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border-2 border-background/30 py-3 text-base font-medium text-background/70 cursor-pointer transition-colors hover:border-background hover:text-background"
                    >
                        close
                    </button>
                </div>
            </div>
        </Modal>
    )
}
