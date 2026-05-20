export type Video = {
  id: string
  filename: string
  recordedAt: Date
  durationSeconds: number
  thumbnailUrl: string
  videoUrl: string
}

export const mockVideos: Video[] = [
  {
    id: "1",
    filename: "recording_2026-05-20_08-14-33.mp4",
    recordedAt: new Date("2026-05-20T08:14:33"),
    durationSeconds: 47,
    thumbnailUrl: "https://placehold.co/320x180/1a1a2e/ffffff?text=08:14",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "2",
    filename: "recording_2026-05-20_02-31-09.mp4",
    recordedAt: new Date("2026-05-20T02:31:09"),
    durationSeconds: 123,
    thumbnailUrl: "https://placehold.co/320x180/1a1a2e/ffffff?text=02:31",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "3",
    filename: "recording_2026-05-19_23-58-44.mp4",
    recordedAt: new Date("2026-05-19T23:58:44"),
    durationSeconds: 15,
    thumbnailUrl: "https://placehold.co/320x180/1a1a2e/ffffff?text=23:58",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "4",
    filename: "recording_2026-05-19T18-03-21.mp4",
    recordedAt: new Date("2026-05-19T18:03:21"),
    durationSeconds: 302,
    thumbnailUrl: "https://placehold.co/320x180/1a1a2e/ffffff?text=18:03",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "5",
    filename: "recording_2026-05-18_11-27-55.mp4",
    recordedAt: new Date("2026-05-18T11:27:55"),
    durationSeconds: 88,
    thumbnailUrl: "https://placehold.co/320x180/1a1a2e/ffffff?text=11:27",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "6",
    filename: "recording_2026-05-17_07-45-10.mp4",
    recordedAt: new Date("2026-05-17T07:45:10"),
    durationSeconds: 61,
    thumbnailUrl: "https://placehold.co/320x180/1a1a2e/ffffff?text=07:45",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
]

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
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
