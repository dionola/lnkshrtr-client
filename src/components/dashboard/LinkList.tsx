import type { Link as LinkType } from "@/types"
import { LinkRow } from "@/components/links/LinkRow"

interface LinkListProps {
    links: LinkType[]
    isLoading: boolean
    onEdit: (link: LinkType) => void
    onDelete: (id: string) => void
    onView: (link: LinkType) => void
    onCreateFirst: () => void
}

export function LinkList({ links, isLoading, onEdit, onDelete, onView, onCreateFirst }: LinkListProps) {
    if (isLoading) {
        return (
            <div className="border border-background/20 p-12 text-center">
                <p className="text-background/50">loading links...</p>
            </div>
        )
    }

    if (links.length === 0) {
        return (
            <div className="border border-background/20 p-12 text-center">
                <p className="text-background/50">no links yet</p>
                <button
                    onClick={onCreateFirst}
                    className="mt-4 text-background underline cursor-pointer"
                >
                    create your first link
                </button>
            </div>
        )
    }

    return (
        <div>
            {links.map((link) => (
                <LinkRow
                    key={link.id}
                    link={link}
                    onEdit={() => onEdit(link)}
                    onDelete={() => onDelete(link.id)}
                    onView={() => onView(link)}
                />
            ))}
        </div>
    )
}
