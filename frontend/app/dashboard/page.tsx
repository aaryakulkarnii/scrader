'use client'

import { MetricCard } from '@/components/metric-card'
import { AlertPanel } from '@/components/alert-panel'
import { AIInsightCard } from '@/components/ai-insight-card'
import { PortfolioWidget } from '@/components/portfolio-widget'
import { HeatmapPanel } from '@/components/heatmap-panel'
import { DataTable } from '@/components/data-table'
import { portfolio, alerts, aiInsights, generateTrendData } from '@/lib/mock-data'
import { useProject } from '@/context/ProjectContext'
import { fetchAPI } from '@/lib/api'
import { useState, useEffect } from 'react'

export default function DashboardHub() {
  const { activeProject } = useProject()
  
  const [compName, setCompName] = useState("")
  const [compDomain, setCompDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [marketData, setMarketData] = useState<any[]>([])

  useEffect(() => {
    if (!activeProject) return
    fetchAPI(`/competitors/${activeProject.id}`)
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((c: any) => {
            const basePrice = c.metadata_json?.price || Math.random() * 500 + 50;
            return {
              symbol: c.domain.split('.')[0].toUpperCase().slice(0, 5),
              price: basePrice,
              change: c.metadata_json?.change || (Math.random() * 20 - 10),
              changePercent: c.metadata_json?.changePercent || (Math.random() * 10 - 5),
              volume: c.metadata_json?.volume || Math.floor(Math.random() * 10000000) + 1000000,
              trend: generateTrendData(basePrice)
            }
          })
          setMarketData(mapped)
        }
      })
      .catch(console.error)
  }, [activeProject, success]) // refetch on success

  const topMovers = [...marketData].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 3)

  const handleTrackCompetitor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeProject) return
    setLoading(true)
    try {
      await fetchAPI(`/competitors/?project_id=${activeProject.id}`, {
        method: "POST",
        body: JSON.stringify({ name: compName, domain: compDomain })
      })
      setSuccess(true)
      setCompName("")
      setCompDomain("")
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-black text-foreground tracking-tight">COMMAND HUB</h1>
        <p className="font-mono text-sm text-muted-foreground">Market intelligence and portfolio overview</p>
      </div>

      {activeProject && (
        <div className="glass-dark-lg rounded-lg p-6 border border-primary/20">
          <h2 className="text-sm font-mono font-bold text-foreground tracking-wider mb-4">ONBOARD COMPETITOR</h2>
          <form onSubmit={handleTrackCompetitor} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-mono text-muted-foreground mb-1">COMPANY NAME</label>
              <input 
                className="w-full bg-black/50 border border-primary/30 rounded p-2 text-sm font-mono text-white focus:outline-none focus:border-primary"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-mono text-muted-foreground mb-1">DOMAIN</label>
              <input 
                className="w-full bg-black/50 border border-primary/30 rounded p-2 text-sm font-mono text-white focus:outline-none focus:border-primary"
                value={compDomain}
                onChange={(e) => setCompDomain(e.target.value)}
                placeholder="e.g. acme.com"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground font-mono font-bold rounded glow-cyan hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "INITIALIZING..." : "TRACK"}
            </button>
          </form>
          {success && <p className="text-green-400 font-mono text-xs mt-2">Competitor added. Discovery engine engaged.</p>}
        </div>
      )}

      {/* Top metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topMovers.map((data) => (
          <MetricCard key={data.symbol} data={data} variant="large" />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left section - insights and portfolio */}
        <div className="lg:col-span-3 space-y-6">
          {/* AI Insights */}
          <div className="glass-dark-lg rounded-lg p-6">
            <h2 className="text-sm font-mono font-bold text-foreground tracking-wider mb-4">AI INSIGHTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight) => (
                <AIInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>

          {/* Portfolio Widget */}
          <PortfolioWidget holdings={portfolio} />

          {/* Heatmap */}
          <HeatmapPanel data={marketData} />

          {/* Market Scanner */}
          <DataTable data={marketData} />
        </div>

        {/* Right section - alerts */}
        <div className="lg:col-span-1">
          <AlertPanel alerts={alerts} />
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="glass-dark rounded-lg p-4 border border-border/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
          <div>
            <p className="text-xs text-muted-foreground mb-1">MARKET NODES</p>
            <p className="text-foreground font-bold">{marketData.length} Active</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">PORTFOLIO ALLOCATION</p>
            <p className="text-foreground font-bold">{portfolio.length} Holdings</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">SYSTEM STATUS</p>
            <p className="text-accent font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              OPERATIONAL
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">DATA LATENCY</p>
            <p className="text-foreground font-bold">{'<'}100ms</p>
          </div>
        </div>
      </div>
    </div>
  )
}
