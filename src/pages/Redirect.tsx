import { useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { useLinks } from "@/hooks/useLinks"
import { linksApi } from "@/services/api-client"
import { ArrowLeft, Lock, ExternalLink } from "lucide-react"
import type { Link as LinkType } from "@/types"
import { LoadingScreen } from "@/components/common/LoadingScreen"
import { NotFoundState } from "@/components/common/NotFoundState"

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export default function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const { getLinkByCode, incrementVisits } = useLinks()
  const [link, setLink] = useState<LinkType | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const redirectTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!shortCode) return

    let isCancelled = false

    const loadLink = async () => {
      try {
        const foundLink = await getLinkByCode(shortCode)
        if (isCancelled) return
        setLink(foundLink)

        if (
          foundLink &&
          foundLink.isActive &&
          !foundLink.isPasswordProtected
        ) {
          await linksApi.trackClick(shortCode)
          incrementVisits(foundLink.id)

          if (isSafeUrl(foundLink.originalUrl)) {
            redirectTimeoutRef.current = window.setTimeout(() => {
              window.location.href = foundLink.originalUrl
            }, 100)
          } else {
            setError("this short link points to an invalid destination")
          }
        }
      } catch (error) {
        if (isCancelled) return
        console.error("Failed to load link:", error)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadLink()
    return () => {
      isCancelled = true
    }
  }, [shortCode, getLinkByCode, incrementVisits])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!link || !shortCode) return

    setIsVerifying(true)
    setError("")

    try {
      const success = await linksApi.verifyPassword(shortCode, password)

      if (success) {
        setIsUnlocked(true)
        await linksApi.trackClick(shortCode)
        incrementVisits(link.id)
        if (isSafeUrl(link.originalUrl)) {
          redirectTimeoutRef.current = window.setTimeout(() => {
            window.location.href = link.originalUrl
          }, 1000)
        } else {
          setError("this short link points to an invalid destination")
        }
      } else {
        setError("incorrect password")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "incorrect password")
    } finally {
      setIsVerifying(false)
    }
  }

  if (isLoading) return <LoadingScreen />

  if (!link) {
    return (
      <NotFoundState
        heading="not found"
        description={`/${shortCode} doesn't exist`}
      />
    )
  }

  if (!link.isActive) {
    return (
      <main className="flex-1 bg-foreground">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <h1 className="text-4xl font-bold tracking-tight text-background md:text-5xl">inactive</h1>
          <p className="mt-4 text-background/50">/{shortCode} has been deactivated</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-background/70 cursor-pointer transition-colors hover:text-background hover:underline hover:underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" />
            go home
          </Link>
        </div>
      </main>
    )
  }

  if (link.isPasswordProtected && !isUnlocked) {
    return (
      <main className="flex flex-1 flex-col bg-foreground">
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="w-full max-sm:px-4">
            <div className="w-full max-w-sm mx-auto">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-background" />
                <h1 className="text-3xl font-bold tracking-tight text-background md:text-4xl">
                  protected
                </h1>
              </div>
              <p className="mt-4 text-background/50">/{shortCode} requires a password</p>

              <form onSubmit={handlePasswordSubmit} className="mt-12 space-y-6">
                {error && <p className="text-sm text-red-400">{error}</p>}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full border-b-2 border-background/30 bg-transparent pb-3 text-lg text-background placeholder:text-background/40 focus:border-background focus:outline-none"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full border-2 border-background py-3 text-base font-medium text-background cursor-pointer transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
                >
                  {isVerifying ? "verifying..." : "continue"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col bg-foreground">
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold tracking-tight text-background md:text-4xl">
            redirecting...
          </h1>
          <div className="mt-8 flex items-center justify-center gap-3 text-background/50">
            <ExternalLink className="h-5 w-5" />
            <span className="truncate text-sm">{link.originalUrl}</span>
          </div>
          {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
          <p className="mt-8 text-sm text-background/30">
            not redirecting?{" "}
            <a
              href={link.originalUrl}
              className="text-background cursor-pointer transition-colors hover:text-background/70 hover:underline hover:underline-offset-4"
            >
              click here
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
