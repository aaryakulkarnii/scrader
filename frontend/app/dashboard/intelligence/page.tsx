'use client'

import { useState, useRef, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react'
import { useProject } from '@/context/ProjectContext'
import { fetchAPI } from '@/lib/api'

const getThreatColor = (threat: string) => {
  const colors: { [key: string]: string } = {
    critical: 'text-destructive',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-accent',
  }
  return colors[threat] || 'text-foreground'
}

const getThreatBadge = (threat: string) => {
  const classes: { [key: string]: string } = {
    critical: 'bg-destructive/20 border-destructive/30',
    high: 'bg-orange-500/20 border-orange-500/30',
    medium: 'bg-yellow-500/20 border-yellow-500/30',
    low: 'bg-accent/20 border-accent/30',
  }
  return classes[threat] || 'bg-border/10 border-border/30'
}

const formatNumber = (num: number) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
  return `$${num}`
}

export default function IntelligencePage() {
  const { activeProject } = useProject()
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hello! I am Scrader AI. Ask me any strategic questions about your competitors.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [competitors, setCompetitors] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!activeProject) return
    fetchAPI(`/competitors/${activeProject.id}`)
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            symbol: c.domain,
            sector: c.metadata_json?.sector || 'Technology',
            marketCap: c.metadata_json?.marketCap || Math.random() * 1e11 + 1e9,
            threat: c.threat_scores?.length ? c.threat_scores[0].breakdown_json?.category || 'medium' : 'low',
            momentum: c.metadata_json?.momentum || (Math.random() * 20 - 10),
            employees: c.metadata_json?.employees || Math.floor(Math.random() * 5000) + 100,
            revenue: c.metadata_json?.revenue || Math.random() * 1e10 + 1e7,
            recentMove: c.metadata_json?.recentMove || (Math.random() * 10 - 5)
          }))
          setCompetitors(mapped)
        }
      })
      .catch(console.error)
  }, [activeProject])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    if (!activeProject) {
      setInput('')
      setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: 'Please select a project first to access project-specific intelligence.' }])
      return
    }

    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const response = await fetchAPI('/intelligence/chat', {
        method: 'POST',
        body: JSON.stringify({ project_id: activeProject.id, message: userMsg })
      })
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the intelligence backend." }])
    } finally {
      setIsLoading(false)
    }
  }

  const sortedCompetitors = [...competitors].sort((a, b) => {
    const threatOrder: { [key: string]: number } = { critical: 0, high: 1, medium: 2, low: 3 }
    return threatOrder[a.threat] - threatOrder[b.threat]
  })

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-black text-foreground tracking-tight">INTELLIGENCE</h1>
        <p className="font-mono text-sm text-muted-foreground">Competitive analysis and threat assessment</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-mono text-muted-foreground">CRITICAL THREATS</p>
            <BarChart3 className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-mono font-bold text-destructive">
            {competitors.filter(c => c.threat === 'critical').length}
          </p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-mono text-muted-foreground">TOTAL MARKET CAP</p>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-mono font-bold text-primary">
            ${(competitors.reduce((a, b) => a + b.marketCap, 0) / 1e12).toFixed(1)}T
          </p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-mono text-muted-foreground">TOTAL EMPLOYEES</p>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-mono font-bold text-accent">
            {(competitors.reduce((a, b) => a + b.employees, 0) / 1e3).toFixed(0)}K
          </p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-mono text-muted-foreground">AVG MOMENTUM</p>
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-2xl font-mono font-bold text-secondary">
            {(competitors.reduce((a, b) => a + b.momentum, 0) / competitors.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Competitor Details */}
      <div className="space-y-4">
        <h2 className="font-mono font-bold text-lg text-foreground">COMPETITOR PROFILES</h2>
        {sortedCompetitors.map((competitor) => (
          <div key={competitor.id} className={`glass-dark rounded-lg p-6 border transition hover:border-primary/50 ${getThreatBadge(competitor.threat)}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* Header */}
              <div className="md:col-span-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-mono font-bold text-lg text-foreground">{competitor.name}</h3>
                    <p className="font-mono text-sm text-primary">{competitor.symbol}</p>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-mono font-bold border ${getThreatBadge(competitor.threat)} ${getThreatColor(competitor.threat)}`}>
                    {competitor.threat.toUpperCase()}
                  </div>
                </div>
                <p className="font-mono text-sm text-muted-foreground">{competitor.sector}</p>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">MARKET CAP</p>
                  <p className="font-mono font-bold text-foreground">{formatNumber(competitor.marketCap)}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">EMPLOYEES</p>
                  <p className="font-mono font-bold text-foreground">{(competitor.employees / 1e3).toFixed(0)}K</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">REVENUE</p>
                  <p className="font-mono font-bold text-foreground">{formatNumber(competitor.revenue)}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">MOMENTUM</p>
                  <p className={`font-mono font-bold ${competitor.momentum > 0 ? 'text-accent' : 'text-destructive'}`}>
                    {competitor.momentum > 0 ? '+' : ''}{competitor.momentum.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Recent Move */}
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-1">RECENT MOVE</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${competitor.recentMove > 0 ? 'bg-accent' : 'bg-destructive'}`}
                      style={{ width: `${Math.abs(competitor.recentMove) * 5}%` }}
                    />
                  </div>
                  <p className={`font-mono font-bold text-sm ${competitor.recentMove > 0 ? 'text-accent' : 'text-destructive'}`}>
                    {competitor.recentMove > 0 ? '+' : ''}{competitor.recentMove.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scrader AI Chat */}
      <div className="mt-8 glass-dark-lg rounded-lg border border-primary/30 flex flex-col" style={{ height: '500px' }}>
        <div className="p-4 border-b border-border/30 bg-primary/5 flex items-center gap-3">
          <Bot className="w-5 h-5 text-primary" />
          <h2 className="font-mono font-bold text-foreground">SCRADER AI ADVISOR</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-lg p-4 font-mono text-sm ${msg.role === 'user' ? 'bg-primary/20 text-primary-foreground border border-primary/30' : 'bg-background/50 text-foreground border border-border/30'}`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-accent" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="rounded-lg p-4 font-mono text-sm bg-background/50 text-foreground border border-border/30 flex items-center gap-2">
                Analyzing market signals...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border/30 bg-background/50">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask for strategic insights or threat analysis..."
              className="flex-1 bg-background border border-border/50 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
