import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VideoModal } from "@/components/VideoModal"
import { type Video, formatDateTime } from "@/data/videos"
import { PlayCircle, RefreshCw } from "lucide-react"
import { API_BASE_URL, PUBLIC_URL, UPDATE_INTERVAL_MS } from "@/config"

type ApiVideo = {
  video_id: string
  video_url: string
  video_thumbnail_url: string
  timestamp: string
  duration_seconds?: number
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

  const fetchVideos = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true)
    try {
      const res = await fetch(API_BASE_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ApiVideo[] = await res.json()
      setVideos(data.map(mapVideo))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler beim Laden der Videos")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
    const id = setInterval(() => fetchVideos(), UPDATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchVideos])

  const grouped = groupByDate(videos)

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {loading ? "Lade Videos…" : error ? "" : `${videos.length} Aufnahmen`}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchVideos(true)}
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
      </div>

      <VideoModal video={selected} onClose={() => setSelected(null)} />
    </>
  )
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
  const sorted = [...videos].sort(
    (a, b) => b.recordedAt.getTime() - a.recordedAt.getTime()
  )
  return sorted.reduce<Record<string, Video[]>>((acc, video) => {
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
