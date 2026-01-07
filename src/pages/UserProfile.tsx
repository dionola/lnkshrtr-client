import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useLinks } from "@/hooks/useLinks"
import { useAuth } from "@/hooks/useAuth"
import { linksApi } from "@/services/api-client"
import { Pencil } from "lucide-react"
import type { Link as LinkType, User } from "@/types"
import { LoadingScreen } from "@/components/common/LoadingScreen"
import { NotFoundState } from "@/components/common/NotFoundState"
import { LinkDetailModal } from "@/components/links/LinkDetailModal"
import { NotesEditor } from "@/components/profile/NotesEditor"
import { NotesViewer } from "@/components/profile/NotesViewer"
import { PublicLinkCard } from "@/components/profile/PublicLinkCard"

export default function UserProfile() {
    const { username } = useParams<{ username: string }>()
    const { getPublicUserLinks } = useLinks()
    const { user: currentUser, isLoading: isAuthLoading } = useAuth()
    const [user, setUser] = useState<User | null>(null)
    const [publicLinks, setPublicLinks] = useState<LinkType[]>([])
    const [isProfileLoading, setIsProfileLoading] = useState(true)
    const [isNotesLoading, setIsNotesLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [profileError, setProfileError] = useState("")
    const [viewingLink, setViewingLink] = useState<LinkType | null>(null)
    const [notes, setNotes] = useState("")
    const [savedNotes, setSavedNotes] = useState("")
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [isSavingNotes, setIsSavingNotes] = useState(false)
    const [notesError, setNotesError] = useState("")
    const isOwnProfile = currentUser?.username === username

    useEffect(() => {
        if (!username) return

        let isCancelled = false

        const loadData = async () => {
            setIsProfileLoading(true)
            setNotFound(false)
            setProfileError("")
            try {
                const [apiUser, links] = await Promise.all([
                    linksApi.getPublicUser(username),
                    getPublicUserLinks(username),
                ])

                if (isCancelled) return

                setUser({
                    id: apiUser.id,
                    username: apiUser.username,
                    email: apiUser.email,
                    createdAt: new Date(apiUser.createdAt),
                    notes: apiUser.notes,
                })
                setPublicLinks(links)
            } catch (err: unknown) {
                if (isCancelled) return
                const status = (err as { status?: number })?.status
                if (status === 404) {
                    setNotFound(true)
                } else {
                    console.error("Failed to load profile:", err)
                    setProfileError("failed to load this profile right now")
                }
            } finally {
                if (!isCancelled) {
                    setIsProfileLoading(false)
                }
            }
        }

        loadData()

        return () => {
            isCancelled = true
        }
    }, [username, getPublicUserLinks])

    useEffect(() => {
        if (!username || isAuthLoading) return

        if (!isOwnProfile) {
            setNotes("")
            setSavedNotes("")
            setIsEditingNotes(false)
            setIsNotesLoading(false)
            setNotesError("")
            return
        }

        let isCancelled = false

        const loadNotes = async () => {
            setIsNotesLoading(true)
            setNotesError("")
            try {
                const userNotes = await linksApi.getUserNotes(username)
                if (isCancelled) return
                setNotes(userNotes || "")
                setSavedNotes(userNotes || "")
            } catch (err) {
                if (isCancelled) return
                console.error("Failed to load notes:", err)
                setNotesError("failed to load notes")
            } finally {
                if (!isCancelled) {
                    setIsNotesLoading(false)
                }
            }
        }

        loadNotes()

        return () => {
            isCancelled = true
        }
    }, [username, isAuthLoading, isOwnProfile])

    const handleSaveNotes = async () => {
        if (!username) return
        setIsSavingNotes(true)
        setNotesError("")
        try {
            await linksApi.updateUserNotes(username, notes)
            setSavedNotes(notes)
            setIsEditingNotes(false)
        } catch (err: unknown) {
            console.error("Failed to save notes:", err)
            setNotesError(err instanceof Error ? err.message : "failed to save notes")
        } finally {
            setIsSavingNotes(false)
        }
    }

    const handleCancelNotes = () => {
        setNotes(savedNotes)
        setIsEditingNotes(false)
    }

    if (isProfileLoading) return <LoadingScreen />

    if (notFound || !user) {
        return (
            <NotFoundState
                heading="not found"
                description={`@${username} doesn't exist`}
            />
        )
    }

    return (
        <main className="flex-1 bg-foreground">
            <div className="mx-auto max-w-4xl px-6 py-12">
                <div>
                    <h1 className="text-5xl font-bold tracking-tight text-background md:text-6xl">
                        @{user.username}
                    </h1>
                    <p className="mt-4 text-background/50">
                        member since{" "}
                        {user.createdAt.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>

                {profileError && (
                    <p className="mt-6 text-sm text-red-400">{profileError}</p>
                )}

                {isOwnProfile && (
                    <div className="mt-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium text-background/50">notes</h2>
                            {!isEditingNotes && (
                                <button
                                    onClick={() => setIsEditingNotes(true)}
                                    className="p-1 text-background/40 transition-colors hover:text-background"
                                    title="Edit notes"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {isNotesLoading ? (
                            <div className="mt-4 border border-background/20 p-6 text-background/50">
                                loading notes...
                            </div>
                        ) : isEditingNotes ? (
                            <>
                                <NotesEditor
                                    notes={notes}
                                    onChange={setNotes}
                                    onSave={handleSaveNotes}
                                    onCancel={handleCancelNotes}
                                    isSaving={isSavingNotes}
                                />
                                {notesError && <p className="mt-3 text-sm text-red-400">{notesError}</p>}
                            </>
                        ) : (
                            <>
                                <NotesViewer notes={notes} />
                                {notesError && <p className="mt-3 text-sm text-red-400">{notesError}</p>}
                            </>
                        )}
                    </div>
                )}

                <div className="mt-16">
                    <h2 className="text-sm font-medium text-background/50">
                        public links ({publicLinks.length})
                    </h2>

                    {publicLinks.length === 0 ? (
                        <div className="mt-6 border border-background/20 p-12 text-center">
                            <p className="text-background/50">no public links yet</p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-2">
                            {publicLinks.map((link) => (
                                <PublicLinkCard
                                    key={link.id}
                                    link={link}
                                    onClick={setViewingLink}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {viewingLink && (
                <LinkDetailModal
                    link={viewingLink}
                    onClose={() => setViewingLink(null)}
                />
            )}
        </main>
    )
}
