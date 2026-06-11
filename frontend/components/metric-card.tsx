'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { MarketData } from '@/lib/mock-data'

interface MetricCardProps {
  data: MarketData
  variant?: 'small' | 'large'
}

export function MetricCard({ data, variant = 'small' }: MetricCardProps) {
  const isPositive = data.change >= 0
  const accentColor = isPositive ? 'text-accent' : 'text-destructive'
  const glowClass = isPositive ? 'glow-green' : 'glow-red'

  if (variant === 'large') {
    return (
      <div className={`glass-dark-lg rounded-lg p-6 flex flex-col gap-4 ${glowClass}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-mono tracking-wider">EQUITY</p>
            <h3 className="text-2xl font-mono font-bold text-foreground">{data.symbol}</h3>
          </div>
          <div className={`p-2 rounded border ${isPositive ? 'border-accent bg-accent/10' : 'border-destructive bg-destructive/10'}`}>
            {isPositive ? <TrendingUp className={accentColor} size={20} /> : <TrendingDown className={accentColor} size={20} />}
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-mono font-bold text-foreground">${data.price.toFixed(2)}</span>
          <span className={`text-lg font-mono font-bold ${accentColor}`}>
            {isPositive ? '+' : ''}{data.change.toFixed(2)}
          </span>
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className={`text-sm font-mono ${accentColor}`}>
            {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}% • Vol: {(data.volume / 1_000_000).toFixed(1)}M
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass-dark rounded p-4 flex flex-col gap-3 ${glowClass}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-mono font-bold text-foreground">{data.symbol}</h4>
        {isPositive ? <TrendingUp className={accentColor} size={16} /> : <TrendingDown className={accentColor} size={16} />}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-xl font-mono font-bold text-foreground">${data.price.toFixed(2)}</span>
        <span className={`text-xs font-mono font-bold ${accentColor}`}>
          {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
        </span>
      </div>

      <div className="h-1 bg-border/30 rounded-full overflow-hidden">
        <div
          className={`h-full ${isPositive ? 'bg-accent' : 'bg-destructive'} transition-all duration-500`}
          style={{ width: `${Math.min(Math.abs(data.changePercent) * 10, 100)}%` }}
        />
      </div>
    </div>
  )
}
