'use client'

import { useState } from 'react'
import { Send, Zap } from 'lucide-react'
import { useProject } from '@/context/ProjectContext'
import { fetchAPI } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function CommandPage() {
  const { activeProject } = useProject()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to SCRADER AI Command Center. I can help you analyze markets, identify threats, and discover opportunities. What would you like to explore?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const suggestions = [
    'What are the top competitive threats in AI/ML?',
    'Analyze semiconductor market consolidation trends',
    'Find undervalued tech companies with growth catalysts',
    'What signals indicate market reversal?',
  ]

  const handleSend = async (text?: string) => {
    const message = text || input
    if (!message.trim()) return

    if (!activeProject) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please select a project first to access project-specific intelligence.',
        timestamp: new Date()
      }])
      return
    }

    // Add user message
    setInput('')
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetchAPI('/intelligence/chat', {
        method: 'POST',
        body: JSON.stringify({ project_id: activeProject.id, message })
      })
      
      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error connecting to the intelligence backend.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-6 py-6 space-y-6 h-full flex flex-col">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-mono font-black text-foreground tracking-tight">AI COMMAND CENTER</h1>
        <p className="font-mono text-sm text-muted-foreground">Natural language queries for market intelligence</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-dark-lg rounded-lg border border-primary/20 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 1 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
                <h2 className="font-mono font-bold text-foreground mb-2">COMMAND CENTER ONLINE</h2>
                <p className="font-mono text-sm text-muted-foreground mb-6">Ask me anything about market conditions, competitive threats, or investment opportunities</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="w-full p-3 glass-dark border border-border/30 rounded hover:border-primary/50 text-left font-mono text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-background">AI</span>
                  </div>
                )}
                <div
                  className={`max-w-md rounded-lg p-4 ${
                    msg.role === 'user'
                      ? 'bg-primary/20 border border-primary/30'
                      : 'glass-dark border border-primary/20'
                  }`}
                >
                  <p className="font-mono text-sm text-foreground">{msg.content}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-2 opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xs font-bold text-background">AI</span>
              </div>
              <div className="glass-dark border border-primary/20 rounded-lg p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border/30 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about markets, threats, or opportunities..."
              className="flex-1 bg-input border border-border/30 rounded px-4 py-2 font-mono text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded font-mono text-sm font-bold hover:shadow-lg hover:shadow-primary/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
