"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Copy, CheckCircle2, Wifi, Compass, Sparkles, QrCode } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useHotelBranding } from "@/utils/store";
import { motion } from "framer-motion";
import QRCode from "qrcode";

export default function WifiPage() {
    const router = useRouter();
    const params = useParams();
    const hotelSlug = params?.hotel_slug as string;
    const { branding } = useHotelBranding(hotelSlug);

    const [copied, setCopied] = useState(false);
    const [copiedNetwork, setCopiedNetwork] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string>("");

    const wifiNetwork = branding?.wifiName || (branding?.name ? `${branding.name.replace(/\s+/g, '')}_Guest` : "Hotel_Guest");
    const wifiPassword = branding?.wifiPassword || "RelaxAndUnwind";

    // Generate WiFi QR Code Data URL
    useEffect(() => {
        const generateWifiQR = async () => {
            if (!wifiNetwork) return;
            try {
                // WiFi QR Format: WIFI:S:<SSID>;T:<WPA|WEP|blank>;P:<PASSWORD>;;
                const wifiString = `WIFI:S:${wifiNetwork};T:WPA;P:${wifiPassword};;`;
                const url = await QRCode.toDataURL(wifiString, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#0f172a", // slate-900
                        light: "#ffffff",
                    },
                });
                setQrDataUrl(url);
            } catch (err) {
                console.error("Failed to generate WiFi QR:", err);
            }
        };

        generateWifiQR();
    }, [wifiNetwork, wifiPassword]);

    const handleCopy = () => {
        if (!wifiPassword) return;
        navigator.clipboard.writeText(wifiPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyNetwork = () => {
        if (!wifiNetwork) return;
        navigator.clipboard.writeText(wifiNetwork);
        setCopiedNetwork(true);
        setTimeout(() => setCopiedNetwork(false), 2000);
    };

    return (
        <div className="pb-40 px-5 pt-10 min-h-screen bg-slate-50/50 text-slate-900 max-w-[520px] mx-auto">
            <button onClick={() => router.back()} className="mb-10 flex items-center text-slate-400 hover:text-slate-600 font-bold transition-all group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-all border border-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Back to Dashboard</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-[1px] bg-amber-500/50"></div>
                    <p className="text-amber-600 font-black uppercase tracking-[0.25em] text-[10px]">Digital Concierge</p>
                </div>
                <h1 className="text-4xl font-serif text-slate-900 leading-tight tracking-tight italic">Digital<br />Connectivity</h1>
            </motion.div>

            {/* QR Connection Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] border border-slate-100 mb-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                    <Sparkles className="w-20 h-20 text-amber-500" />
                </div>

                <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center px-3 py-1 bg-amber-50 border border-amber-100 rounded-full mb-6">
                        <QrCode className="w-3 h-3 text-amber-600 mr-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Scan to auto-connect</span>
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-slate-50 rounded-[2rem] border-4 border-slate-900/5 shadow-inner">
                            {qrDataUrl ? (
                                <motion.img
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={qrDataUrl}
                                    alt="WiFi QR Code"
                                    className="w-48 h-48 rounded-2xl mix-blend-multiply"
                                />
                            ) : (
                                <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
                                    <Wifi className="w-8 h-8 text-slate-300" />
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl font-serif text-slate-900 tracking-tight mb-2 italic">One-Click Join</h3>
                    <p className="text-xs text-slate-400 font-medium px-4">Open your phone camera and scan the code to join the <span className="text-slate-900 font-black">{wifiNetwork}</span> network instantly.</p>
                </div>

                <div className="space-y-4">
                    {/* Network Name */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Network Name</p>
                            {copiedNetwork && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Copied
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 group hover:border-amber-200 transition-colors">
                            <span className="font-bold text-slate-900 truncate">
                                {wifiNetwork}
                            </span>
                            <button
                                onClick={handleCopyNetwork}
                                className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
                            >
                                <Copy className="w-4 h-4 text-amber-500" />
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</p>
                            {copied && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Copied
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 group hover:border-amber-200 transition-colors">
                            <span className="font-black italic text-slate-900 truncate pr-4">
                                {wifiPassword}
                            </span>
                            <button
                                onClick={handleCopy}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-emerald-500' : 'bg-slate-900'} text-white shadow-sm`}
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4 text-amber-500" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-amber-50/50 backdrop-blur-sm p-6 rounded-[2rem] border border-amber-100/50 shadow-sm relative overflow-hidden"
            >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/20" />

                <div className="relative z-10">
                    <div className="flex items-center mb-3">
                        <Compass className="w-3 h-3 text-amber-600 mr-2" />
                        <p className="font-black uppercase tracking-widest text-amber-600/60 text-[9px]">Connectivity Protocol</p>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-medium italic">
                        The QR code above uses the <span className="text-slate-900 font-black">WIFI:S</span> protocol for secure, touchless connection. If your device doesn't support QR joining, please use the copy buttons above to join manually.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
