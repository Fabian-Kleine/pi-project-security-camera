import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoModal } from "@/components/VideoModal"
import { mockVideos, type Video, formatDateTime, formatDuration } from "@/data/mockVideos"
import { PlayCircle } from "lucide-react"

export function VideoList() {
  const [selected, setSelected] = useState<Video | null>(null)

  const grouped = groupByDate(mockVideos)

  return (
    <>
      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([date, videos]) => (
          <section key={date}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {date}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => setSelected(video)}
                />
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
          src={video.thumbnailUrl}
          alt={video.filename}
          className="aspect-video w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
          <PlayCircle className="size-12 text-white drop-shadow" />
        </div>
        <Badge
          variant="secondary"
          className="absolute bottom-2 right-2 bg-black/60 text-white"
        >
          {formatDuration(video.durationSeconds)}
        </Badge>
      </div>
      <CardContent className="p-3">
        <p className="truncate text-sm font-medium">{video.filename}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDateTime(video.recordedAt)}
        </p>
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
