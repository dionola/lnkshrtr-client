import { describe, it, expect } from "vitest"
import { cn } from "@/utils/index"

describe("cn", () => {
    it("returns a single class name unchanged", () => {
        expect(cn("foo")).toBe("foo")
    })

    it("merges multiple class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar")
    })

    it("ignores falsy values", () => {
        expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar")
    })

    it("handles conditional classes via object syntax", () => {
        expect(cn({ foo: true, bar: false })).toBe("foo")
    })

    it("deduplicates conflicting Tailwind classes (tailwind-merge)", () => {
        // tailwind-merge should keep the last conflicting class
        expect(cn("p-2", "p-4")).toBe("p-4")
    })

    it("handles array syntax", () => {
        expect(cn(["foo", "bar"])).toBe("foo bar")
    })

    it("returns empty string for no arguments", () => {
        expect(cn()).toBe("")
    })
})
