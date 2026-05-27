import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type Video, formatDateTime, formatDuration } from "@/data/videos"
import { PUBLIC_URL } from "@/config"

type VideoModalProps = {
  video: Video | null
  onClose: () => void
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  return (
    <Dialog open={video !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="truncate text-base font-medium">
            {video?.filename}
          </DialogTitle>
        </DialogHeader>
        {video && (
          <div className="flex flex-col gap-4">
            <video
              key={video.id}
              src={`${PUBLIC_URL}${video.videoUrl}`}
              controls
              autoPlay
              className="w-full rounded-lg bg-black"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{formatDateTime(video.recordedAt)}</Badge>
              <Badge variant="outline">{formatDuration(video.durationSeconds)}</Badge>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
