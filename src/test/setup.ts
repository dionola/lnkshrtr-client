import "@testing-library/jest-dom"
import { vi, afterEach, beforeEach } from "vitest"

const storage = new Map<string, string>()

const localStorageMock: Storage = {
    get length() {
        return storage.size
    },
    clear() {
        storage.clear()
    },
    getItem(key: string) {
        return storage.has(key) ? storage.get(key)! : null
    },
    key(index: number) {
        return Array.from(storage.keys())[index] ?? null
    },
    removeItem(key: string) {
        storage.delete(key)
    },
    setItem(key: string, value: string) {
        storage.set(key, String(value))
    },
}

Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    configurable: true,
})

// Reset localStorage between tests
afterEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
})

// Mock matchMedia (not available in jsdom)
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock navigator.clipboard
Object.defineProperty(navigator, "clipboard", {
    writable: true,
    configurable: true,
    value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue(""),
    },
})

beforeEach(() => {
    localStorage.clear()
})
