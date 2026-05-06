import { describe, it, expect, vi, beforeEach } from "vitest"
import { authApi, linksApi } from "@/services/api-client"

function mockFetchOk(body: unknown) {
    return vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(body),
        status: 200,
    } as Partial<Response> as Response)
}

function mockFetchError(body: unknown, status = 400) {
    return vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(body),
        status,
    } as Partial<Response> as Response)
}

const apiUser = {
    id: "u1",
    username: "alice",
    email: "alice@example.com",
    createdAt: "2024-01-01T00:00:00.000Z",
}

const apiLink = {
    id: "l1",
    shortCode: "abc",
    originalUrl: "https://example.com",
    title: "Example",
    visits: 5,
    createdAt: "2024-01-01T00:00:00.000Z",
    isPublic: true,
    isActive: true,
    isPasswordProtected: false,
}

beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
})

// ─── authApi ─────────────────────────────────────────────────────────────────

describe("authApi.login", () => {
    it("POSTs to /api/auth/login and returns user + accessToken", async () => {
        vi.stubGlobal("fetch", mockFetchOk({ user: apiUser, accessToken: "tok1" }))
        const result = await authApi.login("alice@example.com", "pass123")
        expect(result.accessToken).toBe("tok1")
        expect(result.user.username).toBe("alice")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/auth/login")
    })

    it("throws with server error message on failure", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Invalid credentials" }))
        await expect(authApi.login("x@x.com", "wrong")).rejects.toThrow("Invalid credentials")
    })

    it("throws generic message if response has no error field", async () => {
        vi.stubGlobal("fetch", mockFetchError({}))
        await expect(authApi.login("x@x.com", "wrong")).rejects.toThrow("Request failed")
    })
})

describe("authApi.signup", () => {
    it("POSTs to /api/auth/signup and returns user + accessToken", async () => {
        vi.stubGlobal("fetch", mockFetchOk({ user: apiUser, accessToken: "tok2" }))
        const result = await authApi.signup("alice", "alice@example.com", "pass123")
        expect(result.accessToken).toBe("tok2")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/auth/signup")
        expect(JSON.parse((calls[0][1] as RequestInit).body as string)).toMatchObject({ username: "alice" })
    })

    it("throws on failure", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Email taken" }))
        await expect(authApi.signup("alice", "taken@example.com", "pass")).rejects.toThrow("Email taken")
    })
})

describe("authApi.getMe", () => {
    it("GETs /api/auth/me and returns the user directly", async () => {
        localStorage.setItem("lnk_token", "my-token")
        vi.stubGlobal("fetch", mockFetchOk(apiUser))
        const result = await authApi.getMe()
        expect(result.id).toBe("u1")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/auth/me")
        expect((calls[0][1] as RequestInit).headers as Record<string, string>).toMatchObject({ Authorization: "Bearer my-token" })
    })

    it("throws with status 401 attached on unauthorized", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Unauthorized" }, 401))
        const err: any = await authApi.getMe().catch((e) => e)
        expect(err.status).toBe(401)
        expect(err.message).toContain("401")
    })

    it("throws with a non-401 status attached", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Server error" }, 500))
        const err: any = await authApi.getMe().catch((e) => e)
        expect(err.status).toBe(500)
    })
})

// ─── linksApi ────────────────────────────────────────────────────────────────

describe("linksApi.getLinks", () => {
    it("GETs /api/links and returns links array directly", async () => {
        vi.stubGlobal("fetch", mockFetchOk([apiLink]))
        const result = await linksApi.getLinks()
        expect(result).toHaveLength(1)
        expect(result[0].shortCode).toBe("abc")
    })

    it("throws on failure", async () => {
        vi.stubGlobal("fetch", mockFetchError({}))
        await expect(linksApi.getLinks()).rejects.toThrow("Failed to get links")
    })
})

