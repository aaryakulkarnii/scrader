'use client'

import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Alert } from '@/lib/mock-data'

interface AlertPanelProps {
  alerts: Alert[]
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />
      case 'warning':
        return <AlertCircle className="w-4 h-4" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'info':
        return <Info className="w-4 h-4" />
    }
  }

  const getColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-destructive border-destructive/30 bg-destructive/5'
      case 'warning':
        return 'text-secondary border-secondary/30 bg-secondary/5'
      case 'success':
        return 'text-accent border-accent/30 bg-accent/5'
      case 'info':
        return 'text-primary border-primary/30 bg-primary/5'
    }
  }

  const getGlowClass = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'glow-red'
      case 'warning':
        return 'glow-amber'
      case 'success':
        return 'glow-green'
      case 'info':
        return 'glow-cyan'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="glass-dark-lg rounded-lg p-6 flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-sm font-mono font-bold text-foreground tracking-wider mb-1">ALERTS & EVENTS</h2>
        <p className="text-xs text-muted-foreground">{alerts.length} active</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded p-3 transition-all hover:shadow-lg ${getColor(alert.type)} ${getGlowClass(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-mono text-xs font-bold text-foreground mb-1">{alert.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{alert.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{formatTime(alert.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full px-3 py-2 rounded border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-mono transition-colors">
        View All Alerts
      </button>
    </div>
  )
}
