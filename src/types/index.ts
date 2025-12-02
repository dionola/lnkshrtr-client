export interface User {
    id: string
    username: string
    email: string
    createdAt: Date
    notes?: string
}

export interface Link {
    id: string
    shortCode: string
    originalUrl: string
    title: string
    visits: number
    createdAt: Date
    isPublic: boolean
    isActive: boolean
    isPasswordProtected: boolean
    userId?: string
    type?: "link" | "notes"
    notesContent?: string
    notesImages?: string[]
}

export interface ApiUser {
    id: string
    username: string
    email: string
    createdAt: string
    notes?: string
}

export interface ApiLink {
    id: string
    shortCode: string
    originalUrl: string
    title: string
    visits: number
    createdAt: string
    isPublic: boolean
    isActive: boolean
    isPasswordProtected: boolean
    /** Write-only: only sent to server when updating/creating a password-protected link */
    password?: string
    userId?: string
    type?: "link" | "notes"
    notesContent?: string
    notesImages?: string[]
}
