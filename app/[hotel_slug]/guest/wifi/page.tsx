"use client";

import React, { useState } from "react";
import { ArrowLeft, Copy, CheckCircle2, Wifi } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useHotelBranding } from "@/utils/store";
import { motion } from "framer-motion";

export default function WifiPage() {
    const router = useRouter();
    const params = useParams();
    const hotelSlug = params?.hotel_slug as string;
    const { branding } = useHotelBranding(hotelSlug);

    const [copied, setCopied] = useState(false);

    const wifiNetwork = branding?.wifiName || (branding?.name ? `${branding.name.replace(/\s+/g, '')}_Guest` : "Hotel_Guest");
    const wifiPassword = branding?.wifiPassword || "RelaxAndUnwind";

    const handleCopy = () => {
        if (!wifiPassword) return;
        navigator.clipboard.writeText(wifiPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="pb-40 section-padding pt-10 min-h-screen bg-background text-foreground">
            <button onClick={() => router.back()} className="mb-10 flex items-center text-foreground/40 hover:text-foreground font-bold transition-all group">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                Return to Dashboard
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl font-serif text-foreground leading-tight">Digital<br />Connectivity</h1>
                <p className="text-foreground/40 mt-4 font-black uppercase tracking-[0.25em] text-[10px]">High-speed internet throughout</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden glass-dark rounded-[2.5rem] p-8 shadow-2xl shadow-black/30 border border-white/10 mb-10"
            >
                {/* Decorative Glow */}
                <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20"
                    style={{ backgroundColor: branding?.primaryColor || '#3b82f6' }}
                />

                <div className="flex items-center mb-10 relative z-10">
                    <div className="p-4 bg-white/10 rounded-2xl mr-5 shadow-inner border border-white/5">
                        <Wifi className="w-8 h-8" style={{ color: branding?.primaryColor || '#60a5fa' }} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Network Access</p>
                        <p className="text-2xl font-serif text-white tracking-tight">{wifiNetwork}</p>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 ml-1">Security Key</p>
                    <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 ring-1 ring-white/10">
                        <span className="font-mono text-xl tracking-[0.3em] text-white overflow-hidden text-ellipsis mr-4 select-all">
                            {wifiPassword}
                        </span>
                        <button
                            onClick={handleCopy}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-2xl relative overflow-hidden group ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black'}`}
                            style={!copied ? { backgroundColor: branding?.primaryColor, color: '#fff' } : {}}
                        >
                            <span className="relative z-10">
                                {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                            </span>
                            {!copied && (
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] text-[11px] leading-relaxed text-white/50 font-medium border border-white/5 shadow-xl relative"
            >
                <div className="flex items-start">
                    <div className="w-1 h-full absolute left-0 top-0 bottom-0 bg-amber-500/50 rounded-l-[2rem]" style={{ backgroundColor: branding?.primaryColor }} />
                    <div className="pl-2">
                        <p className="mb-2 font-black uppercase tracking-tighter text-white/30 text-[9px]">Concierge Note</p>
                        <p>Connect to the network and when prompted, click <span className="text-white font-bold italic">"Accept Terms"</span> via the portal. If you experience connectivity issues, please contact Reception by dialing <span className="text-white font-bold">0</span> from your room phone.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
