import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useLinks } from "@/hooks/useLinks"
import { linksApi } from "@/services/api-client"
import type { Link as LinkType, User } from "@/types"
import { LoadingScreen } from "@/components/common/LoadingScreen"
import { NotFoundState } from "@/components/common/NotFoundState"
import { LinkDetailModal } from "@/components/links/LinkDetailModal"
import { PublicLinkCard } from "@/components/profile/PublicLinkCard"

export default function UserProfile() {
    const { username } = useParams<{ username: string }>()
    const { getPublicUserLinks } = useLinks()
    const [user, setUser] = useState<User | null>(null)
    const [publicLinks, setPublicLinks] = useState<LinkType[]>([])
    const [isProfileLoading, setIsProfileLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [profileError, setProfileError] = useState("")
    const [viewingLink, setViewingLink] = useState<LinkType | null>(null)

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
