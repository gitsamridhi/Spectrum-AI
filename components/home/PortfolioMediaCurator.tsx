'use client';

import React, { useState } from 'react';
import {
  Search, Grid3X3, List, Layers, Plus,
  Trash2, Download, Star, X, Eye, Tag,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
};

const COLLECTIONS = ['All Assets','Portfolio Selects','Campaign Shots','Behind the Scenes','Headshots','Test Shoots'];

const ASSETS = [
  { id:1, src:'/Model Headshot x.jpg',                       label:'Model Headshot · Studio',  tags:['Headshot','Portrait'],  featured:true,  size:'4.2MB', date:'Today'     },
  { id:2, src:'/download (31).jpg',                          label:'Fashion Editorial · FW24', tags:['Fashion','Editorial'],  featured:true,  size:'6.1MB', date:'Yesterday' },
  { id:3, src:'/download (32).jpg',                          label:'High Fashion Campaign',    tags:['Campaign','Studio'],    featured:false, size:'5.3MB', date:'2 days ago'},
  { id:4, src:'/download (33).jpg',                          label:'Editorial · Spring SS25',  tags:['Editorial','Outdoor'],  featured:false, size:'3.8MB', date:'3 days ago'},
  { id:5, src:'/VSS Studio Shoot - Come as you are _@vogue_college __styled by_ @anya__reed @sashavonstauffenberg @lucinda_chow @holden_e_peterson _model_ @adaugarangbior _makeup_ @makeupbyjohnmendez __picture not taken by me.jpg', label:'VSS Studio Shoot · Vogue', tags:['Runway','Campaign'], featured:false, size:'4.0MB', date:'4 days ago'},
  { id:6, src:'/Результат поиска Google для https___d29c1z66frfv6c_cloudfront.net_pub_media_catalog_product_zoom_a35d69724bed4dea273c3bee36ed661ff0eee6b5_xxl-1.jpg', label:'Beauty Commercial', tags:['Beauty','Commercial'], featured:false, size:'5.5MB', date:'5 days ago'},
  { id:7, src:'/𝖡𝗈𝗅𝗎𝗐𝖺𝗍𝗂𝖿𝖾 𝗍𝖾𝗌𝗍 𝗌𝗁𝗈𝗈𝗍 𝗐𝗂𝗍𝗁 @polaroidsbynuel ______%23wlmsmodels %23beunbound %23testshoot %23femalemodel %23femalefashionmodel %23fashionmodeling.jpg', label:'Test Shoot · @polaroidsbynuel', tags:['Portrait','Studio'], featured:false, size:'3.2MB', date:'6 days ago'},
  { id:8, src:'/Model Headshot x.jpg',                       label:'Headshot Alternate Cut',   tags:['Headshot','Creative'],  featured:false, size:'4.7MB', date:'1 week ago'},
];

type ViewMode = 'masonry' | 'grid' | 'list';

