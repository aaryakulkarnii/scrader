'use client'

import { MarketData } from '@/lib/mock-data'

interface HeatmapPanelProps {
  data: MarketData[]
}

export function HeatmapPanel({ data }: HeatmapPanelProps) {
  return (
    <div className="glass-dark-lg rounded-lg p-6">
      <h2 className="text-sm font-mono font-bold text-foreground tracking-wider mb-4">MARKET HEATMAP</h2>

      <div className="grid grid-cols-3 gap-2">
        {data.map((item) => {
          const isPositive = item.change >= 0
          const intensity = Math.min(Math.abs(item.changePercent) / 5, 1)

          return (
            <div
              key={item.symbol}
              className="relative rounded overflow-hidden border transition-all hover:scale-105 cursor-pointer"
              style={{
                borderColor: isPositive ? `rgba(0, 255, 136, ${0.3 + intensity * 0.7})` : `rgba(255, 51, 51, ${0.3 + intensity * 0.7})`,
                backgroundColor: isPositive
                  ? `rgba(0, 255, 136, ${0.05 + intensity * 0.15})`
                  : `rgba(255, 51, 51, ${0.05 + intensity * 0.15})`,
              }}
            >
              <div className="p-4 text-center">
                <p className="text-sm font-mono font-bold text-foreground mb-2">{item.symbol}</p>
                <p className={`text-lg font-mono font-bold ${isPositive ? 'text-accent' : 'text-destructive'}`}>{isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground mt-2">${item.price.toFixed(2)}</p>
              </div>

              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: isPositive
                    ? `radial-gradient(circle at center, rgba(0, 255, 136, 0.3), transparent)`
                    : `radial-gradient(circle at center, rgba(255, 51, 51, 0.3), transparent)`,
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-xs text-muted-foreground font-mono">
        <p>Color intensity indicates volatility • Size change reflects price movement magnitude</p>
      </div>
    </div>
  )
}
