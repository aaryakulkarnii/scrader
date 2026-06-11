'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { TrendingUp, Loader2 } from 'lucide-react'
import * as THREE from 'three'
import { useProject } from '@/context/ProjectContext'

interface PlanetProps {
  planet: any
  position: [number, number, number]
  isSelected: boolean
  onClick: () => void
}

const getThreatColor = (threat: string) => {
  const colors: { [key: string]: string } = {
    critical: '#ff3333',
    high: '#ffa500',
    medium: '#ffd700',
    low: '#00ff88',
  }
  return colors[threat] || '#00d4ff'
}

function Planet({ planet, position, isSelected, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const baseSize = useMemo(() => Math.max(1, Math.log10(planet.marketCap / 1e6)), [planet.marketCap])
  const color = useMemo(() => new THREE.Color(getThreatColor(planet.threat)), [planet.threat])

  useFrame((state) => {
    if (!meshRef.current) return
    
    // Slow rotation
    meshRef.current.rotation.y += 0.005

    // Breathing / Pulsing animation based on momentum/activity
    const pulseSpeed = Math.abs(planet.momentum) * 0.1
    const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.05
    meshRef.current.scale.set(scale, scale, scale)

    // Highlight emissive intensity if selected
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = isSelected ? 0.8 : 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick() }}>
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.8}
        />
        {/* Outline for selection */}
        {isSelected && (
          <mesh>
            <sphereGeometry args={[baseSize + 0.2, 32, 32]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
          </mesh>
        )}
      </mesh>
      
      {/* HTML Label */}
      <Html position={[0, -baseSize - 1, 0]} center zIndexRange={[100, 0]}>
        <div className="px-2 py-1 bg-background/80 backdrop-blur-sm border border-border/50 rounded text-xs font-mono font-bold text-white pointer-events-none whitespace-nowrap">
          {planet.symbol}
        </div>
      </Html>
    </group>
  )
}

function Scene({ onSelectPlanet, planets }: { onSelectPlanet: (p: any | null) => void, planets: any[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Generate random positions based on the current number of planets
  const positions = useMemo(() => {
    return planets.map(() => [
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20
    ] as [number, number, number])
  }, [planets])

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {planets.map((planet, idx) => (
        <Planet
          key={planet.id}
          planet={planet}
          position={positions[idx]}
          isSelected={selectedId === planet.id}
          onClick={() => {
            setSelectedId(planet.id)
            onSelectPlanet(planet)
          }}
        />
      ))}

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={!selectedId}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export function MarketGalaxyVisualization() {
  const [selectedPlanet, setSelectedPlanet] = useState<any | null>(null)
  const { activeProject } = useProject()
  const [planets, setPlanets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeProject) {
      setLoading(false)
      return
    }
    setLoading(true)
    
    // Import dynamically to avoid circular dependency issues if any, or just use fetchAPI
    import('@/lib/api').then(({ fetchAPI }) => {
      fetchAPI(`/competitors/${activeProject.id}`)
        .then(data => {
          if (Array.isArray(data)) {
            // Map backend response to UI structure.
            const mapped = data.map((c: any) => ({
              id: c.id,
              name: c.name,
              symbol: c.domain,
              threat: c.threat_scores?.length ? c.threat_scores[0].breakdown_json?.category || 'medium' : 'low',
              momentum: c.metadata_json?.momentum || (Math.random() * 20 - 10), // Give it some life
              marketCap: c.metadata_json?.marketCap || Math.random() * 1e11 + 1e9,
              employees: c.metadata_json?.employees || Math.floor(Math.random() * 5000) + 100
            }))
            setPlanets(mapped)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    })
  }, [activeProject])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!activeProject) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[600px] border border-primary/20 bg-[#0a0e27] rounded-lg">
        <h2 className="text-xl font-mono font-bold text-foreground mb-2">NO PROJECT SELECTED</h2>
        <p className="text-sm font-mono text-muted-foreground">Please select or create a project to view the market galaxy.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col relative" style={{ minHeight: '600px' }}>
      <div className="flex-1 rounded-lg overflow-hidden border border-primary/20 bg-[#0a0e27]">
        <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
          <Scene onSelectPlanet={setSelectedPlanet} planets={planets} />
        </Canvas>
      </div>

      {selectedPlanet && (
        <div className="absolute bottom-4 left-4 right-4 glass-dark-lg rounded-lg p-6 border border-primary/30 z-10 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">COMPANY</p>
              <p className="text-lg font-mono font-bold text-foreground">{selectedPlanet.name}</p>
              <p className="text-sm font-mono text-primary">{selectedPlanet.symbol}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">THREAT LEVEL</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: getThreatColor(selectedPlanet.threat), color: getThreatColor(selectedPlanet.threat) }} />
                <p className="text-sm font-mono font-bold text-foreground">{selectedPlanet.threat.toUpperCase()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">MOMENTUM</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: selectedPlanet.momentum > 0 ? '#00ff88' : '#ff3333' }} />
                <p className={`text-sm font-mono font-bold ${selectedPlanet.momentum > 0 ? 'text-accent' : 'text-destructive'}`}>
                  {selectedPlanet.momentum > 0 ? '+' : ''}{selectedPlanet.momentum.toFixed(1)}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">MARKET CAP</p>
              <p className="text-sm font-mono font-bold text-foreground">${(selectedPlanet.marketCap / 1e9).toFixed(1)}B</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
