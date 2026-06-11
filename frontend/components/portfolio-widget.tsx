'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { PortfolioHolding } from '@/lib/mock-data'

interface PortfolioWidgetProps {
  holdings: PortfolioHolding[]
}

export function PortfolioWidget({ holdings }: PortfolioWidgetProps) {
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0)
  const totalGain = holdings.reduce((sum, h) => sum + h.gain, 0)
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100

  return (
    <div className="glass-dark-lg rounded-lg p-6">
      <h2 className="text-sm font-mono font-bold text-foreground tracking-wider mb-4">PORTFOLIO OVERVIEW</h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-dark rounded p-3">
          <p className="text-xs text-muted-foreground font-mono mb-1">Total Value</p>
          <p className="text-xl font-mono font-bold text-foreground">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="glass-dark rounded p-3">
          <p className="text-xs text-muted-foreground font-mono mb-1">Total Gain</p>
          <p className={`text-xl font-mono font-bold ${totalGain >= 0 ? 'text-accent' : 'text-destructive'}`}>
            ${Math.abs(totalGain).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="glass-dark rounded p-3">
          <p className="text-xs text-muted-foreground font-mono mb-1">Return %</p>
          <p className={`text-xl font-mono font-bold ${totalGainPercent >= 0 ? 'text-accent' : 'text-destructive'}`}>
            {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {holdings.map((holding) => {
          const isPositive = holding.gain >= 0
          return (
            <div key={holding.symbol} className="flex items-center justify-between p-3 bg-border/10 rounded border border-border/20 hover:border-border/40 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-sm text-foreground">{holding.symbol}</span>
                  <span className="text-xs text-muted-foreground">{holding.shares} shares</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">${holding.currentPrice.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">avg: ${holding.avgCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-xs font-mono font-bold ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                    {isPositive ? '+' : '-'}${Math.abs(holding.gain).toFixed(2)}
                  </p>
                  <p className={`text-xs font-mono ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                    {isPositive ? '+' : ''}{holding.gainPercent.toFixed(2)}%
                  </p>
                </div>
                <div>{isPositive ? <TrendingUp className="w-4 h-4 text-accent" /> : <TrendingDown className="w-4 h-4 text-destructive" />}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
