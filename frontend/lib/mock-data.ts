export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  trend: number[]
}

export interface PortfolioHolding {
  symbol: string
  shares: number
  avgCost: number
  currentPrice: number
  gain: number
  gainPercent: number
}

export interface Alert {
  id: string
  type: 'warning' | 'critical' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
}

export interface AIInsight {
  id: string
  title: string
  confidence: number
  sentiment: 'bullish' | 'bearish' | 'neutral'
  description: string
}

export interface Competitor {
  id: string
  name: string
  symbol: string
  sector: string
  marketCap: number
  threat: 'critical' | 'high' | 'medium' | 'low'
  momentum: number
  position: { x: number; y: number; z: number }
  employees: number
  revenue: number
  recentMove: number
}

export interface Signal {
  id: string
  type: 'earnings' | 'acquisition' | 'partnership' | 'patent' | 'regulatory' | 'product'
  title: string
  company: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  timestamp: Date
  description: string
  score: number
}

export interface Opportunity {
  id: string
  title: string
  category: 'market_gap' | 'emerging_trend' | 'undervalued' | 'growth_catalyst'
  confidence: number
  potentialReturn: number
  description: string
  companies: string[]
  timeframe: string
}

export const generateTrendData = (basePrice: number, volatility: number = 2): number[] => {
  const data: number[] = []
  let price = basePrice
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * volatility
    price += change
    data.push(Math.max(price, basePrice * 0.8))
  }
  return data
}

export const marketData: MarketData[] = [
  {
    symbol: 'NVDA',
    price: 875.43,
    change: 12.35,
    changePercent: 1.43,
    volume: 48_500_000,
    trend: generateTrendData(875.43),
  },
  {
    symbol: 'TSLA',
    price: 298.17,
    change: -5.42,
    changePercent: -1.79,
    volume: 125_300_000,
    trend: generateTrendData(298.17, 3),
  },
  {
    symbol: 'AAPL',
    price: 234.89,
    change: 8.67,
    changePercent: 3.83,
    volume: 89_200_000,
    trend: generateTrendData(234.89, 1.5),
  },
  {
    symbol: 'MSFT',
    price: 412.56,
    change: 15.23,
    changePercent: 3.83,
    volume: 21_400_000,
    trend: generateTrendData(412.56, 1.2),
  },
  {
    symbol: 'META',
    price: 502.31,
    change: -8.15,
    changePercent: -1.60,
    volume: 17_800_000,
    trend: generateTrendData(502.31, 2.5),
  },
  {
    symbol: 'GOOGL',
    price: 156.78,
    change: 6.45,
    changePercent: 4.29,
    volume: 23_600_000,
    trend: generateTrendData(156.78, 1.8),
  },
]

export const portfolio: PortfolioHolding[] = [
  {
    symbol: 'NVDA',
    shares: 50,
    avgCost: 775.20,
    currentPrice: 875.43,
    gain: 5011.5,
    gainPercent: 13.0,
  },
  {
    symbol: 'AAPL',
    shares: 150,
    avgCost: 189.45,
    currentPrice: 234.89,
    gain: 6816,
    gainPercent: 23.98,
  },
  {
    symbol: 'MSFT',
    shares: 75,
    avgCost: 380.12,
    currentPrice: 412.56,
    gain: 2433,
    gainPercent: 8.53,
  },
  {
    symbol: 'META',
    shares: 40,
    avgCost: 520.15,
    currentPrice: 502.31,
    gain: -712.4,
    gainPercent: -3.43,
  },
]

export const alerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'TSLA Volatility Alert',
    message: 'Extreme volatility detected in TSLA. 30-day volatility spike of 45%.',
    timestamp: new Date(Date.now() - 2 * 60000),
  },
  {
    id: '2',
    type: 'warning',
    title: 'Portfolio Rebalance Needed',
    message: 'NVDA allocation exceeds target by 8%. Consider rebalancing.',
    timestamp: new Date(Date.now() - 15 * 60000),
  },
  {
    id: '3',
    type: 'success',
    title: 'Earnings Beat Detected',
    message: 'AAPL reported Q4 earnings, beating estimates by 12%.',
    timestamp: new Date(Date.now() - 45 * 60000),
  },
  {
    id: '4',
    type: 'info',
    title: 'Fed Rate Decision',
    message: 'Federal Reserve holds rates at 5.25%-5.50%, signals future cuts.',
    timestamp: new Date(Date.now() - 90 * 60000),
  },
]

export const aiInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Sector Momentum Shift',
    confidence: 94,
    sentiment: 'bullish',
    description:
      'AI and semiconductor companies showing strong momentum. Technical indicators suggest 15-20% upside potential.',
  },
  {
    id: '2',
    title: 'Earnings Revision Trend',
    confidence: 87,
    sentiment: 'bearish',
    description:
      'Recent analyst downgrades in consumer discretionary may presage broader market correction in Q1.',
  },
  {
    id: '3',
    title: 'Market Correlation Breakdown',
    confidence: 81,
    sentiment: 'neutral',
    description:
      'Fed pivot expectations creating unusual correlation patterns. Opportunities for stat-arb strategies.',
  },
]

