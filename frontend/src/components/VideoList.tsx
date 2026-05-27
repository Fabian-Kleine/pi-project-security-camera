import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { VideoModal } from "@/components/VideoModal"
import { type Video, formatDateTime } from "@/data/videos"
import { PlayCircle, RefreshCw } from "lucide-react"
import { API_BASE_URL, PUBLIC_URL, UPDATE_INTERVAL_MS } from "@/config"

const PAGE_SIZE = 12;

type ApiVideo = {
  video_id: string
  video_url: string
  video_thumbnail_url: string
  timestamp: string
  duration_seconds?: number
}

type PaginatedResponse = {
  data: ApiVideo[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

function mapVideo(v: ApiVideo): Video {
  return {
    id: v.video_id,
    filename: v.video_url,
    // MySQL datetime has a space separator; replace with T for reliable parsing
    recordedAt: new Date(v.timestamp.replace(" ", "T")),
    thumbnailUrl: v.video_thumbnail_url,
    videoUrl: v.video_url,
  }
}

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selected, setSelected] = useState<Video | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchVideos = useCallback(async (page: number, manual = false) => {
    if (manual) setRefreshing(true)
    try {
      const res = await fetch(`${API_BASE_URL}/videos?page=${page}&limit=${PAGE_SIZE}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: PaginatedResponse = await res.json()
      setVideos(json.data.map(mapVideo))
      setCurrentPage(json.pagination.page)
      setTotalPages(json.pagination.total_pages)
      setTotal(json.pagination.total)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler beim Laden der Videos")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos(currentPage)
    const id = setInterval(() => fetchVideos(currentPage), UPDATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchVideos, currentPage])

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setLoading(true)
    setCurrentPage(page)
  }

  const grouped = groupByDate(videos)

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {loading ? "Lade Videos…" : error ? "" : `${total} Aufnahmen`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchVideos(currentPage, true)}
            disabled={loading || refreshing}
          >
            <RefreshCw className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`} />
            Aktualisieren
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-muted aspect-video" />
            ))}
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <p className="text-sm text-muted-foreground">Keine Aufnahmen gefunden.</p>
        )}

        {!loading &&
          Object.entries(grouped).map(([date, dateVideos]) => (
            <section key={date}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {date}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dateVideos.map((video) => (
                  <VideoCard key={video.id} video={video} onClick={() => setSelected(video)} />
                ))}
              </div>
            </section>
          ))}

        {!loading && totalPages > 1 && (
          <VideoPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </div>

      <VideoModal video={selected} onClose={() => setSelected(null)} />
    </>
  )
}

function VideoPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const pages = buildPageRange(currentPage, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => { e.preventDefault(); onPageChange(currentPage - 1) }}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pages.map((entry, i) =>
          entry === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink
                href="#"
                isActive={entry === currentPage}
                onClick={(e) => { e.preventDefault(); onPageChange(entry) }}
                className="cursor-pointer"
              >
                {entry}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => { e.preventDefault(); onPageChange(currentPage + 1) }}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function buildPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "ellipsis")[] = [1]

  if (current > 3) pages.push("ellipsis")

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push("ellipsis")

  pages.push(total)
  return pages
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={`${PUBLIC_URL}${video.thumbnailUrl}`}
          alt={video.filename}
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
          <PlayCircle className="size-12 text-white drop-shadow" />
        </div>
      </div>
      <CardContent className="p-3">
        <p className="truncate text-sm font-medium">{video.filename}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(video.recordedAt)}</p>
      </CardContent>
    </Card>
  )
}

function groupByDate(videos: Video[]): Record<string, Video[]> {
  return videos.reduce<Record<string, Video[]>>((acc, video) => {
    const key = video.recordedAt.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    acc[key] = acc[key] ? [...acc[key], video] : [video]
    return acc
  }, {})
}
