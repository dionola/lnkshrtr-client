import { ExternalLink } from "lucide-react"
import type { Link as LinkType } from "@/types"

interface PublicLinkCardProps {
    link: LinkType
    onClick: (link: LinkType) => void
}

export function PublicLinkCard({ link, onClick }: PublicLinkCardProps) {
    return (
        <div
            onClick={() => onClick(link)}
            className="group flex cursor-pointer items-center justify-between border border-background/20 p-5 transition-colors hover:border-background/50"
        >
            <div>
                <span className="font-mono text-lg font-medium text-background">
                    /{link.shortCode}
                </span>
                <p className="mt-1 text-sm text-background/40">{link.title}</p>
            </div>
            <ExternalLink className="h-5 w-5 text-background/40 transition-colors group-hover:text-background" />
        </div>
    )
}
