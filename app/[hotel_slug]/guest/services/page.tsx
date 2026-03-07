"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Send, MessageSquare } from "lucide-react";
import { RequestButton } from "@/components/RequestButton";
import { addSupabaseRequest, useHotelBranding } from "@/utils/store";
import { useGuestRoom } from "../GuestAuthWrapper";
import { motion, AnimatePresence } from "framer-motion";

function ServiceContent() {
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();
    const hotelSlug = params?.hotel_slug as string;
    const { branding } = useHotelBranding(hotelSlug);
    const { roomNumber } = useGuestRoom();

    const type = searchParams.get("type") || "general";

    const [notes, setNotes] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const serviceTitles: Record<string, string> = {
        laundry: "Laundry Service",
        housekeeping: "Housekeeping",
        reception: "Front Desk",
        general: "General Request"
    };

    const handleSubmit = async () => {
        if (!branding?.id) return;
        setIsLoading(true);
        // Simulate network delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        await addSupabaseRequest(branding.id, {
            room: roomNumber,
            type: serviceTitles[type] || serviceTitles.general,
            notes: notes,
            status: "Pending",
            price: 0,
            total: 0
        });

        setIsLoading(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/10"
                >
                    <CheckCircle className="w-12 h-12" />
                </motion.div>
                <h2 className="text-3xl font-black text-foreground mb-2">Request Sent!</h2>
                <p className="text-foreground/60 font-medium mb-8">Our team has been notified and is on their way.</p>
                <button
                    onClick={() => router.push(`/${hotelSlug}/guest/status`)}
                    className="w-full bg-white text-black py-4 rounded-2xl font-bold shadow-xl shadow-black/20 active:scale-95 transition-transform"
                >
                    Track Request
                </button>
            </motion.div>
        );
    }

    return (
        <div className="pb-32 section-padding pt-10 min-h-screen bg-background text-foreground">
            <button onClick={() => router.back()} className="mb-8 flex items-center text-foreground/40 hover:text-foreground font-bold transition-all group">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                Retreat to Dashboard
            </button>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-serif text-foreground tracking-tight leading-tight">
                    How can we<br /><span className="text-amber-500" style={{ color: branding?.primaryColor }}>care for you?</span>
                </h1>
                <p className="text-foreground/40 mt-4 font-black uppercase tracking-[0.25em] text-[10px]">Service: {serviceTitles[type]}</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-dark p-8 rounded-[2.5rem] shadow-2xl shadow-black/20 border border-white/5"
            >
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-white/5 text-white rounded-2xl mr-4" style={{ backgroundColor: `${branding?.primaryColor}20`, color: branding?.primaryColor }}>
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <label className="text-lg font-serif text-white/90">Special Instructions</label>
                </div>

                <textarea
                    className="w-full h-40 p-6 bg-white/5 border border-white/5 rounded-2xl mb-8 focus:ring-4 focus:ring-white/5 text-white font-medium transition-all placeholder:text-white/20 resize-none"
                    placeholder="Tell us what you need (e.g., more pillows, foam bath, etc.)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <RequestButton
                    onClick={handleSubmit}
                    loading={isLoading}
                    className="w-full bg-white hover:bg-slate-100 text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-black/20 active:scale-[0.98] transition-all flex items-center justify-center border-none"
                    style={{ backgroundColor: branding?.primaryColor, color: branding?.primaryColor ? '#fff' : undefined }}
                >
                    <Send className="w-4 h-4 mr-3" /> Send Signal
                </RequestButton>
            </motion.div>
        </div>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
            <ServiceContent />
        </Suspense>
    );
}
