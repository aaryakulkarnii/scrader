'use client'

import { useState } from 'react'
import { Brain, TrendingUp, Zap, AlertCircle, CheckCircle } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  category: 'strategic' | 'tactical' | 'risk' | 'opportunity'
  confidence: number
  impact: 'high' | 'medium' | 'low'
  description: string
  action: string
  timeline: string
}

const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Build AI Moat Through Infrastructure',
    category: 'strategic',
    confidence: 98,
    impact: 'high',
    description: 'Companies controlling AI infrastructure (chips, platforms) will dominate the decade. MSFT/NVDA/TSMC positioning validates this thesis.',
    action: 'Invest 40-50% of R&D in proprietary AI infrastructure',
    timeline: '12-18 months',
  },
  {
    id: '2',
    title: 'Defensive Positioning Against TSLA',
    category: 'risk',
    confidence: 85,
    impact: 'high',
    description: 'TSLA regulatory scrutiny may accelerate. Traditional auto manufacturers underestimating EV transition speed - hedging opportunity.',
    action: 'Establish strategic partnerships with 2-3 EV suppliers',
    timeline: 'Q1 2024',
  },
  {
    id: '3',
    title: 'Enterprise SaaS Consolidation',
    category: 'opportunity',
    confidence: 82,
    impact: 'high',
    description: 'Mid-market SaaS companies trading below acquisition multiples. Strategic acquirers seeking cloud revenue diversification.',
    action: 'Identify 5-7 acquisition targets in collaboration/productivity space',
    timeline: '6-12 months',
  },
  {
    id: '4',
    title: 'Emerging Markets Expansion',
    category: 'tactical',
    confidence: 76,
    impact: 'medium',
    description: 'India/Southeast Asia showing 25-35% growth in consumer tech adoption. First-mover advantage significant.',
    action: 'Launch localized product offerings in 2-3 key markets',
    timeline: '18-24 months',
  },
  {
    id: '5',
    title: 'Prepare for Market Correction',
    category: 'risk',
    confidence: 71,
    impact: 'high',
    description: 'Multiple technical indicators suggest 15-25% pullback probability. Liquidity and optionality critical.',
    action: 'Increase cash reserves to 30% of balance sheet',
    timeline: 'Q4 2023 - Q1 2024',
  },
]

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    strategic: <Brain className="w-5 h-5" />,
    tactical: <TrendingUp className="w-5 h-5" />,
    opportunity: <Zap className="w-5 h-5" />,
    risk: <AlertCircle className="w-5 h-5" />,
  }
  return icons[category] || <Brain className="w-5 h-5" />
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    strategic: 'text-primary',
    tactical: 'text-accent',
    opportunity: 'text-secondary',
    risk: 'text-destructive',
  }
  return colors[category] || 'text-foreground'
}

const getCategoryBg = (category: string) => {
  const colors: { [key: string]: string } = {
    strategic: 'bg-primary/10 border-primary/30',
    tactical: 'bg-accent/10 border-accent/30',
    opportunity: 'bg-secondary/10 border-secondary/30',
    risk: 'bg-destructive/10 border-destructive/30',
  }
  return colors[category] || 'bg-border/10 border-border/30'
}

export default function FounderModePage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-black text-foreground tracking-tight">FOUNDER MODE</h1>
        <p className="font-mono text-sm text-muted-foreground">Strategic recommendations for C-suite decision makers</p>
      </div>

      {/* Executive Summary */}
      <div className="glass-dark-lg rounded-lg p-8 border border-primary/20">
        <h2 className="font-mono font-bold text-xl text-foreground mb-4">EXECUTIVE SUMMARY</h2>
        <div className="space-y-3 font-mono text-sm text-muted-foreground leading-relaxed">
          <p>
            <span className="text-foreground font-bold">Market Thesis:</span> The next 18-24 months represent critical inflection point. AI infrastructure dominance will determine 10-year competitive positioning. Simultaneously, regulatory headwinds create both risks and opportunities for strategic repositioning.
          </p>
          <p>
            <span className="text-foreground font-bold">Key Finding:</span> Companies that control AI infrastructure (semiconductors, platforms, data) are capturing 3-4x valuation multiples versus traditional software. This suggests massive resource reallocation ahead.
          </p>
          <p>
            <span className="text-foreground font-bold">Action Priority:</span> 60% of focus should shift to AI/infrastructure. Secondary focus on defensive positioning and M&A for consolidation opportunities.
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h2 className="font-mono font-bold text-lg text-foreground">STRATEGIC RECOMMENDATIONS</h2>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`glass-dark rounded-lg p-6 border transition cursor-pointer hover:border-primary/50 ${getCategoryBg(rec.category)}`}
            onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryBg(rec.category)}`}>
                      <div className={getCategoryColor(rec.category)}>
                        {getCategoryIcon(rec.category)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-lg text-foreground">{rec.title}</h3>
                      <p className={`text-xs font-mono font-bold ${getCategoryColor(rec.category)}`}>
                        {rec.category.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-foreground/10 text-foreground mb-2">
                    Impact: {rec.impact.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground">{rec.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Description - Always visible */}
              <p className="font-mono text-sm text-muted-foreground">{rec.description}</p>

              {/* Expandable Details */}
              {expanded === rec.id && (
                <div className="pt-4 border-t border-border/30 space-y-4">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground mb-2">RECOMMENDED ACTION</p>
                    <p className="font-mono text-sm text-foreground bg-input/50 rounded p-3">{rec.action}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-2">TIMELINE</p>
                      <p className="font-mono text-sm font-bold text-foreground">{rec.timeline}</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-2">CONFIDENCE LEVEL</p>
                      <div className="flex items-center gap-2">
                        {rec.confidence > 80 ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-secondary" />
                        )}
                        <span className="font-mono text-sm font-bold text-foreground">{rec.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expand indicator */}
              <div className="text-xs font-mono text-muted-foreground text-right">
                {expanded === rec.id ? 'Collapse' : 'Click to expand details'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Dashboard */}
      <div className="glass-dark-lg rounded-lg p-6 border border-destructive/20 space-y-4">
        <h2 className="font-mono font-bold text-lg text-destructive">RISK DASHBOARD</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-dark rounded-lg p-4 border border-border/30">
            <p className="text-xs font-mono text-muted-foreground mb-2">MARKET VOLATILITY</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-orange-500" />
              </div>
              <span className="font-mono font-bold text-orange-500">ELEVATED</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">30-day volatility spike of 35%</p>
          </div>
          <div className="glass-dark rounded-lg p-4 border border-border/30">
            <p className="text-xs font-mono text-muted-foreground mb-2">REGULATORY RISK</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-orange-500" />
              </div>
              <span className="font-mono font-bold text-orange-500">HIGH</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">Tech/Auto sector in crosshairs</p>
          </div>
          <div className="glass-dark rounded-lg p-4 border border-border/30">
            <p className="text-xs font-mono text-muted-foreground mb-2">COMPETITIVE INTENSITY</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                <div className="w-full h-full bg-destructive" />
              </div>
              <span className="font-mono font-bold text-destructive">CRITICAL</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">AI arms race accelerating</p>
          </div>
        </div>
      </div>
    </div>
  )
}
