import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

interface NotFoundStateProps {
    heading: string
    description: string
}

export function NotFoundState({ heading, description }: NotFoundStateProps) {
    return (
        <main className="flex-1 bg-foreground">
            <div className="mx-auto max-w-4xl px-6 py-24">
                <h1 className="text-4xl font-bold tracking-tight text-background md:text-5xl">
                    {heading}
                </h1>
                <p className="mt-4 text-background/50">{description}</p>
                <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 text-background/70 cursor-pointer transition-colors hover:text-background hover:underline hover:underline-offset-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    go home
                </Link>
            </div>
        </main>
    )
}
