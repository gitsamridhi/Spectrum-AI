'use client';

import React, { useState } from 'react';
import { Plus, Users, Clock, Zap, ArrowRight } from 'lucide-react';

const P = { vivid: '#FF7000', orange: '#FFB347', magenta: '#F060EE', coral: '#FF6B86', peach: '#FFBF80' };

const SPACES = [
  { name: 'Brand identity workflow',   nodes: 8,  updated: '2 hours ago',  shared: true,  liveUsers: 2, chainColor: P.vivid   },
  { name: 'Product campaign batch',    nodes: 14, updated: 'Yesterday',     shared: true,  liveUsers: 3, chainColor: P.orange  },
  { name: 'Portrait series pipeline',  nodes: 6,  updated: '3 days ago',   shared: false, liveUsers: 0, chainColor: P.coral   },
  { name: 'Social media content flow', nodes: 22, updated: '1 week ago',   shared: true,  liveUsers: 0, chainColor: P.magenta },
];

const TEMPLATES = [
  { name: 'Text → Image → Video',   desc: '3-node chain', chain: ['Text', 'Image', 'Video'],    color: P.vivid   },
  { name: 'Product Ad Generator',   desc: '5-node batch', chain: ['Prompt', 'Image', 'Upscale', 'Ad'],  color: P.orange  },
  { name: 'Social Media Pack',      desc: '4-node flow',  chain: ['Text', 'Image', 'Resize', 'Export'], color: P.coral   },
  { name: 'Character Consistency',  desc: '3-node chain', chain: ['Char', 'Image', 'Video'],    color: P.magenta },
];

function NodeChainPreview({ chain, color, dotted = false }: { chain: string[]; color: string; dotted?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {chain.map((node, i) => (
        <React.Fragment key={node}>
          <div className="shrink-0 px-2 py-1 rounded-md text-[9px] font-bold"
            style={{ border: `1px solid ${color}50`, color, background: color + '15' }}>
            {node}
          </div>
          {i < chain.length - 1 && (
            <div className={`flex-1 h-px min-w-[8px] ${dotted ? 'border-t border-dashed' : 'border-t'}`}
              style={{ borderColor: color + '40' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function CanvasPreview({ color, chain }: { color: string; chain?: string[] }) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: '#0f0f11' }}>
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-15"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      {/* Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30 -translate-y-4 translate-x-4 pointer-events-none"
        style={{ background: color }} />
      {/* Nodes */}
      <div className="absolute inset-0 flex items-center px-5 gap-2">
        {(chain || ['Node', 'Node', 'Node']).slice(0, 4).map((node, i) => (
          <React.Fragment key={i}>
            <div className="shrink-0 px-2.5 py-1.5 rounded-lg text-[9px] font-bold bg-white/10 border border-white/20"
              style={{ color: color }}>
              {node}
            </div>
            {i < (chain || ['A', 'B', 'C']).length - 1 && (
              <div className="flex-1 h-px border-t border-dashed border-white/20" />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* SVG connector lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.25}>
        <line x1="30" y1="40" x2="80" y2="60" stroke="white" strokeWidth="1" />
        <line x1="80" y1="60" x2="130" y2="35" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  );
}

const AVATAR_COLORS = [P.vivid, P.orange, P.magenta, P.coral, P.peach];

export default function SpacesView() {
  const [hoveredSpace, setHoveredSpace] = useState<number | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* Header */}
      <div className="border-b border-zinc-100 px-8 py-5 flex items-center gap-4 shrink-0">
        <div>
          <h1 className="text-[16px] font-bold text-zinc-900">Spaces</h1>
          <p className="text-[11.5px] text-zinc-400">Build AI pipelines on an infinite visual canvas.</p>
        </div>
        <div className="flex-1" />
        {/* Live users indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] font-medium text-zinc-600">3 collaborators online</span>
          <div className="flex -space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                style={{ background: AVATAR_COLORS[i] }}>
                <span className="text-[7px] font-bold text-white">{String.fromCharCode(65 + i)}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 text-white text-[12px] font-semibold rounded-xl transition-all cursor-pointer hover:opacity-90"
          style={{ background: P.vivid }}>
          <Plus className="w-3.5 h-3.5" />New Space
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">

        {/* Create new */}
        <div>
          <button className="group relative w-full rounded-2xl overflow-hidden transition-all cursor-pointer border-2 border-dashed border-zinc-300 hover:border-zinc-400"
            style={{ height: 160 }}>
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative h-full flex items-center justify-center gap-8">
              {/* Quick-start chain preview */}
              <div className="hidden sm:flex flex-col gap-1.5 opacity-60">
                {[
                  { chain: ['Text', 'Image'], color: P.vivid },
                  { chain: ['Image', 'Video', 'Upscale'], color: P.orange },
                ].map((row, i) => (
                  <NodeChainPreview key={i} chain={row.chain} color={row.color} dotted />
                ))}
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 group-hover:border-zinc-400 flex items-center justify-center transition-colors shadow-sm mx-auto mb-3">
                  <Plus className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
                </div>
                <p className="text-[14px] font-bold text-zinc-900">Create a new space</p>
                <p className="text-[11.5px] text-zinc-400 mt-0.5">Blank canvas or template — node-based AI chaining</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent spaces */}
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Recent spaces</h2>
          <div className="grid grid-cols-4 gap-4">
            {SPACES.map((s, i) => (
              <div key={i} className="group cursor-pointer"
                onMouseEnter={() => setHoveredSpace(i)}
                onMouseLeave={() => setHoveredSpace(null)}>
                <div className="relative rounded-2xl overflow-hidden border border-zinc-200 hover:border-zinc-300 transition-colors mb-3" style={{ height: 160 }}>
                  <CanvasPreview color={s.chainColor} chain={['Text', 'Image', 'Video'].slice(0, 3)} />
                  {/* Live users badge */}
                  {s.shared && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                      {s.liveUsers > 0 && <div className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                      <Users className="w-2.5 h-2.5 text-white/70" />
                      <span className="text-[8.5px] font-semibold text-white/70">
                        {s.liveUsers > 0 ? `${s.liveUsers} live` : 'Shared'}
                      </span>
                    </div>
                  )}
                  {/* Node chain at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <NodeChainPreview chain={['Prompt', 'Gen', 'Export'].slice(0, Math.min(s.nodes, 3))} color={s.chainColor} />
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-zinc-900 truncate group-hover:text-zinc-600 transition-colors">{s.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <p className="text-[11px] text-zinc-400">{s.updated} · {s.nodes} nodes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Start from a template</h2>
            <button className="flex items-center gap-1 text-[11.5px] text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
              All templates <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {TEMPLATES.map((t, i) => (
              <button key={i}
                className="group text-left rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer overflow-hidden">
                <div className="aspect-video overflow-hidden" style={{ background: '#0f0f11' }}>
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 opacity-15"
                      style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    <div className="absolute inset-0 flex items-center justify-center px-4">
                      <NodeChainPreview chain={t.chain} color={t.color} dotted />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3 h-3" style={{ color: t.color }} />
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: t.color }}>{t.desc}</span>
                  </div>
                  <p className="text-[12.5px] font-bold text-zinc-900">{t.name}</p>
                  <p className="text-[10.5px] text-zinc-400 mt-0.5">{t.chain.join(' → ')}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
