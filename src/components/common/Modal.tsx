import { X } from "lucide-react"
import { useEffect, useRef, type ReactNode } from "react"

const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
}

interface ModalProps {
    title: string
    onClose: () => void
    children: ReactNode
    maxWidth?: "sm" | "md" | "lg"
    subtitle?: string
    closeOnBackdropClick?: boolean
}

export function Modal({ title, onClose, children, maxWidth = "md", subtitle, closeOnBackdropClick = true }: ModalProps) {
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current() }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeOnBackdropClick ? onClose : undefined}
        >
            <div
                className={`w-full ${maxWidthClass[maxWidth]} border border-background bg-foreground p-6 max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-background">{title}</h2>
                        {subtitle && (
                            <p className="mt-1 font-mono text-sm text-background/50">{subtitle}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-background/50 hover:text-background cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
