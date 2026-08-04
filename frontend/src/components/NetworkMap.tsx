import { useState } from 'react';
import { motion } from 'framer-motion';

type NodeType = 'fibre' | 'fixed-wireless' | 'backbone' | 'external';

interface MapNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: NodeType;
  provider: string;
  speed: string;
}

const NODES: MapNode[] = [
  { id: 'newcastle', name: 'Newcastle Hub', x: 400, y: 210, type: 'backbone', provider: 'Pan Africa Telecom', speed: 'Up to 200 Mbps' },
  { id: 'osizweni', name: 'Osizweni', x: 315, y: 170, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'madadeni', name: 'Madadeni', x: 370, y: 130, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'eastcrest', name: 'Eastcrest', x: 445, y: 160, type: 'fibre', provider: 'Pan Africa Telecom', speed: 'Up to 100 Mbps' },
  { id: 'ingagane', name: 'Ingagane', x: 340, y: 270, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'dannhauser', name: 'Dannhauser', x: 280, y: 320, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'vryheid', name: 'Vryheid', x: 540, y: 120, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'dundee', name: 'Dundee', x: 570, y: 180, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'volksrust', name: 'Volksrust', x: 530, y: 330, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'ladysmith', name: 'Ladysmith', x: 250, y: 240, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'utrecht', name: 'Utrecht', x: 480, y: 85, type: 'fixed-wireless', provider: 'Pan Africa Telecom', speed: 'Up to 50 Mbps' },
  { id: 'telkom', name: 'Telkom / Openserve', x: 720, y: 120, type: 'external', provider: 'Telkom / Openserve', speed: 'Up to 100 Mbps' },
  { id: 'evotel', name: 'Evotel', x: 720, y: 280, type: 'external', provider: 'Evotel', speed: 'Up to 100 Mbps' },
];

const CONNECTIONS: { from: string; to: string }[] = [
  { from: 'newcastle', to: 'osizweni' },
  { from: 'newcastle', to: 'madadeni' },
  { from: 'newcastle', to: 'eastcrest' },
  { from: 'newcastle', to: 'ingagane' },
  { from: 'newcastle', to: 'dannhauser' },
  { from: 'newcastle', to: 'vryheid' },
  { from: 'newcastle', to: 'dundee' },
  { from: 'newcastle', to: 'volksrust' },
  { from: 'newcastle', to: 'ladysmith' },
  { from: 'newcastle', to: 'utrecht' },
  { from: 'newcastle', to: 'telkom' },
  { from: 'newcastle', to: 'evotel' },
];

const TYPE_COLORS: Record<NodeType, string> = {
  fibre: '#10B981',
  'fixed-wireless': '#0088FF',
  backbone: '#0F172A',
  external: '#A78BFA',
};

export default function NetworkMap() {
  const [hovered, setHovered] = useState<MapNode | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
    if (rect) {
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <section id="network" className="bg-slate-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Live network map</h2>
          <p className="mt-3 text-slate-600">
            A real-time view of Pan Africa Telecom nodes and provider backbones across Northern KZN.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card relative overflow-hidden p-4 md:p-8"
        >
          <svg
            viewBox="0 0 800 420"
            className="h-auto w-full"
            onMouseMove={handleMove}
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F8FAFC" stopOpacity="0" />
                <stop offset="50%" stopColor="#0088FF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Terrain */}
            <g className="pointer-events-none">
              <path
                d="M 0 160 Q 140 80 300 150 T 580 120 T 800 180 V 420 H 0 Z"
                fill="url(#terrainGrad)"
                opacity="0.6"
              />
              <path
                d="M 0 230 Q 180 150 380 220 T 780 210 V 420 H 0 Z"
                fill="#CBD5E1"
                opacity="0.4"
              />
              <path
                d="M 0 310 Q 260 260 500 320 T 800 300 V 420 H 0 Z"
                fill="#F1F5F9"
                opacity="0.6"
              />
              <path
                d="M 0 360 Q 300 330 600 360 T 800 350"
                fill="none"
                stroke="#0F172A"
                strokeWidth="1"
                strokeDasharray="4 6"
                opacity="0.08"
              />
              <path
                d="M 80 420 Q 260 360 420 340 T 720 280"
                fill="none"
                stroke="#0F172A"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity="0.12"
              />
            </g>

            {CONNECTIONS.map((conn) => {
              const a = NODES.find((n) => n.id === conn.from)!;
              const b = NODES.find((n) => n.id === conn.to)!;
              const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <path d={d} stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" opacity="0.5" />
                  <circle r="3" fill="#0088FF" opacity="0.85">
                    <animateMotion dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </g>
              );
            })}

            {NODES.map((node) => (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHovered(node)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <circle r="14" fill={TYPE_COLORS[node.type]} opacity="0.15">
                  <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle r="6" fill={TYPE_COLORS[node.type]} stroke="#F8FAFC" strokeWidth="2" />
                <text
                  y="22"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="11"
                  fontWeight={600}
                  opacity={0.8}
                >
                  {node.name}
                </text>
              </g>
            ))}
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute z-10 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl"
              style={{
                left: Math.min(mouse.x + 16, 560),
                top: Math.max(mouse.y - 16, 0),
              }}
            >
              <p className="font-semibold">{hovered.name}</p>
              <p className="text-xs text-slate-500">{hovered.provider}</p>
              <p className="mt-1 text-xs font-semibold" style={{ color: TYPE_COLORS[hovered.type] }}>
                {hovered.speed}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-fibreEmerald" /> Fibre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-telecomBlue" /> Fixed Wireless
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> Provider backbone
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
