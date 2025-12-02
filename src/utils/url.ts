export function normalizeUrl(input: string): string {
    let url = input.trim()
    if (!url.match(/^https?:\/\//i)) {
        url = `https://${url}`
    }
    return url
}

export function validateDomainTld(input: string): { ok: true; normalized: string } | { ok: false; message: string } {
    const raw = input.trim()
    if (!raw) return { ok: false, message: "please enter a link" }

    const normalized = normalizeUrl(raw)

    try {
        const parsed = new URL(normalized)
        const hostname = parsed.hostname

        if (!hostname.includes(".")) {
            return { ok: false, message: "please enter a domain like domain.tld" }
        }

        const parts = hostname.split(".").filter(Boolean)
        if (parts.length < 2) {
            return { ok: false, message: "please enter a domain like domain.tld" }
        }

        const tld = parts[parts.length - 1]
        if (!tld || tld.length < 1) {
            return { ok: false, message: "please enter a domain like domain.tld" }
        }

        if (hostname.startsWith(".") || hostname.endsWith(".")) {
            return { ok: false, message: "invalid domain" }
        }

        return { ok: true, normalized }
    } catch {
        return { ok: false, message: "invalid link format" }
    }
}
