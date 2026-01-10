import { describe, it, expect, vi, beforeEach } from "vitest"
import { act } from "@testing-library/react"
import { useLinksStore } from "@/stores/linksStore"
import * as apiClient from "@/services/api-client"

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
    userId: "u1",
    type: "link" as const,
}

function getStore() {
    return useLinksStore.getState()
}

beforeEach(() => {
    vi.restoreAllMocks()
    useLinksStore.setState({ links: [] })
})

describe("linksStore – createLink", () => {
    it("prepends the new link to local state on success", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockResolvedValue(apiLink)
        await act(async () => {
            await getStore().createLink("https://example.com")
        })
        expect(getStore().links).toHaveLength(1)
        expect(getStore().links[0].shortCode).toBe("abc")
    })

    it("maps createdAt string to a Date object", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockResolvedValue(apiLink)
        let result: any
        await act(async () => {
            result = await getStore().createLink("https://x.com")
        })
        expect(result.createdAt instanceof Date).toBe(true)
    })

    it("re-throws on API failure", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockRejectedValue(new Error("Server error"))
        let thrown: any
        await act(async () => {
            try {
                await getStore().createLink("https://x.com")
            } catch (e) {
                thrown = e
            }
        })
        expect(thrown?.message).toBe("Server error")
    })
})

describe("linksStore – updateLink", () => {
    it("updates the link in local state", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockResolvedValue(apiLink)
        vi.spyOn(apiClient.linksApi, "updateLink").mockResolvedValue({ ...apiLink, title: "Updated" })
        await act(async () => {
            await getStore().createLink("https://example.com")
            await getStore().updateLink("l1", { title: "Updated" })
        })
        expect(getStore().links).toHaveLength(1)
        expect(getStore().links[0].title).toBe("Updated")
    })

    it("re-throws on API failure", async () => {
        vi.spyOn(apiClient.linksApi, "updateLink").mockRejectedValue(new Error("Forbidden"))
        let thrown: any
        await act(async () => {
            try {
                await getStore().updateLink("l1", {})
            } catch (e) {
                thrown = e
            }
        })
        expect(thrown?.message).toBe("Forbidden")
    })
})

describe("linksStore – deleteLink", () => {
    it("removes the link from local state", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockResolvedValue(apiLink)
        vi.spyOn(apiClient.linksApi, "deleteLink").mockResolvedValue(undefined)
        await act(async () => {
            await getStore().createLink("https://example.com")
        })
        expect(getStore().links).toHaveLength(1)
        await act(async () => {
            await getStore().deleteLink("l1")
        })
        expect(getStore().links).toHaveLength(0)
    })

    it("re-throws on failure", async () => {
        vi.spyOn(apiClient.linksApi, "deleteLink").mockRejectedValue(new Error("Not found"))
        let thrown: any
        await act(async () => {
            try {
                await getStore().deleteLink("l1")
            } catch (e) {
                thrown = e
            }
        })
        expect(thrown?.message).toBe("Not found")
    })
})

describe("linksStore – getLinkByCode", () => {
    it("returns a mapped Link on success", async () => {
        vi.spyOn(apiClient.linksApi, "getLinkByCode").mockResolvedValue(apiLink)
        let found: any
        await act(async () => {
            found = await getStore().getLinkByCode("abc")
        })
        expect(found?.shortCode).toBe("abc")
    })

    it("returns undefined on API failure (silent)", async () => {
        vi.spyOn(apiClient.linksApi, "getLinkByCode").mockRejectedValue(new Error("Not found"))
        let result: any = "unset"
        await act(async () => {
            result = await getStore().getLinkByCode("nope")
        })
        expect(result).toBeUndefined()
    })
})

describe("linksStore – loadUserLinks", () => {
    it("fetches links and sets them in store state", async () => {
        vi.spyOn(apiClient.linksApi, "getLinks").mockResolvedValue([apiLink])
        await act(async () => {
            await getStore().loadUserLinks()
        })
        expect(getStore().links).toHaveLength(1)
        expect(getStore().links[0].shortCode).toBe("abc")
        expect(getStore().isLoadingLinks).toBe(false)
    })

    it("sets isLoadingLinks back to false on failure (silent)", async () => {
        vi.spyOn(apiClient.linksApi, "getLinks").mockRejectedValue(new Error("Error"))
        await act(async () => {
            await getStore().loadUserLinks()
        })
        expect(getStore().links).toHaveLength(0)
        expect(getStore().isLoadingLinks).toBe(false)
    })
})

describe("linksStore – getPublicUserLinks", () => {
    it("returns mapped public links", async () => {
        vi.spyOn(apiClient.linksApi, "getPublicLinks").mockResolvedValue([apiLink])
        let result: any
        await act(async () => {
            result = await getStore().getPublicUserLinks("alice")
        })
        expect(result).toHaveLength(1)
    })

    it("returns [] on failure", async () => {
        vi.spyOn(apiClient.linksApi, "getPublicLinks").mockRejectedValue(new Error("Error"))
        let result: any = "unset"
        await act(async () => {
            result = await getStore().getPublicUserLinks("ghost")
        })
        expect(Array.isArray(result)).toBe(true)
        expect(result).toHaveLength(0)
    })
})

describe("linksStore – incrementVisits", () => {
    it("increments the visit count for the matching link in state", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockResolvedValue(apiLink)
        await act(async () => {
            await getStore().createLink("https://example.com")
        })
        expect(getStore().links[0].visits).toBe(5)
        act(() => {
            getStore().incrementVisits("l1")
        })
        expect(getStore().links[0].visits).toBe(6)
    })
})

describe("linksStore – verifyLinkPassword", () => {
    it("returns true when password is correct", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockResolvedValue(apiLink)
        vi.spyOn(apiClient.linksApi, "verifyPassword").mockResolvedValue(true)
        await act(async () => {
            await getStore().createLink("https://x.com")
        })
        let result: any
        await act(async () => {
            result = await getStore().verifyLinkPassword("l1", "pass")
        })
        expect(result).toBe(true)
    })

    it("returns false when the link is not in local state", async () => {
        let result: any = "unset"
        await act(async () => {
            result = await getStore().verifyLinkPassword("missing", "pass")
        })
        expect(result).toBe(false)
    })

    it("returns false on API error", async () => {
        vi.spyOn(apiClient.linksApi, "createLink").mockResolvedValue(apiLink)
        vi.spyOn(apiClient.linksApi, "verifyPassword").mockRejectedValue(new Error("Wrong"))
        await act(async () => {
            await getStore().createLink("https://x.com")
        })
        let result: any = "unset"
        await act(async () => {
            result = await getStore().verifyLinkPassword("l1", "bad")
        })
        expect(result).toBe(false)
    })
})
