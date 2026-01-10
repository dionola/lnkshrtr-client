import { describe, it, expect } from "vitest"
import { normalizeUrl, validateDomainTld } from "@/utils/url"

describe("normalizeUrl", () => {
    it("leaves https:// URLs unchanged", () => {
        expect(normalizeUrl("https://example.com")).toBe("https://example.com")
    })

    it("leaves http:// URLs unchanged", () => {
        expect(normalizeUrl("http://example.com")).toBe("http://example.com")
    })

    it("prepends https:// when no protocol is present", () => {
        expect(normalizeUrl("example.com")).toBe("https://example.com")
    })

    it("trims leading/trailing whitespace before normalizing", () => {
        expect(normalizeUrl("  example.com  ")).toBe("https://example.com")
    })

    it("handles subdomains without protocol", () => {
        expect(normalizeUrl("sub.example.com")).toBe("https://sub.example.com")
    })

    it("is case-insensitive on the protocol check (HTTP://)", () => {
        expect(normalizeUrl("HTTP://example.com")).toBe("HTTP://example.com")
    })

    it("is case-insensitive on the protocol check (HTTPS://)", () => {
        expect(normalizeUrl("HTTPS://example.com")).toBe("HTTPS://example.com")
    })
})

describe("validateDomainTld", () => {
    it("returns ok:true for a valid URL", () => {
        const result = validateDomainTld("https://example.com")
        expect(result.ok).toBe(true)
        if (result.ok) expect(result.normalized).toBe("https://example.com")
    })

    it("returns ok:true and normalizes a URL missing a protocol", () => {
        const result = validateDomainTld("example.com")
        expect(result.ok).toBe(true)
        if (result.ok) expect(result.normalized).toBe("https://example.com")
    })

    it("returns ok:true for URLs with paths", () => {
        const result = validateDomainTld("example.com/some/path?query=1")
        expect(result.ok).toBe(true)
    })

    it("returns ok:true for subdomain URLs", () => {
        const result = validateDomainTld("blog.example.co.uk")
        expect(result.ok).toBe(true)
    })

    it("returns ok:false with 'please enter a link' for empty input", () => {
        const result = validateDomainTld("")
        expect(result.ok).toBe(false)
        if (!result.ok) expect(result.message).toBe("please enter a link")
    })

    it("returns ok:false for whitespace-only input", () => {
        const result = validateDomainTld("   ")
        expect(result.ok).toBe(false)
        if (!result.ok) expect(result.message).toBe("please enter a link")
    })

    it("returns ok:false for a hostname without a dot", () => {
        const result = validateDomainTld("localhost")
        expect(result.ok).toBe(false)
        if (!result.ok) expect(result.message).toBe("please enter a domain like domain.tld")
    })

    it("returns ok:false for an invalid URL format", () => {
        // A bare string that can't be parsed as a URL (but URL constructor is lenient)
        // Test a truly unparseable string
        const result = validateDomainTld("not a url at all!")
        // The URL constructor with https:// prepended may still parse this
        // but hostname will lack a valid dot structure
        expect(result.ok).toBe(false)
    })

    it("trims whitespace before validation", () => {
        const result = validateDomainTld("  example.com  ")
        expect(result.ok).toBe(true)
    })

    it("returns ok:true for common TLDs (.io, .dev, .app)", () => {
        expect(validateDomainTld("myapp.io").ok).toBe(true)
        expect(validateDomainTld("myapp.dev").ok).toBe(true)
        expect(validateDomainTld("myapp.app").ok).toBe(true)
    })
})
