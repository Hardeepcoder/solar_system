import { useState, useEffect, useRef, useCallback } from 'react';
import { planets, PlanetData } from './data/planets';

// Scale orbital radii for display (logarithmic-ish to fit on screen)
function getOrbitRadius(index: number): number {
  const baseRadii = [60, 85, 110, 140, 190, 240, 290, 340];
  return baseRadii[index];
}

// Scale planet sizes for display
function getPlanetSize(planet: PlanetData): number {
  const maxSize = 20;
  const minSize = 5;
  // Use log scale for sizes
  const logSize = Math.log(planet.diameter);
  const logMin = Math.log(4879);
  const logMax = Math.log(142984);
  return minSize + ((logSize - logMin) / (logMax - logMin)) * (maxSize - minSize);
}

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setTime((prev) => prev + delta * speed);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    };
  }, [animate]);

  const getPlanetPosition = (index: number) => {
    const planet = planets[index];
    const radius = getOrbitRadius(index);
    // Angular velocity proportional to 1/orbitalPeriod
    const angularVelocity = (2 * Math.PI) / (planet.orbitalPeriod / 365.25);
    const angle = time * angularVelocity * 0.5; // 0.5 factor for visual speed
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const svgSize = 800;
  const center = svgSize / 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-6 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
          ☀️ Interactive Solar System
        </h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Click on any planet to learn more • Use controls to adjust the simulation
        </p>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 px-4 pb-4">
        {/* Solar System Visualization */}
        <div className="flex-shrink-0">
          <svg
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className="w-full max-w-[600px] h-auto cursor-pointer"
            style={{ maxHeight: '70vh' }}
          >
            {/* Orbit paths */}
            {planets.map((_, index) => (
              <circle
                key={`orbit-${index}`}
                cx={center}
                cy={center}
                r={getOrbitRadius(index)}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Sun */}
            <defs>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor="#fff7a0" />
                <stop offset="40%" stopColor="#ffcc00" />
                <stop offset="70%" stopColor="#ff8800" />
                <stop offset="100%" stopColor="#ff440000" />
              </radialGradient>
              <radialGradient id="sunCore">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#ffee55" />
                <stop offset="100%" stopColor="#ffaa00" />
              </radialGradient>
            </defs>
            <circle cx={center} cy={center} r="40" fill="url(#sunGlow)" opacity="0.6" />
            <circle cx={center} cy={center} r="25" fill="url(#sunCore)" />
            <circle cx={center} cy={center} r="18" fill="#fff8e0" opacity="0.8" />

            {/* Planets */}
            {planets.map((planet, index) => {
              const pos = getPlanetPosition(index);
              const size = getPlanetSize(planet);
              const isSelected = selectedPlanet?.id === planet.id;

              return (
                <g key={planet.id}>
                  {/* Planet glow when selected */}
                  {isSelected && (
                    <circle
                      cx={center + pos.x}
                      cy={center + pos.y}
                      r={size + 6}
                      fill="none"
                      stroke={planet.color}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-pulse"
                    />
                  )}
                  {/* Saturn's ring */}
                  {planet.ringColor && (
                    <ellipse
                      cx={center + pos.x}
                      cy={center + pos.y}
                      rx={size + 8}
                      ry={size / 3}
                      fill="none"
                      stroke={planet.ringColor}
                      strokeWidth="2.5"
                      opacity="0.7"
                      transform={`rotate(-20, ${center + pos.x}, ${center + pos.y})`}
                    />
                  )}
                  {/* Planet body */}
                  <circle
                    cx={center + pos.x}
                    cy={center + pos.y}
                    r={size}
                    fill={planet.color}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                    onMouseEnter={(e) => {
                      (e.target as SVGCircleElement).setAttribute('r', String(size + 3));
                    }}
                    onMouseLeave={(e) => {
                      (e.target as SVGCircleElement).setAttribute('r', String(size));
                    }}
                  />
                  {/* Planet label */}
                  <text
                    x={center + pos.x}
                    y={center + pos.y - size - 6}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="9"
                    className="pointer-events-none select-none"
                  >
                    {planet.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          {selectedPlanet ? (
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full shadow-lg"
                  style={{
                    backgroundColor: selectedPlanet.color,
                    boxShadow: `0 0 15px ${selectedPlanet.color}50`,
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedPlanet.name}</h2>
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                    {selectedPlanet.type}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {selectedPlanet.description}
              </p>

              <div className="space-y-3">
                <InfoRow
                  icon="📏"
                  label="Diameter"
                  value={`${selectedPlanet.diameter.toLocaleString()} km`}
                />
                <InfoRow
                  icon="🌞"
                  label="Distance from Sun"
                  value={`${selectedPlanet.distanceFromSun.toLocaleString()} million km`}
                />
                <InfoRow
                  icon="🔄"
                  label="Orbital Period"
                  value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                />
                <InfoRow
                  icon="🌙"
                  label="Known Moons"
                  value={String(selectedPlanet.moons)}
                />
              </div>

              <button
                onClick={() => setSelectedPlanet(null)}
                className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
              >
                ✕ Close
              </button>
            </div>
          ) : (
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-3">🪐 Planet Explorer</h2>
              <p className="text-gray-400 text-sm mb-4">
                Click on any planet in the visualization to see detailed information about it.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {planets.map((planet) => (
                  <button
                    key={planet.id}
                    onClick={() => setSelectedPlanet(planet)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg transition-colors text-left"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: planet.color }}
                    />
                    <span className="text-xs text-gray-300">{planet.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-4 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">⚙️ Simulation Controls</h3>

            {/* Play/Pause */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isPlaying
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <span className="text-lg">⏸</span> Pause
                  </>
                ) : (
                  <>
                    <span className="text-lg">▶</span> Play
                  </>
                )}
              </button>
              <button
                onClick={() => setTime(0)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
              >
                ↺ Reset
              </button>
            </div>

            {/* Speed Control */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Speed: <span className="text-white font-medium">{speed}×</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1×</span>
                <span>5×</span>
                <span>10×</span>
              </div>
            </div>

            {/* Speed presets */}
            <div className="flex gap-2 mt-3">
              {[0.5, 1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                    speed === s
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-white font-medium">{value}</div>
      </div>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} days`;
  }
  const years = days / 365.25;
  if (years < 2) {
    return `${days.toLocaleString()} days (~1 year)`;
  }
  return `${days.toLocaleString()} days (~${years.toFixed(1)} years)`;
}
