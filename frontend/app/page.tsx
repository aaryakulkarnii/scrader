import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, Brain, Radar, Compass } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background scanlines overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark-lg border-b border-border/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
              <span className="text-xs font-bold text-background">S</span>
            </div>
            <span className="font-mono font-bold text-lg text-foreground tracking-wider">SCRADER</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-mono text-muted-foreground hover:text-foreground transition">FEATURES</a>
            <a href="#capabilities" className="text-sm font-mono text-muted-foreground hover:text-foreground transition">CAPABILITIES</a>
            <Link href="/dashboard" className="px-6 py-2 bg-primary text-primary-foreground rounded font-mono text-sm font-bold hover:shadow-lg hover:shadow-primary/50 transition glow-cyan">
              ENTER SYSTEM
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6 mb-12">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full glass-dark border border-primary/30 text-primary text-xs font-mono font-bold tracking-wider">
                AI-POWERED MARKET INTELLIGENCE
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-mono font-black tracking-tight text-foreground leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                SCRADER
              </span>
              <br />
              Market Intelligence<br />Operating System
            </h1>
            <p className="text-lg font-mono text-muted-foreground max-w-2xl leading-relaxed">
              Harness advanced AI and real-time market data to identify opportunities, track competitive threats, and make strategic decisions before the market moves.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/dashboard" className="px-8 py-4 bg-primary text-primary-foreground rounded font-mono font-bold text-center hover:shadow-lg hover:shadow-primary/50 transition glow-cyan flex items-center justify-center gap-2 group">
              <Zap className="w-5 h-5" />
              LAUNCH SYSTEM
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
            <a href="#features" className="px-8 py-4 glass-dark border border-primary/30 text-foreground rounded font-mono font-bold text-center hover:border-primary/60 transition flex items-center justify-center gap-2">
              <Brain className="w-5 h-5" />
              LEARN MORE
            </a>
          </div>

          {/* Hero Graphic */}
          <div className="relative h-96 rounded-xl overflow-hidden glass-dark border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Animated constellation */}
                <div className="absolute inset-0 animate-pulse-glow opacity-60">
                  <svg className="w-full h-full" viewBox="0 0 256 256">
                    <circle cx="128" cy="50" r="4" fill="#00d4ff" />
                    <circle cx="80" cy="120" r="3" fill="#00ff88" />
                    <circle cx="176" cy="140" r="3" fill="#ffa500" />
                    <circle cx="128" cy="200" r="4" fill="#00d4ff" />
                    <line x1="128" y1="50" x2="80" y2="120" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
                    <line x1="128" y1="50" x2="176" y2="140" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
                    <line x1="80" y1="120" x2="128" y2="200" stroke="#00ff88" strokeWidth="1" opacity="0.3" />
                    <line x1="176" y1="140" x2="128" y2="200" stroke="#ffa500" strokeWidth="1" opacity="0.3" />
                  </svg>
                </div>
                <div className="absolute inset-0 animate-spin-slow opacity-40" style={{ animationDuration: '20s' }}>
                  <div className="w-full h-full border border-dashed border-primary/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-border/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-mono font-bold text-foreground mb-4">CORE FEATURES</h2>
            <p className="font-mono text-muted-foreground max-w-2xl mx-auto">
              Unified intelligence hub for market analysis, competitive tracking, and strategic discovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: 'Market Galaxy', desc: 'Visualize market ecosystem with AI-powered competitor mapping' },
              { icon: Radar, title: 'Signal Detection', desc: 'Real-time market signals and anomaly detection' },
              { icon: Brain, title: 'AI Command', desc: 'Natural language queries for market intelligence' },
              { icon: Compass, title: 'Opportunity Scout', desc: 'Discover emerging market opportunities and gaps' },
              { icon: Zap, title: 'Threat Intelligence', desc: 'Competitive threat assessment and risk analysis' },
              { icon: TrendingUp, title: 'Strategic Insights', desc: 'Founder-grade market and competitive analysis' }
            ].map((feature, i) => (
              <div key={i} className="glass-dark rounded-lg p-6 border border-border/30 hover:border-primary/50 transition group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/50 transition">
                  <feature.icon className="w-6 h-6 text-background" />
                </div>
                <h3 className="font-mono font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm font-mono text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="font-mono text-sm text-muted-foreground">SCRADER v1.0 - Market Intelligence OS</p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs text-muted-foreground">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
