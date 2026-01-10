import React, { type ReactNode } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom"
import { vi } from "vitest"
import type { User, Link } from "../types"

export const mockUser: User = {
    id: "user-1",
    username: "testuser",
    email: "test@example.com",
    createdAt: new Date("2024-01-01"),
}

export const mockLink: Link = {
    id: "link-1",
    shortCode: "abc123",
    originalUrl: "https://example.com",
    title: "Example Link",
    visits: 42,
    createdAt: new Date("2024-01-01"),
    isPublic: true,
    isActive: true,
    isPasswordProtected: false,
    userId: "user-1",
    type: "link",
}

export const makeAuthMock = (overrides?: Partial<ReturnType<typeof createAuthMockValues>>) => ({
    ...createAuthMockValues(),
    ...overrides,
})

function createAuthMockValues() {
    return {
        user: null as User | null,
        isLoading: false,
        initializeAuth: vi.fn().mockResolvedValue(undefined),
        login: vi.fn().mockResolvedValue({ success: true }),
        signup: vi.fn().mockResolvedValue({ success: true }),
        loginWithToken: vi.fn().mockResolvedValue(undefined),
        logout: vi.fn(),
    }
}

export const makeLinksMock = (overrides?: Partial<ReturnType<typeof createLinksMockValues>>) => ({
    ...createLinksMockValues(),
    ...overrides,
})

function createLinksMockValues() {
    return {
        links: [] as Link[],
        isLoadingLinks: false,
        loadUserLinks: vi.fn().mockResolvedValue(undefined),
        createLink: vi.fn().mockResolvedValue(mockLink),
        updateLink: vi.fn().mockResolvedValue(undefined),
        deleteLink: vi.fn().mockResolvedValue(undefined),
        getLinkByCode: vi.fn().mockResolvedValue(mockLink),
        getPublicUserLinks: vi.fn().mockResolvedValue([]),
        incrementVisits: vi.fn(),
        verifyLinkPassword: vi.fn().mockResolvedValue(true),
    }
}

interface WrapperOptions extends RenderOptions {
    routerProps?: MemoryRouterProps
}

export function renderWithProviders(
    ui: React.ReactElement,
    { routerProps, ...renderOptions }: WrapperOptions = {}
) {
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <MemoryRouter {...routerProps}>
                {children}
            </MemoryRouter>
        )
    }
    return render(ui, { wrapper: Wrapper, ...renderOptions })
}
