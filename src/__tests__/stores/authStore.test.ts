import { describe, it, expect, vi, beforeEach } from "vitest"
import { act } from "@testing-library/react"
import { useAuthStore } from "@/stores/authStore"
import * as apiClient from "@/services/api-client"
import { ApiError } from "@/services/api-client"

const apiUser = {
    id: "u1",
    username: "alice",
    email: "alice@example.com",
    createdAt: "2024-01-01T00:00:00.000Z",
}

function getStore() {
    return useAuthStore.getState()
}

beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    // Reset store state between tests
    useAuthStore.setState({ user: null, isLoading: true })
})

describe("authStore – initializeAuth", () => {
    it("sets isLoading=false and user=null when no token is stored", async () => {
        await act(async () => {
            await getStore().initializeAuth()
        })
        expect(getStore().isLoading).toBe(false)
        expect(getStore().user).toBeNull()
    })

    it("loads the user from the stored token on mount", async () => {
        localStorage.setItem("lnk_token", "valid-token")
        vi.spyOn(apiClient.authApi, "getMe").mockResolvedValue(apiUser)
        await act(async () => {
            await getStore().initializeAuth()
        })
        expect(getStore().user?.username).toBe("alice")
        expect(getStore().isLoading).toBe(false)
    })

    it("clears the token and leaves user=null when getMe returns 401", async () => {
        localStorage.setItem("lnk_token", "expired-token")
        vi.spyOn(apiClient.authApi, "getMe").mockRejectedValue(new ApiError("401", 401))
        await act(async () => {
            await getStore().initializeAuth()
        })
        expect(getStore().user).toBeNull()
        expect(getStore().isLoading).toBe(false)
        expect(localStorage.getItem("lnk_token")).toBeNull()
    })

    it("clears the token when getMe message includes '401'", async () => {
        localStorage.setItem("lnk_token", "bad-token")
        vi.spyOn(apiClient.authApi, "getMe").mockRejectedValue(new Error("401"))
        await act(async () => {
            await getStore().initializeAuth()
        })
        expect(localStorage.getItem("lnk_token")).toBeNull()
    })
})

describe("authStore – login", () => {
    it("stores the token and sets the user on success", async () => {
        vi.spyOn(apiClient.authApi, "login").mockResolvedValue({
            user: apiUser,
            accessToken: "new-tok",
        })
        let result: any
        await act(async () => {
            result = await getStore().login("a@b.com", "pass")
        })
        expect(result.success).toBe(true)
        expect(getStore().user?.username).toBe("alice")
        expect(localStorage.getItem("lnk_token")).toBe("new-tok")
    })

    it("returns success: false and does not set user on API failure", async () => {
        vi.spyOn(apiClient.authApi, "login").mockRejectedValue(new Error("Bad creds"))
        let result: any
        await act(async () => {
            result = await getStore().login("x@x.com", "bad")
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe("Bad creds")
        expect(getStore().user).toBeNull()
    })
})

describe("authStore – signup", () => {
    it("stores the token and sets the user on success", async () => {
        vi.spyOn(apiClient.authApi, "signup").mockResolvedValue({
            user: apiUser,
            accessToken: "signup-tok",
        })
        let result: any
        await act(async () => {
            result = await getStore().signup("alice", "a@b.com", "pass")
        })
        expect(result.success).toBe(true)
        expect(getStore().user?.username).toBe("alice")
        expect(localStorage.getItem("lnk_token")).toBe("signup-tok")
    })

    it("returns { success: false, error } on API failure", async () => {
        vi.spyOn(apiClient.authApi, "signup").mockRejectedValue(new Error("Email already exists"))
        let result: any
        await act(async () => {
            result = await getStore().signup("u", "e@e.com", "p")
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe("Email already exists")
    })
})

describe("authStore – loginWithToken", () => {
    it("sets user from token", async () => {
        vi.spyOn(apiClient.authApi, "getMe").mockResolvedValue(apiUser)
        await act(async () => {
            await getStore().loginWithToken("tok")
        })
        expect(getStore().user?.username).toBe("alice")
        expect(localStorage.getItem("lnk_token")).toBe("tok")
    })

    it("clears token and re-throws when getMe fails after token is set", async () => {
        vi.spyOn(apiClient.authApi, "getMe").mockRejectedValue(new Error("Invalid"))
        let thrown: any
        await act(async () => {
            try {
                await getStore().loginWithToken("bad-tok")
            } catch (e) {
                thrown = e
            }
        })
        expect(thrown).toBeDefined()
        expect(localStorage.getItem("lnk_token")).toBeNull()
    })
})

describe("authStore – logout", () => {
    it("clears user and removes token from localStorage", async () => {
        localStorage.setItem("lnk_token", "valid")
        vi.spyOn(apiClient.authApi, "getMe").mockResolvedValue(apiUser)
        await act(async () => {
            await getStore().initializeAuth()
        })
        expect(getStore().user?.username).toBe("alice")

        act(() => {
            getStore().logout()
        })
        expect(getStore().user).toBeNull()
        expect(localStorage.getItem("lnk_token")).toBeNull()
    })
})
