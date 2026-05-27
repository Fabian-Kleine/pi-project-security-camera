export type Video = {
  id: string
  filename: string
  recordedAt: Date
  thumbnailUrl: string
  videoUrl: string
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}
