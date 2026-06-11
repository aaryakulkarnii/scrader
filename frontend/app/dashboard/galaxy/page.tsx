'use client'

import { MarketGalaxyVisualization } from '@/components/market-galaxy'

export default function GalaxyPage() {
  return (
    <div className="px-6 py-6 space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-black text-foreground tracking-tight">MARKET GALAXY</h1>
        <p className="font-mono text-sm text-muted-foreground">Competitive landscape and threat visualization</p>
      </div>

      {/* Galaxy Visualization */}
      <div className="glass-dark-lg rounded-lg p-0 overflow-hidden border border-primary/20 flex flex-col relative" style={{ height: '750px' }}>
        <MarketGalaxyVisualization />
      </div>

      {/* Legend */}
      <div className="glass-dark rounded-lg p-4 border border-border/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="font-mono text-sm text-muted-foreground">Critical Threat</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="font-mono text-sm text-muted-foreground">High Threat</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="font-mono text-sm text-muted-foreground">Medium Threat</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="font-mono text-sm text-muted-foreground">Low Threat</span>
          </div>
        </div>
      </div>
    </div>
  )
}
