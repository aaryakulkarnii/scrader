'use client'

import { useState, useEffect } from 'react'
import { signals as mockSignals } from '@/lib/mock-data'
import { AlertCircle, TrendingUp, Zap, Award, Lock, Package } from 'lucide-react'
import { useProject } from '@/context/ProjectContext'

const getSignalIcon = (type: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    earnings: <TrendingUp className="w-5 h-5" />,
    acquisition: <Zap className="w-5 h-5" />,
    partnership: <Award className="w-5 h-5" />,
    patent: <Lock className="w-5 h-5" />,
    regulatory: <AlertCircle className="w-5 h-5" />,
    product: <Package className="w-5 h-5" />,
  }
  return icons[type] || <AlertCircle className="w-5 h-5" />
}

const getSeverityColor = (severity: string) => {
  const colors: { [key: string]: string } = {
    critical: 'text-destructive',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-accent',
  }
  return colors[severity] || 'text-foreground'
}

const getSeverityBg = (severity: string) => {
  const colors: { [key: string]: string } = {
    critical: 'bg-destructive/10 border-destructive/30',
    high: 'bg-orange-500/10 border-orange-500/30',
    medium: 'bg-yellow-500/10 border-yellow-500/30',
    low: 'bg-accent/10 border-accent/30',
  }
  return colors[severity] || 'bg-border/10 border-border/30'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) {
    const mins = Math.floor(diff / 60000)
    return `${mins}m ago`
  }
  return `${hours}h ago`
}

export default function SignalsPage() {
  const { activeProject } = useProject()
  const [signals, setSignals] = useState<any[]>(mockSignals)

  useEffect(() => {
    if (!activeProject) return

    const wsUrl = `ws://localhost:8000/ws/${activeProject.id}`
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "new_signal") {
          // Add new signal to the top
          setSignals(prev => [
            {
              id: data.signal_id,
              title: data.title,
              description: data.description || "Real-time AI signal generated.",
              severity: data.threat_level > 80 ? "critical" : data.threat_level > 60 ? "high" : "medium",
              type: "product",
              company: "Competitor",
              timestamp: new Date(),
              score: data.threat_level
            },
            ...prev
          ])
        }
      } catch (err) {
        console.error("WS error:", err)
      }
    }

    return () => {
      ws.close()
    }
  }, [activeProject])

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-black text-foreground tracking-tight">SIGNAL DETECTION</h1>
        <p className="font-mono text-sm text-muted-foreground">Real-time market events and intelligence feeds</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">CRITICAL SIGNALS</p>
          <p className="text-2xl font-mono font-bold text-destructive">{signals.filter(s => s.severity === 'critical').length}</p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">HIGH PRIORITY</p>
          <p className="text-2xl font-mono font-bold text-orange-500">{signals.filter(s => s.severity === 'high').length}</p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">TOTAL SIGNALS</p>
          <p className="text-2xl font-mono font-bold text-foreground">{signals.length}</p>
        </div>
        <div className="glass-dark rounded-lg p-4 border border-border/30">
          <p className="text-xs font-mono text-muted-foreground mb-2">AVG SIGNAL SCORE</p>
          <p className="text-2xl font-mono font-bold text-primary">
            {(signals.reduce((a, b) => a + b.score, 0) / signals.length).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Signals Feed */}
      <div className="space-y-4">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className={`glass-dark rounded-lg p-6 border transition hover:border-primary/50 ${getSeverityBg(signal.severity)}`}
          >
            <div className="flex gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${getSeverityBg(signal.severity)}`}>
                <div className={getSeverityColor(signal.severity)}>
                  {getSignalIcon(signal.type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-mono font-bold text-foreground text-lg">{signal.title}</h3>
                    <p className="font-mono text-sm text-muted-foreground">{signal.company}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-mono text-sm font-bold ${getSeverityColor(signal.severity)}`}>
                      {signal.severity.toUpperCase()}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">{formatTime(signal.timestamp)}</p>
                  </div>
                </div>
                <p className="font-mono text-sm text-muted-foreground mb-3">{signal.description}</p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded text-xs font-mono font-bold text-background bg-gradient-to-r from-primary to-accent">
                    {signal.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${signal.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground">{signal.score}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
