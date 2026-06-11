'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Radar, Brain, Compass, Zap, Settings, BarChart3, TrendingUp, Plus } from 'lucide-react'
import { ProjectProvider, useProject } from '@/context/ProjectContext'
import { useState } from 'react'

interface SidebarNavProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: SidebarNavProps) {
  return (
    <ProjectProvider>
      <DashboardContent>{children}</DashboardContent>
    </ProjectProvider>
  )
}

function DashboardContent({ children }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { projects, activeProject, setActiveProject, createProject } = useProject()
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const navItems = [
    { href: '/dashboard', label: 'HUB', icon: Home },
    { href: '/dashboard/galaxy', label: 'GALAXY', icon: TrendingUp },
    { href: '/dashboard/signals', label: 'SIGNALS', icon: Radar },
    { href: '/dashboard/command', label: 'COMMAND', icon: Brain },
    { href: '/dashboard/intelligence', label: 'INTEL', icon: BarChart3 },
    { href: '/dashboard/opportunities', label: 'SCOUT', icon: Compass },
    { href: '/dashboard/founder', label: 'FOUNDER', icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark-lg border-b border-border/30">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
              <span className="text-xs font-bold text-background">S</span>
            </div>
            <span className="font-mono font-bold text-foreground tracking-wider">SCRADER</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Project Selector */}
            <div className="flex items-center gap-2">
              <select 
                className="bg-black/50 border border-border/30 rounded p-1 text-sm font-mono text-white focus:outline-none"
                value={activeProject?.id || ""}
                onChange={(e) => {
                  const proj = projects.find(p => p.id === e.target.value)
                  if (proj) setActiveProject(proj)
                }}
              >
                <option value="" disabled>Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button 
                onClick={() => setShowNewProject(true)}
                className="w-6 h-6 flex items-center justify-center bg-primary/20 text-primary rounded hover:bg-primary/40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="font-mono text-xs text-muted-foreground ml-4">
              <span className="text-accent animate-pulse">●</span> OPERATIONAL
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                router.push("/login");
              }}
              className="px-3 py-1 rounded text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-border/20 transition"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-dark border border-primary/30 p-6 rounded-lg w-96">
            <h3 className="font-mono font-bold mb-4">CREATE NEW PROJECT</h3>
            <input 
              className="w-full bg-black/50 border border-primary/30 rounded p-2 mb-4 font-mono text-sm"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 font-mono text-sm text-muted-foreground hover:text-white" onClick={() => setShowNewProject(false)}>CANCEL</button>
              <button 
                className="px-4 py-2 font-mono text-sm bg-primary text-primary-foreground rounded glow-cyan"
                onClick={async () => {
                  if (newProjectName) {
                    await createProject(newProjectName)
                    setShowNewProject(false)
                    setNewProjectName("")
                  }
                }}
              >
                CREATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-16 bottom-0 w-56 glass-dark border-r border-border/30 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-mono text-sm font-bold ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-border/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-56 mt-16 scanlines">
        {children}
      </main>
    </div>
  )
}