export default function PortfolioMediaCurator() {
  const { T } = useTheme();
  const [view,      setView]      = useState<ViewMode>('masonry');
  const [query,     setQuery]     = useState('');
  const [collection,setCollection]= useState('All Assets');
  const [selected,  setSelected]  = useState<Set<number>>(new Set());
  const [preview,   setPreview]   = useState<number | null>(null);

  const filtered = ASSETS.filter(a =>
    (!query || a.label.toLowerCase().includes(query.toLowerCase()))
  );

  const toggleSelect = (id: number) =>
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const previewAsset = ASSETS.find(a => a.id === preview);

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* ── Left: Folders / Collections ── */}
      <div className="w-[176px] shrink-0 flex flex-col"
        style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub }}>
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Collections</p>
          <button style={{ color: T.textMuted }}><Plus className="w-3 h-3" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4" style={{ scrollbarWidth: 'none' }}>
          {COLLECTIONS.map(c => (
            <button key={c} onClick={() => setCollection(c)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all"
              style={collection === c
                ? { background: T.bg, color: T.text, border: `1px solid ${T.border}` }
                : { color: T.textSub }}
              onMouseEnter={e => { if (collection !== c) e.currentTarget.style.background = T.bgHover; }}
              onMouseLeave={e => { if (collection !== c) e.currentTarget.style.background = 'transparent'; }}>
              <Layers className="w-3 h-3 shrink-0" style={{ color: collection === c ? T.text : T.textMuted }} />
              <span className="text-[11.5px] font-medium truncate">{c}</span>
            </button>
          ))}
        </div>

        {/* Storage indicator */}
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9.5px] font-medium" style={{ color: T.textMuted }}>Storage</span>
            <span className="text-[9.5px] font-bold" style={{ color: T.text }}>4.2 GB / 10 GB</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
            <div className="h-full rounded-full" style={{ width: '42%', background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }} />
          </div>
        </div>
      </div>

      {/* ── Center: Gallery ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="shrink-0 flex items-center gap-2.5 px-5 h-12"
          style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
          <div className="flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-xl"
            style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search assets…"
              className="flex-1 text-[12px] bg-transparent outline-none"
              style={{ color: T.text }} />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: T.bgCard }}>
            {([['masonry', Layers],['grid', Grid3X3],['list', List]] as [ViewMode, React.ElementType][]).map(([mode, Icon]) => (
              <button key={mode} onClick={() => setView(mode)}
                className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-all"
                style={view === mode
                  ? { background: T.bg, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                  : {}}>
                <Icon className="w-3.5 h-3.5" style={{ color: view === mode ? T.text : T.textMuted }} />
              </button>
            ))}
          </div>

          {selected.size > 0 && (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-[11px] font-semibold" style={{ color: T.textSub }}>{selected.size} selected</span>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-medium cursor-pointer"
                style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                <Download className="w-3 h-3" />Export
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-medium cursor-pointer"
                style={{ background: 'rgba(239,68,68,0.10)', color: '#EF4444', border: '1px solid #FECDD3' }}>
                <Trash2 className="w-3 h-3" />Delete
              </button>
              <button onClick={() => setSelected(new Set())}
                className="w-6 h-6 flex items-center justify-center rounded-lg cursor-pointer"
                style={{ color: T.textMuted }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="ml-auto">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
              <Plus className="w-3.5 h-3.5" />Upload
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'none' }}>
          {view === 'masonry' && (
            <div className="columns-3 gap-3">
              {filtered.map((a, i) => {
                const tall = i % 3 === 0;
                return (
                  <div key={a.id} className="break-inside-avoid mb-3 group relative rounded-xl overflow-hidden cursor-pointer"
                    style={{ height: tall ? 280 : 200 }}
                    onClick={() => setPreview(a.id)}>
                    <img src={a.src} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <p className="text-[11px] font-semibold text-white">{a.label}</p>
                    </div>
                    {a.featured && (
                      <div className="absolute top-2 left-2">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                    )}
                    <input type="checkbox" checked={selected.has(a.id)}
                      onChange={() => toggleSelect(a.id)}
                      onClick={e => e.stopPropagation()}
                      className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer" />
                  </div>
                );
              })}
            </div>
          )}

          {view === 'grid' && (
            <div className="grid grid-cols-4 gap-3">
              {filtered.map(a => (
                <div key={a.id} className="group relative rounded-xl overflow-hidden cursor-pointer aspect-square"
                  onClick={() => setPreview(a.id)}
                  style={{ background: T.bgCard }}>
                  <img src={a.src} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-0.5 group-hover:translate-y-0">
                    <p className="text-[10px] font-semibold text-white leading-tight">{a.label}</p>
                  </div>
                  {a.featured && <Star className="absolute top-2 left-2 w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                </div>
              ))}
            </div>
          )}

          {view === 'list' && (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
              {filtered.map((a, i) => (
                <div key={a.id}
                  className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setPreview(a.id)}>
                  <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0">
                    <img src={a.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold" style={{ color: T.text }}>{a.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {a.tags.map(tag => (
                        <span key={tag} className="text-[9.5px] px-1.5 py-0.5 rounded-full"
                          style={{ background: T.bgCard, color: T.textMuted }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10.5px] shrink-0" style={{ color: T.textMuted }}>{a.size}</span>
                  <span className="text-[10.5px] shrink-0 w-20 text-right" style={{ color: T.textMuted }}>{a.date}</span>
                  {a.featured && <Star className="w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Preview drawer ── */}
      {preview !== null && previewAsset && (
        <div className="w-[240px] shrink-0 flex flex-col"
          style={{ borderLeft: `1px solid ${T.border}`, background: T.bgSub }}>
          <div className="shrink-0 flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${T.border}` }}>
            <span className="text-[11px] font-bold" style={{ color: T.text }}>Asset Details</span>
            <button onClick={() => setPreview(null)} style={{ color: T.textMuted }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
            <div className="rounded-xl overflow-hidden mb-4 aspect-square">
              <img src={previewAsset.src} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-[12.5px] font-semibold mb-1" style={{ color: T.text }}>{previewAsset.label}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {previewAsset.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-medium"
                  style={{ background: PA.blueBg, color: PA.blue, border: `1px solid ${PA.blueBdr}` }}>
                  <Tag className="w-2.5 h-2.5" />{tag}
                </span>
              ))}
            </div>
            {[['Size', previewAsset.size],['Added', previewAsset.date],['Type','JPEG · RGB'],['Dimensions','3840 × 5760']].map(([k,v]) => (
              <div key={k} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                <span className="text-[10.5px]" style={{ color: T.textMuted }}>{k}</span>
                <span className="text-[10.5px] font-medium" style={{ color: T.text }}>{v}</span>
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <button className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
                <Download className="w-3.5 h-3.5" />Download
              </button>
              <button className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11.5px] font-semibold cursor-pointer"
                style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                <Eye className="w-3.5 h-3.5" />Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
