'use client'

import { TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { AIInsight } from '@/lib/mock-data'

interface AIInsightCardProps {
  insight: AIInsight
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  const sentimentColor = {
    bullish: 'text-accent border-accent/30 bg-accent/5',
    bearish: 'text-destructive border-destructive/30 bg-destructive/5',
    neutral: 'text-primary border-primary/30 bg-primary/5',
  }[insight.sentiment]

  const sentimentIcon = {
    bullish: <TrendingUp className="w-4 h-4" />,
    bearish: <TrendingDown className="w-4 h-4" />,
    neutral: <Zap className="w-4 h-4" />,
  }[insight.sentiment]

  return (
    <div className={`glass-dark rounded-lg p-4 border ${sentimentColor} hover:border-opacity-100 transition-all`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-mono font-bold text-sm text-foreground flex-1">{insight.title}</h3>
        <div className="flex items-center gap-1">{sentimentIcon}</div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <span className="text-xs text-muted-foreground font-mono">Confidence</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-border/30 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${insight.confidence}%` }} />
          </div>
          <span className="text-xs font-mono font-bold text-primary">{insight.confidence}%</span>
        </div>
      </div>
    </div>
  )
}
