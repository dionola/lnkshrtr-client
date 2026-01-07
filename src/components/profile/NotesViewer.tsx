interface NotesViewerProps {
    notes: string
}

export function NotesViewer({ notes }: NotesViewerProps) {
    return (
        <div className="mt-4 min-h-[200px] border border-background/20 bg-background/5 p-4">
            {notes ? (
                <div className="whitespace-pre-wrap text-background">{notes}</div>
            ) : (
                <p className="text-background/40">no notes yet</p>
            )}
        </div>
    )
}