export const competitors: Competitor[] = [
  {
    id: 'NVDA',
    name: 'NVIDIA',
    symbol: 'NVDA',
    sector: 'Semiconductors',
    marketCap: 2.8e12,
    threat: 'critical',
    momentum: 8.5,
    position: { x: 40, y: 30, z: 50 },
    employees: 28000,
    revenue: 60.9e9,
    recentMove: 12.35,
  },
  {
    id: 'TSLA',
    name: 'Tesla',
    symbol: 'TSLA',
    sector: 'Automotive',
    marketCap: 800e9,
    threat: 'high',
    momentum: -5.2,
    position: { x: 70, y: 50, z: 30 },
    employees: 127855,
    revenue: 81.46e9,
    recentMove: -5.42,
  },
  {
    id: 'AAPL',
    name: 'Apple',
    symbol: 'AAPL',
    sector: 'Technology',
    marketCap: 2.9e12,
    threat: 'critical',
    momentum: 7.2,
    position: { x: 20, y: 60, z: 40 },
    employees: 164000,
    revenue: 394.3e9,
    recentMove: 8.67,
  },
  {
    id: 'MSFT',
    name: 'Microsoft',
    symbol: 'MSFT',
    sector: 'Software',
    marketCap: 2.75e12,
    threat: 'critical',
    momentum: 9.1,
    position: { x: 60, y: 70, z: 45 },
    employees: 221000,
    revenue: 211.9e9,
    recentMove: 15.23,
  },
  {
    id: 'META',
    name: 'Meta',
    symbol: 'META',
    sector: 'Technology',
    marketCap: 500e9,
    threat: 'high',
    momentum: -3.5,
    position: { x: 80, y: 40, z: 35 },
    employees: 67317,
    revenue: 134.9e9,
    recentMove: -8.15,
  },
  {
    id: 'GOOGL',
    name: 'Google',
    symbol: 'GOOGL',
    sector: 'Technology',
    marketCap: 1.7e12,
    threat: 'high',
    momentum: 6.8,
    position: { x: 50, y: 75, z: 55 },
    employees: 190711,
    revenue: 307.4e9,
    recentMove: 6.45,
  },
]

export const signals: Signal[] = [
  {
    id: '1',
    type: 'earnings',
    title: 'AAPL Q4 Earnings Beat',
    company: 'Apple',
    severity: 'high',
    timestamp: new Date(Date.now() - 2 * 3600000),
    description: 'Apple reported earnings with 12% revenue growth, beating analyst expectations',
    score: 92,
  },
  {
    id: '2',
    type: 'product',
    title: 'NVDA AI Chip Launch',
    company: 'NVIDIA',
    severity: 'critical',
    timestamp: new Date(Date.now() - 4 * 3600000),
    description: 'New generation AI accelerator achieves 2x performance improvement',
    score: 98,
  },
  {
    id: '3',
    type: 'acquisition',
    title: 'MSFT-OpenAI Partnership',
    company: 'Microsoft',
    severity: 'high',
    timestamp: new Date(Date.now() - 6 * 3600000),
    description: 'Microsoft expands enterprise AI capabilities partnership',
    score: 89,
  },
  {
    id: '4',
    type: 'regulatory',
    title: 'TSLA Regulatory Action',
    company: 'Tesla',
    severity: 'medium',
    timestamp: new Date(Date.now() - 8 * 3600000),
    description: 'US regulators investigating vehicle safety complaints',
    score: 65,
  },
  {
    id: '5',
    type: 'patent',
    title: 'GOOGL Patent Grant',
    company: 'Google',
    severity: 'medium',
    timestamp: new Date(Date.now() - 12 * 3600000),
    description: 'Patent granted for quantum computing architecture',
    score: 72,
  },
]

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Enterprise AI Adoption',
    category: 'emerging_trend',
    confidence: 96,
    potentialReturn: 320,
    description: 'Corporate spending on AI infrastructure projected to grow 450% over 3 years',
    companies: ['MSFT', 'NVDA', 'AAPL'],
    timeframe: '2-3 years',
  },
  {
    id: '2',
    title: 'EV Supply Chain Optimization',
    category: 'market_gap',
    confidence: 82,
    potentialReturn: 185,
    description: 'Critical gap in battery supply chain for EV manufacturers',
    companies: ['TSLA'],
    timeframe: '1-2 years',
  },
  {
    id: '3',
    title: 'Cloud Infrastructure Consolidation',
    category: 'undervalued',
    confidence: 78,
    potentialReturn: 145,
    description: 'Mid-cap cloud providers trading below intrinsic value as giants consolidate market',
    companies: ['MSFT'],
    timeframe: '6-12 months',
  },
  {
    id: '4',
    title: 'Quantum Computing Breakthrough',
    category: 'growth_catalyst',
    confidence: 65,
    potentialReturn: 500,
    description: 'Early-stage quantum computing developments may unlock trillion-dollar applications',
    companies: ['GOOGL'],
    timeframe: '3-5 years',
  },
]
