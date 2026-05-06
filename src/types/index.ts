export interface User {
    id: string
    username: string
    email: string
    createdAt: Date
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
}

export interface ApiUser {
    id: string
    username: string
    email: string
    createdAt: string
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
}

