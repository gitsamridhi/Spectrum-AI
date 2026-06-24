"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error safely to a telemetry system or console
    console.error("Hydration or Runtime Boundary intercepted error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f3f4f6] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#0c0c0c] border border-white/[0.08] p-8 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-display text-white">System Error boundary</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The maritime application encountered a runtime variation or cross-origin exception. All operations remained secured on-chain.
          </p>
        </div>

        {error.message && (
          <div className="bg-black/40 border border-white/[0.05] p-3 rounded-xl text-left">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">Error Diagnostic Code</span>
            <span className="text-xs font-mono text-zinc-400 break-all">{error.message}</span>
          </div>
        )}

        <button
          onClick={() => reset()}
          className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-[11px] transition-all cursor-pointer"
        >
          Recover Connection ➔
        </button>
      </div>
    </div>
  );
}
