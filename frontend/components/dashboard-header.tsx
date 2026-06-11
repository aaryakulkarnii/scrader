'use client'

export function DashboardHeader() {
  const now = new Date()
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded border border-primary bg-primary/10 flex items-center justify-center animate-pulse-glow">
              <div className="text-primary font-mono text-sm font-bold">◆</div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-wider">NEXUS</h1>
              <p className="text-xs text-muted-foreground font-mono">AI Market Intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span>LIVE</span>
            </div>
            <span className="text-primary">{timeString}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded border border-primary bg-primary/5 hover:bg-primary/10 text-primary text-sm font-mono transition-colors">
              ANALYSIS
            </button>
            <button className="px-4 py-2 rounded border border-accent bg-accent/5 hover:bg-accent/10 text-accent text-sm font-mono transition-colors">
              ALERTS
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
