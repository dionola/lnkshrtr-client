import { Link } from "react-router-dom"
import type { Link as LinkType } from "@/types"

interface LinkStatsProps {
    links: LinkType[]
    username: string
}

export function LinkStats({ links, username }: LinkStatsProps) {
    const totalVisits = links.reduce((sum, link) => sum + link.visits, 0)

    return (
        <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="border border-background/20 p-6">
                <span className="text-sm text-background/50">total links</span>
                <p className="mt-1 text-3xl font-bold text-background">{links.length}</p>
            </div>
            <div className="border border-background/20 p-6">
                <span className="text-sm text-background/50">total visits</span>
                <p className="mt-1 text-3xl font-bold text-background">{totalVisits}</p>
            </div>
            <div className="border border-background/20 p-6">
                <span className="text-sm text-background/50">public profile</span>
                <Link
                    to={`/u/${username}`}
                    className="mt-1 block text-lg font-medium text-background underline"
                >
                    /u/{username}
                </Link>
            </div>
        </div>
    )
}
