import { useState } from "react"
import { Link } from "react-router-dom"
import { Copy, Check, ExternalLink } from "lucide-react"
import QRCode from "react-qr-code"
import { useTheme } from "@/hooks/useTheme"

interface ShortenResultProps {
    shortCode: string
    originalUrl: string
    onReset: () => void
}

export function ShortenResult({ shortCode, originalUrl, onReset }: ShortenResultProps) {
    const [copied, setCopied] = useState(false)
    const { isDark } = useTheme()
    const qrFg = isDark ? "#ffffff" : "#000000"
    const qrBg = isDark ? "#000000" : "#ffffff"

    const handleCopy = async () => {
        await navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full max-w-2xl">
            <div className="mt-2 flex items-center gap-4 border-b-2 border-background/30 pb-4">
                <span className="flex-1 truncate text-3xl font-medium text-background md:text-4xl">
                    {window.location.host}/{shortCode}
                </span>
                <button
                    onClick={handleCopy}
                    className="text-background/70 transition-colors hover:text-background"
                    title="Copy"
                >
                    {copied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                </button>
                <Link
                    to={`/${shortCode}`}
                    target="_blank"
                    className="text-background/70 transition-colors hover:text-background"
                    title="Open"
                >
                    <ExternalLink className="h-6 w-6" />
                </Link>
            </div>

            <p className="mt-3 truncate text-sm text-background/40">{originalUrl}</p>

            <div className="mt-6 flex items-center justify-center">
                <div className="rounded border border-background/20 bg-background p-4">
                    <QRCode
                        value={`${window.location.origin}/${shortCode}`}
                        size={200}
                        className="h-auto w-full"
                        fgColor={qrFg}
                        bgColor={qrBg}
                    />
                </div>
            </div>

            <button
                onClick={onReset}
                className="mt-8 text-sm text-background/40 transition-colors hover:text-background"
            >
                shorten another link
            </button>
        </div>
    )
}
