import { create } from "zustand"
import { linksApi } from "../services/api-client"
import { type Link, type ApiLink } from "../types"

function mapApiLink(apiLink: ApiLink): Link {
    return {
        id: apiLink.id,
        shortCode: apiLink.shortCode,
        originalUrl: apiLink.originalUrl,
        title: apiLink.title,
        visits: apiLink.visits,
        createdAt: new Date(apiLink.createdAt),
        isPublic: apiLink.isPublic,
        isActive: apiLink.isActive,
        isPasswordProtected: apiLink.isPasswordProtected,
        userId: apiLink.userId,
    }
}

interface LinksState {
    links: Link[]
    isLoadingLinks: boolean
    linksError: string | null
    loadUserLinks: () => Promise<void>
    createLink: (
        url: string,
        customCode?: string,
        isPublic?: boolean,
        isPasswordProtected?: boolean,
        password?: string,
        userId?: string
    ) => Promise<Link>
    updateLink: (id: string, updates: Partial<Link> & { password?: string }) => Promise<void>
    deleteLink: (id: string) => Promise<void>
    getLinkByCode: (code: string) => Promise<Link | undefined>
    getPublicUserLinks: (username: string) => Promise<Link[]>
    incrementVisits: (id: string) => void
    verifyLinkPassword: (id: string, password: string) => Promise<boolean>
}

export const useLinksStore = create<LinksState>((set, get) => ({
    links: [],
    isLoadingLinks: false,
    linksError: null,

    loadUserLinks: async () => {
        set({ isLoadingLinks: true, linksError: null })
        try {
            const apiLinks = await linksApi.getLinks()
            set({ links: apiLinks.map(mapApiLink), isLoadingLinks: false, linksError: null })
        } catch (error) {
            set({
                isLoadingLinks: false,
                linksError: error instanceof Error ? error.message : "Failed to load links",
            })
        }
    },

    createLink: async (
        url,
        customCode?,
        isPublic = true,
        isPasswordProtected = false,
        password?,
        userId?
    ) => {
        const apiLink = await linksApi.createLink(
            url, customCode, isPublic, isPasswordProtected, password, userId
        )
        const newLink = mapApiLink(apiLink)
        set((state) => ({ links: [newLink, ...state.links], linksError: null }))
        return newLink
    },

    updateLink: async (id, updates: Partial<Link> & { password?: string }) => {
        const apiLink = await linksApi.updateLink(id, {
            title: updates.title,
            isPublic: updates.isPublic,
            isActive: updates.isActive,
            isPasswordProtected: updates.isPasswordProtected,
            password: updates.password,
        })
        const updatedLink = mapApiLink(apiLink)
        set((state) => ({
            links: state.links.map((link) => (link.id === id ? updatedLink : link)),
            linksError: null,
        }))
    },

    deleteLink: async (id) => {
        await linksApi.deleteLink(id)
        set((state) => ({
            links: state.links.filter((link) => link.id !== id),
            linksError: null,
        }))
    },

    getLinkByCode: async (code) => {
        try {
            const apiLink = await linksApi.getLinkByCode(code)
            return mapApiLink(apiLink)
        } catch {
            return undefined
        }
    },

    getPublicUserLinks: async (username) => {
        try {
            const apiLinks = await linksApi.getPublicLinks(username)
            return apiLinks.map(mapApiLink)
        } catch {
            return []
        }
    },

    incrementVisits: (id) => {
        set((state) => ({
            links: state.links.map((link) =>
                link.id === id ? { ...link, visits: link.visits + 1 } : link
            ),
        }))
    },

    verifyLinkPassword: async (id, password) => {
        try {
            const link = get().links.find((l) => l.id === id)
            if (!link) return false
            return await linksApi.verifyPassword(link.shortCode, password)
        } catch {
            return false
        }
    },
}))
