import { screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Header } from "@/components/layout/Header"
import { useAuthStore } from "@/stores/authStore"
import { mockUser, renderWithProviders } from "@/test/helpers"

describe("Header", () => {
    beforeEach(() => {
        useAuthStore.setState({ user: null, isLoading: false, logout: vi.fn() })
    })

    it("does not show signed-out navigation while auth is loading", () => {
        useAuthStore.setState({ user: null, isLoading: true })

        renderWithProviders(<Header isDark={false} toggleTheme={vi.fn()} />)

        expect(screen.queryByRole("link", { name: "sign in" })).not.toBeInTheDocument()
    })

    it("shows signed-in navigation after the user is loaded", () => {
        useAuthStore.setState({ user: mockUser, isLoading: false })

        renderWithProviders(<Header isDark={false} toggleTheme={vi.fn()} />)

        expect(screen.getByRole("link", { name: "dashboard" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "sign out" })).toBeInTheDocument()
        expect(screen.queryByRole("link", { name: "sign in" })).not.toBeInTheDocument()
    })
})
