import { useState, useEffect, useCallback } from "react"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useLinks } from "@/hooks/useLinks"
import { type Link as LinkType } from "@/types"
import { Plus } from "lucide-react"
import { CreateLinkModal } from "@/components/links/CreateLinkModal"
import { EditLinkModal } from "@/components/links/EditLinkModal"
import { LinkDetailModal } from "@/components/links/LinkDetailModal"
import { LinkStats } from "@/components/dashboard/LinkStats"
import { LinkList } from "@/components/dashboard/LinkList"

export default function Dashboard() {
    const { user, isLoading: isAuthLoading } = useRequireAuth()
    const { links, isLoadingLinks, loadUserLinks, createLink, updateLink, deleteLink } = useLinks()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingLink, setEditingLink] = useState<LinkType | null>(null)
    const [viewingLink, setViewingLink] = useState<LinkType | null>(null)
    const [deleteError, setDeleteError] = useState("")

    useEffect(() => {
        if (!user) return
        loadUserLinks()
    }, [user, loadUserLinks])

    const handleCreateLink = useCallback(async (
        url: string,
        customCode?: string,
        isPublic?: boolean,
        isPasswordProtected?: boolean,
        password?: string,
        userId?: string
    ) => {
        await createLink(url, customCode, isPublic, isPasswordProtected, password, userId)
    }, [createLink])

    const handleUpdateLink = useCallback(async (id: string, updates: Partial<LinkType> & { password?: string }) => {
        await updateLink(id, updates)
        setEditingLink(null)
    }, [updateLink])

    const handleDeleteLink = useCallback(async (id: string) => {
        setDeleteError("")
        try {
            await deleteLink(id)
        } catch (err: unknown) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete link")
        }
    }, [deleteLink])

    if (isAuthLoading || !user) return null

    return (
        <main className="flex-1 bg-foreground">
            <div className="mx-auto max-w-4xl px-6 py-12">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-background md:text-5xl">
                            dashboard
                        </h1>
                        <p className="mt-2 text-background/50">@{user.username}</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 border-2 border-background px-4 py-2 text-sm font-medium text-background cursor-pointer transition-colors hover:bg-background hover:text-foreground"
                    >
                        <Plus className="h-4 w-4" />
                        new link
                    </button>
                </div>

                {deleteError && (
                    <p className="mt-4 text-sm text-red-400">{deleteError}</p>
                )}

                <LinkStats links={links} username={user.username} />

                <div className="mt-12">
                    <h2 className="text-sm font-medium text-background/50">your links</h2>
                    <div className="mt-4">
                        <LinkList
                            links={links}
                            isLoading={isLoadingLinks}
                            onEdit={setEditingLink}
                            onDelete={handleDeleteLink}
                            onView={setViewingLink}
                            onCreateFirst={() => setShowCreateModal(true)}
                        />
                    </div>
                </div>
            </div>

            {showCreateModal && (
                <CreateLinkModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateLink}
                    userId={user.id}
                />
            )}

            {editingLink && (
                <EditLinkModal
                    link={editingLink}
                    onClose={() => setEditingLink(null)}
                    onSave={(updates: Partial<LinkType> & { password?: string }) => handleUpdateLink(editingLink.id, updates)}
                />
            )}

            {viewingLink && (
                <LinkDetailModal
                    link={viewingLink}
                    onClose={() => setViewingLink(null)}
                />
            )}
        </main>
    )
}
