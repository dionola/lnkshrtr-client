import { Loader2 } from "lucide-react"

export function LoadingScreen() {
    return (
        <main className="flex flex-1 flex-col bg-foreground">
            <div className="flex flex-1 flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-background/50" />
                    <p className="text-background/50">loading...</p>
                </div>
            </div>
        </main>
    )
}
