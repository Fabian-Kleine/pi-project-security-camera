import { VideoList } from "@/components/VideoList"

export function App() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Security Camera</h1>
        <p className="text-sm text-muted-foreground">Recorded footage</p>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <VideoList />
      </main>
    </div>
  )
}

export default App
