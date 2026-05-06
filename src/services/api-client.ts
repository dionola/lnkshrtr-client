import { type ApiUser, type ApiLink } from "../types"

const API_BASE = import.meta.env.VITE_API_URL || "/api"

export class ApiError extends Error {
    status: number
    details?: unknown
    constructor(message: string, status: number, details?: unknown) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.details = details
    }
}

async function parseResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers?.get?.("content-type") || ""

    if (typeof response.json === "function") {
        try {
            return await response.json()
        } catch {
            if (contentType.includes("application/json")) {
                return null
            }
        }
    }

    if (typeof response.text === "function") {
        try {
        const text = await response.text()
        return text ? { message: text } : null
        } catch {
            return null
        }
    }

    return null
}

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("lnk_token") : null
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    }
}

function errorMessage(body: unknown): string {
    if (typeof body !== "object" || body === null) return "Request failed"
    const b = body as Record<string, unknown>
    if (typeof b.error === "object" && b.error !== null) {
        const e = b.error as Record<string, unknown>
        if (typeof e.message === "string") return e.message
    }
    if (typeof b.error === "string") return b.error
    if (typeof b.message === "string") return b.message
    return "Request failed"
}

function errorDetails(body: unknown): unknown {
    if (typeof body !== "object" || body === null) return undefined
    const b = body as Record<string, unknown>
    if (typeof b.error === "object" && b.error !== null) {
        const e = b.error as Record<string, unknown>
        return e.details
    }
    return undefined
}

async function request<T>(path: string, init?: RequestInit, fallbackMessage = "Request failed"): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, init)

    if (!response.ok) {
        const body = await parseResponseBody(response)
        const message = errorMessage(body)
        throw new ApiError(
            message === "Request failed" ? fallbackMessage : message,
            response.status,
            errorDetails(body)
        )
    }

    if (response.status === 204) {
        return undefined as T
    }

    const body = await parseResponseBody(response)
    return body as T
}

export const authApi = {
    async login(email: string, password: string): Promise<{ user: ApiUser; accessToken: string }> {
        return request<{ user: ApiUser; accessToken: string }>("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        })
    },

    async signup(username: string, email: string, password: string): Promise<{ user: ApiUser; accessToken: string }> {
        return request<{ user: ApiUser; accessToken: string }>("/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, email, password }),
        })
    },

    async getMe(): Promise<ApiUser> {
        try {
            return await request<ApiUser>("/auth/me", {
                headers: getAuthHeaders(),
                credentials: "include",
            }, "Failed to get user")
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                throw new ApiError("401", 401)
            }
            throw error
        }
    },
}

export const linksApi = {
    async getLinks(): Promise<ApiLink[]> {
        return request<ApiLink[]>("/links", {
            headers: getAuthHeaders(),
            credentials: "include",
        }, "Failed to get links")
    },

    async getLinkByCode(shortCode: string): Promise<ApiLink> {
        try {
            return await request<ApiLink>(`/links/code/${shortCode}`, {
                headers: { "Content-Type": "application/json" },
            }, "Link not found")
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                throw new ApiError("Link not found", 404)
            }
            throw error
        }
    },

    async createLink(
        url: string,
        customCode?: string,
        isPublic?: boolean,
        isPasswordProtected?: boolean,
        password?: string,
        userId?: string
    ): Promise<ApiLink> {
        return request<ApiLink>("/links", {
            method: "POST",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify({
                url,
                customCode,
                isPublic,
                isPasswordProtected,
                password,
                userId,
            }),
        })
    },

    async updateLink(id: string, updates: Partial<ApiLink>): Promise<ApiLink> {
        return request<ApiLink>(`/links/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            credentials: "include",
            body: JSON.stringify(updates),
        })
    },

    async deleteLink(id: string): Promise<void> {
        await request<void>(`/links/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: "include",
        }, "Failed to delete link")
    },

    async trackClick(shortCode: string): Promise<void> {
        try {
            await fetch(`${API_BASE}/links/code/${shortCode}/click`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
        } catch (error) {
            console.error("Failed to track click:", error)
        }
    },

    async verifyPassword(shortCode: string, password: string): Promise<boolean> {
        return request<boolean>(`/links/code/${shortCode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        })
    },

    async getPublicLinks(username: string): Promise<ApiLink[]> {
        return request<ApiLink[]>(`/public/${username}/links`, undefined, "Failed to get public links")
    },

    async getPublicUser(username: string): Promise<ApiUser> {
        return request<ApiUser>(`/public/${username}`, undefined, "Failed to get user")
    },

}
