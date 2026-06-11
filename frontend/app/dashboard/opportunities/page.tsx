'use client'

import { useState, useEffect } from 'react'
import { opportunities as mockOpps } from '@/lib/mock-data'
import { TrendingUp, Zap, Target, Compass, Loader2 } from 'lucide-react'
import { useProject } from '@/context/ProjectContext'

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    market_gap: <Target className="w-5 h-5" />,
    emerging_trend: <Zap className="w-5 h-5" />,
    undervalued: <TrendingUp className="w-5 h-5" />,
    growth_catalyst: <Compass className="w-5 h-5" />,
  }
  return icons[category] || <Compass className="w-5 h-5" />
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    market_gap: 'text-primary',
    emerging_trend: 'text-secondary',
    undervalued: 'text-accent',
    growth_catalyst: 'text-purple-400',
  }
  return colors[category] || 'text-foreground'
}

const getCategoryBg = (category: string) => {
  const colors: { [key: string]: string } = {
    market_gap: 'bg-primary/10 border-primary/30',
    emerging_trend: 'bg-secondary/10 border-secondary/30',
    undervalued: 'bg-accent/10 border-accent/30',
    growth_catalyst: 'bg-purple-500/10 border-purple-500/30',
  }
  return colors[category] || 'bg-border/10 border-border/30'
}

export default function OpportunitiesPage() {
  const { activeProject } = useProject()
  const [opportunities, setOpportunities] = useState<any[]>(mockOpps)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!activeProject) return
    setIsLoading(true)
    fetch(`http://localhost:8000/api/v1/projects/${activeProject.id}/opportunities`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // simple assumption
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Map backend opportunities to frontend schema
          const mapped = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            category: 'market_gap',
            potentialReturn: Math.round(d.score * 1.5),
            confidence: d.score,
            timeframe: '1-3 Months',
            companies: (d.evidence?.sentiment || []).map((s: any) => s.company).concat(
              (d.evidence?.hiring || []).map((h: any) => h.company)
            )
          }))
          setOpportunities(mapped)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [activeProject])

  const sortedOpportunities = [...opportunities].sort((a, b) => b.potentialReturn - a.potentialReturn)

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-black text-foreground tracking-tight">OPPORTUNITY SCOUT</h1>
        <p className="font-mono text-sm text-muted-foreground">Emerging trends and market gaps discovery</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">TOTAL OPPORTUNITIES</p>
          <p className="text-2xl font-mono font-bold text-foreground">{opportunities.length}</p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">HIGHEST POTENTIAL</p>
          <p className="text-2xl font-mono font-bold text-secondary">
            {Math.max(...opportunities.map(o => o.potentialReturn))}%
          </p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">AVG CONFIDENCE</p>
          <p className="text-2xl font-mono font-bold text-accent">
            {(opportunities.reduce((a, b) => a + b.confidence, 0) / opportunities.length).toFixed(0)}
          </p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">TOTAL MARKET VALUE</p>
          <p className="text-2xl font-mono font-bold text-primary">$2.4T+</p>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="space-y-4">
        <h2 className="font-mono font-bold text-lg text-foreground">RANKED BY POTENTIAL</h2>
        {sortedOpportunities.map((opp, idx) => (
          <div key={opp.id} className={`glass-dark rounded-lg p-6 border transition hover:border-primary/50 ${getCategoryBg(opp.category)}`}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs font-mono font-bold bg-foreground/10 text-foreground">
                      #{idx + 1}
                    </span>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryBg(opp.category)}`}>
                      <div className={getCategoryColor(opp.category)}>
                        {getCategoryIcon(opp.category)}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-mono font-bold text-lg text-foreground mb-1">{opp.title}</h3>
                  <p className={`text-xs font-mono font-bold ${getCategoryColor(opp.category)}`}>
                    {opp.category.replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="mb-2">
                    <p className="text-xs font-mono text-muted-foreground mb-1">POTENTIAL RETURN</p>
                    <p className="text-3xl font-mono font-bold text-secondary">
                      {opp.potentialReturn > 100 ? '+' : ''}{opp.potentialReturn}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                {opp.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-dark rounded px-3 py-2 border border-border/30">
                  <p className="text-xs font-mono text-muted-foreground mb-1">CONFIDENCE</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${opp.confidence}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground">{opp.confidence}</span>
                  </div>
                </div>
                <div className="glass-dark rounded px-3 py-2 border border-border/30">
                  <p className="text-xs font-mono text-muted-foreground mb-1">TIMEFRAME</p>
                  <p className="font-mono text-sm font-bold text-foreground">{opp.timeframe}</p>
                </div>
                <div className="glass-dark rounded px-3 py-2 border border-border/30">
                  <p className="text-xs font-mono text-muted-foreground mb-1">KEY PLAYS</p>
                  <p className="font-mono text-sm font-bold text-primary">{opp.companies.length} Companies</p>
                </div>
              </div>

              {/* Companies */}
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">EXPOSURE</p>
                <div className="flex flex-wrap gap-2">
                  {opp.companies.map((company) => (
                    <span
                      key={company}
                      className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-primary to-accent text-background"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="glass-dark-lg rounded-lg p-8 border border-primary/20 text-center space-y-4">
        <p className="font-mono text-sm text-muted-foreground">Want deeper analysis on any of these opportunities?</p>
        <button 
          onClick={() => window.location.href = '/dashboard/command'}
          className="px-6 py-2 bg-primary text-primary-foreground rounded font-mono text-sm font-bold hover:shadow-lg hover:shadow-primary/50 transition">
          ANALYZE NOW
        </button>
      </div>
    </div>
  )
}
