interface NotesEditorProps {
    notes: string
    onChange: (value: string) => void
    onSave: () => void
    onCancel: () => void
    isSaving: boolean
}

export function NotesEditor({ notes, onChange, onSave, onCancel, isSaving }: NotesEditorProps) {
    return (
        <div className="mt-4 space-y-3">
            <textarea
                value={notes}
                onChange={(e) => onChange(e.target.value)}
                placeholder="add your notes here..."
                className="w-full min-h-[200px] border border-background/20 bg-background/5 p-4 text-background placeholder:text-background/30 focus:border-background/50 focus:outline-none resize-y"
                autoFocus
            />
            <div className="flex gap-3">
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="border-2 border-background bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-transparent hover:text-background disabled:opacity-50"
                >
                    {isSaving ? "saving..." : "save"}
                </button>
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="border-2 border-background/30 px-4 py-2 text-sm font-medium text-background/70 transition-colors hover:border-background hover:text-background disabled:opacity-50"
                >
                    cancel
                </button>
            </div>
        </div>
    )
}
