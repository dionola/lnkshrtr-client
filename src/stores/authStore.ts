import { create } from "zustand"
import { authApi, ApiError } from "../services/api-client"
import { type User, type ApiUser } from "../types"

function mapApiUser(apiUser: ApiUser): User {
    return {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        createdAt: new Date(apiUser.createdAt),
    }
}

interface AuthState {
    user: User | null
    isLoading: boolean
    initializeAuth: () => Promise<void>
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
    loginWithToken: (token: string) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,

    initializeAuth: async () => {
        const token = localStorage.getItem("lnk_token")
        if (!token) {
            set({ isLoading: false })
            return
        }
        try {
            const apiUser = await authApi.getMe()
            set({ user: mapApiUser(apiUser), isLoading: false })
        } catch (err: unknown) {
            const status = err instanceof ApiError ? err.status : 0
            const message = err instanceof Error ? err.message : ""
            if (status === 401 || status === 403 || message.includes("401")) {
                localStorage.removeItem("lnk_token")
            }
            set({ isLoading: false })
        }
    },

    login: async (email, password) => {
        set({ isLoading: true })
        try {
            const { user: apiUser, accessToken } = await authApi.login(email, password)
            localStorage.setItem("lnk_token", accessToken)
            set({ user: mapApiUser(apiUser), isLoading: false })
            return { success: true }
        } catch (err: unknown) {
            set({ isLoading: false })
            return { success: false, error: err instanceof Error ? err.message : "Failed to login" }
        }
    },

    signup: async (username, email, password) => {
        set({ isLoading: true })
        try {
            const { user: apiUser, accessToken } = await authApi.signup(username, email, password)
            localStorage.setItem("lnk_token", accessToken)
            set({ user: mapApiUser(apiUser), isLoading: false })
            return { success: true }
        } catch (err: unknown) {
            set({ isLoading: false })
            return { success: false, error: err instanceof Error ? err.message : "Failed to create account" }
        }
    },

    loginWithToken: async (token) => {
        set({ isLoading: true })
        try {
            localStorage.setItem("lnk_token", token)
            const apiUser = await authApi.getMe()
            set({ user: mapApiUser(apiUser), isLoading: false })
        } catch (error) {
            localStorage.removeItem("lnk_token")
            set({ isLoading: false })
            throw error
        }
    },

    logout: () => {
        localStorage.removeItem("lnk_token")
        set({ user: null })
    },
}))
