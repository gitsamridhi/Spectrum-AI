'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ImageIcon, Video, Mic, LayoutTemplate } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; text: string; }

const SUGGESTIONS = [
  { icon: ImageIcon,    label: 'Generate a portrait in golden hour lighting' },
  { icon: Video,        label: 'Create a cinematic cityscape video clip' },
  { icon: Mic,          label: 'Write narration text for a product video' },
  { icon: LayoutTemplate, label: 'Plan a product photography workflow' },
];

const SYSTEM_REPLIES: Record<string, string> = {
  default: 'I can help you generate images, videos, voice audio, or plan creative workflows. What would you like to create today?',
  portrait: 'Great choice! For a golden-hour portrait, I recommend using the **Portrait** model with these settings:\n\n- Creativity: 6/10\n- Resemblance: 8/10\n- Style: Cinematic\n\nShall I open the Image Generator with these settings pre-filled?',
  video: 'For a cinematic cityscape, use the **Cinematic** video model with 6s duration and Dynamic motion. I can set this up for you in the Video Generator.',
  narration: 'Here\'s a sample narration script:\n\n*"Introducing our latest creation — designed for those who demand more. Precision-engineered, beautifully crafted, and built to last."*\n\nWant me to convert this to audio using the Voice Generator?',
  workflow: 'Here\'s a suggested product photography workflow:\n\n1. Upload raw product images\n2. Run Background Remove\n3. Apply Denoise for clean texture\n4. Upscale to 4K for print\n5. Export batch to project library\n\nShall I create a Space for this workflow?',
};

function getReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('portrait') || lower.includes('golden')) return SYSTEM_REPLIES.portrait;
  if (lower.includes('video') || lower.includes('city')) return SYSTEM_REPLIES.video;
  if (lower.includes('narration') || lower.includes('voice')) return SYSTEM_REPLIES.narration;
  if (lower.includes('workflow') || lower.includes('photography')) return SYSTEM_REPLIES.workflow;
  return SYSTEM_REPLIES.default;
}

const Logo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

export default function AssistantView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(text);
      setMessages(m => [...m, { role: 'assistant', text: reply }]);
      setTyping(false);
    }, 1000 + Math.random() * 600);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* Top bar */}
      <div className="h-12 border-b border-zinc-100 flex items-center px-8 gap-3 shrink-0">
        <div className="w-5 h-5 text-zinc-900"><Logo /></div>
        <span className="text-[13px] font-bold text-zinc-900">Spectrum Assistant</span>
        <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">Beta</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <div className="w-6 h-6 text-white"><Logo /></div>
              </div>
              <h2 className="text-[22px] font-bold text-zinc-900 tracking-[-0.03em]">How can I help you create?</h2>
              <p className="text-[13px] text-zinc-400 mt-2 max-w-md">
                Ask me to generate images, videos, or voice. I can also help you plan workflows and choose the right settings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {SUGGESTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button key={i} onClick={() => send(s.label)}
                    className="group flex items-center gap-3 px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-left hover:bg-white hover:border-zinc-400 hover:shadow-sm transition-all cursor-pointer">
                    <div className="w-9 h-9 bg-white border border-zinc-200 rounded-xl flex items-center justify-center shrink-0 group-hover:border-zinc-400 transition-colors">
                      <Icon className="w-4 h-4 text-zinc-600" />
                    </div>
                    <p className="text-[12.5px] font-medium text-zinc-700 leading-snug">{s.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                  m.role === 'assistant' ? 'bg-zinc-900' : 'bg-zinc-200'
                }`}>
                  {m.role === 'assistant'
                    ? <div className="w-3.5 h-3.5 text-white"><Logo /></div>
                    : <span className="text-[10px] font-bold text-zinc-600">You</span>
                  }
                </div>
                <div className={`flex-1 ${m.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`px-4 py-3.5 rounded-2xl max-w-lg ${
                    m.role === 'user'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-50 border border-zinc-200 text-zinc-800'
                  }`}>
                    {m.text.split('\n').map((line, j) => (
                      <p key={j} className={`text-[13px] leading-relaxed ${j > 0 ? 'mt-1.5' : ''}`}>
                        {line.startsWith('**') && line.endsWith('**')
                          ? <strong>{line.slice(2, -2)}</strong>
                          : line.startsWith('*"') && line.endsWith('"*')
                          ? <em className="italic">{line.slice(2, -2)}</em>
                          : line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                  <div className="w-3.5 h-3.5 text-white"><Logo /></div>
                </div>
                <div className="px-4 py-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-100 px-8 py-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:border-zinc-400 focus-within:bg-white transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything, or describe what you want to create..."
              rows={1}
              className="flex-1 text-[13.5px] text-zinc-900 placeholder-zinc-400 bg-transparent outline-none resize-none leading-relaxed"
              style={{ maxHeight: 120, overflowY: 'auto' }}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || typing}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                input.trim() && !typing ? 'bg-rose-400 hover:bg-rose-500' : 'bg-zinc-200 cursor-not-allowed'
              }`}>
              <Send className={`w-4 h-4 ${input.trim() && !typing ? 'text-white' : 'text-zinc-400'}`} />
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-400 mt-2">
            Spectrum Assistant can generate, plan, and route tasks to the right tools.
          </p>
        </div>
      </div>
    </div>
  );
}
