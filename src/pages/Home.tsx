import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { ShortenForm, type ShortenResult } from "@/components/home/ShortenForm"
import { ShortenResult as ShortenResultView } from "@/components/home/ShortenResult"

export default function Home() {
    const [shortenedLink, setShortenedLink] = useState<ShortenResult | null>(null)
    const { user, isLoading } = useAuth()

    return (
        <>
            <div className="flex flex-1 flex-col items-center justify-center px-6">
                {shortenedLink ? (
                    <ShortenResultView
                        shortCode={shortenedLink.shortCode}
                        originalUrl={shortenedLink.originalUrl}
                        onReset={() => setShortenedLink(null)}
                    />
                ) : (
                    <ShortenForm onSuccess={setShortenedLink} />
                )}
            </div>

            <footer className="px-6 py-5">
                {!isLoading && !user && (
                    <p className="text-sm text-background/30">
                        <Link to="/signup" className="underline hover:text-background/50">
                            sign up
                        </Link>
                        {" to track visits and manage links"}
                    </p>
                )}
            </footer>
        </>
    )
}