describe("linksApi.getLinkByCode", () => {
    it("GETs /api/links/code/:shortCode and returns link directly", async () => {
        vi.stubGlobal("fetch", mockFetchOk(apiLink))
        const result = await linksApi.getLinkByCode("abc")
        expect(result.shortCode).toBe("abc")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/links/code/abc")
    })

    it("throws when link is not found", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Not found" }, 404))
        await expect(linksApi.getLinkByCode("nope")).rejects.toThrow("Link not found")
    })
})

describe("linksApi.createLink", () => {
    it("POSTs to /api/links with the correct payload and returns link directly", async () => {
        vi.stubGlobal("fetch", mockFetchOk(apiLink))
        const result = await linksApi.createLink(
            "https://example.com",
            "mycode",
            true,
            false,
            undefined,
            "u1"
        )
        expect(result.id).toBe("l1")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect((calls[0][1] as RequestInit).method).toBe("POST")
        const body = JSON.parse((calls[0][1] as RequestInit).body as string)
        expect(body.url).toBe("https://example.com")
        expect(body.customCode).toBe("mycode")
    })

    it("throws with server error on failure", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Custom code taken" }))
        await expect(linksApi.createLink("https://x.com")).rejects.toThrow("Custom code taken")
    })
})

describe("linksApi.updateLink", () => {
    it("PUTs to /api/links/:id and returns updated link directly", async () => {
        vi.stubGlobal("fetch", mockFetchOk({ ...apiLink, title: "Updated" }))
        const result = await linksApi.updateLink("l1", { title: "Updated" })
        expect(result.title).toBe("Updated")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/links/l1")
        expect((calls[0][1] as RequestInit).method).toBe("PUT")
    })

    it("throws on failure", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Not authorized" }))
        await expect(linksApi.updateLink("l1", {})).rejects.toThrow("Not authorized")
    })
})

describe("linksApi.deleteLink", () => {
    it("DELETEs /api/links/:id", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true } as Response))
        await linksApi.deleteLink("l1")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/links/l1")
        expect((calls[0][1] as RequestInit).method).toBe("DELETE")
    })

    it("throws on failure", async () => {
        vi.stubGlobal("fetch", mockFetchError({}))
        await expect(linksApi.deleteLink("l1")).rejects.toThrow("Failed to delete link")
    })
})

describe("linksApi.trackClick", () => {
    it("POSTs to /api/links/code/:shortCode/click", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true } as Response))
        await linksApi.trackClick("abc")
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/links/code/abc/click")
        expect((calls[0][1] as RequestInit).method).toBe("POST")
    })

    it("does not throw even if the request fails (fire-and-forget)", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")))
        await expect(linksApi.trackClick("abc")).resolves.toBeUndefined()
    })
})

describe("linksApi.verifyPassword", () => {
    it("POSTs to /api/links/code/:shortCode with password and returns boolean directly", async () => {
        vi.stubGlobal("fetch", mockFetchOk(true))
        const result = await linksApi.verifyPassword("abc", "hunter2")
        expect(result).toBe(true)
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect((calls[0][1] as RequestInit).method).toBe("POST")
        expect(JSON.parse((calls[0][1] as RequestInit).body as string)).toEqual({ password: "hunter2" })
    })

    it("throws on incorrect password response", async () => {
        vi.stubGlobal("fetch", mockFetchError({ error: "Wrong password" }))
        await expect(linksApi.verifyPassword("abc", "bad")).rejects.toThrow("Wrong password")
    })
})

describe("linksApi.getPublicLinks", () => {
    it("GETs /api/public/:username/links and returns array directly", async () => {
        vi.stubGlobal("fetch", mockFetchOk([apiLink]))
        const result = await linksApi.getPublicLinks("alice")
        expect(result).toHaveLength(1)
        const calls = vi.mocked(globalThis.fetch).mock.calls
        expect(String(calls[0][0])).toContain("/public/alice/links")
    })
})

describe("linksApi.getPublicUser", () => {
    it("GETs /api/public/:username and returns user directly", async () => {
        vi.stubGlobal("fetch", mockFetchOk(apiUser))
        const result = await linksApi.getPublicUser("alice")
        expect(result.username).toBe("alice")
    })
})
