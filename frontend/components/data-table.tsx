'use client'

import { MarketData } from '@/lib/mock-data'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface DataTableProps {
  data: MarketData[]
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="glass-dark-lg rounded-lg p-6 overflow-hidden">
      <h2 className="text-sm font-mono font-bold text-foreground tracking-wider mb-4">MARKET SCANNER</h2>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-bold tracking-wider">SYMBOL</th>
              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-bold tracking-wider">PRICE</th>
              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-bold tracking-wider">CHANGE</th>
              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-bold tracking-wider">%</th>
              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-bold tracking-wider">VOLUME</th>
              <th className="text-center py-2 px-3 text-xs text-muted-foreground font-bold tracking-wider">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isPositive = item.change >= 0
              return (
                <tr
                  key={item.symbol}
                  className="border-b border-border/10 hover:bg-border/10 transition-colors group"
                >
                  <td className="py-3 px-3">
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{item.symbol}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-foreground">${item.price.toFixed(2)}</td>
                  <td className={`py-3 px-3 text-right font-bold ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                    {isPositive ? '+' : '-'}${Math.abs(item.change).toFixed(2)}
                  </td>
                  <td className={`py-3 px-3 text-right font-bold ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground">{(item.volume / 1_000_000).toFixed(1)}M</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center">
                      {isPositive ? (
                        <div className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20">
                          <ChevronUp size={14} />
                          <span className="text-xs">UP</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-1 rounded border border-destructive/20">
                          <ChevronDown size={14} />
                          <span className="text-xs">DOWN</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors">Refresh Data →</button>
      </div>
    </div>
  )
}
