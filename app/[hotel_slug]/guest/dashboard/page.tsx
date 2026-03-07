"use client";

import React from "react";
import { ServiceCard } from "@/components/ServiceCard";
import {
    Wifi, Utensils, Shirt, Sparkles, Phone, Info, Droplets,
    CheckCircle, Clock, Key, MapPin, Ticket, Coffee, Music,
    Wind, MessageSquare, ChevronRight, Zap, Star
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useHotelBranding, useSupabaseRequests, addSupabaseRequest } from "@/utils/store";
import { useGuestRoom } from "../GuestAuthWrapper";

// Helper to safely render icons with className
const renderIcon = (icon: React.ReactNode, className: string) => {
    return React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { className })
        : icon;
};

export default function GuestDashboard() {
    const router = useRouter();
    const params = useParams();
    const hotelSlug = params?.hotel_slug as string;

    const { branding, loading } = useHotelBranding(hotelSlug);
    const requests = useSupabaseRequests(branding?.id);
    const { roomNumber } = useGuestRoom();

    const activeRequests = requests.filter(r => r.status === "Pending" || r.status === "In Progress");

    const handleQuickRequest = async (type: string, notes: string) => {
        if (!branding?.id) return;
        const { error } = await addSupabaseRequest(branding.id, {
            room: roomNumber,
            type: type,
            notes: notes,
            status: "Pending",
            price: 0,
            total: 0
        });

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            // Subtle success trigger
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="pb-40 section-padding pt-6 min-h-screen bg-[#fcfcfc]">
            {/* 1. Branded Hero Section */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mr-4 border border-white shadow-sm overflow-hidden">
                            {branding?.logoImage ? (
                                <img src={branding.logoImage} alt={branding.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl font-serif text-slate-800">{branding?.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-sm font-serif text-slate-900 italic opacity-60">Welcome to</h2>
                            <h1 className="text-xl font-serif text-slate-900">{branding?.name || "The Grand Palace"}</h1>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="p-3 glass rounded-2xl border border-white shadow-sm flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Verified</span>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] p-6 border border-white shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Authenticated Room</p>
                        <h3 className="text-2xl font-serif text-slate-900">Room {roomNumber || "500"}</h3>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-200"></div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Check-out</p>
                        <p className="text-sm font-bold text-slate-700">24 Jun • 11:00 AM</p>
                    </div>
                </div>
            </motion.header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-12"
            >
                {/* 2. Quick Actions Grid (4 Icons) */}
                <motion.section variants={item}>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { icon: <Key />, label: "Room Key", bg: "bg-amber-50 text-amber-600" },
                            { icon: <Wifi />, label: "WiFi", bg: "bg-blue-50 text-blue-600", path: `/${hotelSlug}/guest/wifi` },
                            { icon: <Utensils />, label: "Dining", bg: "bg-emerald-50 text-emerald-600", path: `/${hotelSlug}/guest/restaurant` },
                            { icon: <Phone />, label: "Contact", bg: "bg-purple-50 text-purple-600", path: `/${hotelSlug}/guest/services?type=reception` },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => action.path && router.push(action.path)}
                                className="flex flex-col items-center group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all group-active:scale-95 border border-white/50`}>
                                    {renderIcon(action.icon, "w-6 h-6")}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* 3. Smart Requests (Express Items) */}
                <motion.section variants={item}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Zap className="w-4 h-4 text-amber-500 mr-2" />
                            <h2 className="text-xl font-serif text-slate-900">Quick Requests</h2>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Fast Response</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Mineral Water", icon: <Droplets />, notes: "1L Bottle", type: "Water" },
                            { label: "Clean Towels", icon: <Wind />, notes: "Fresh Set", type: "Towel" },
                            { label: "Room Cleaning", icon: <Sparkles />, notes: "Full Service", type: "Cleaning" },
                            { label: "Memory Pillow", icon: <Coffee />, notes: "Extra Comfort", type: "Pillow" },
                        ].map((req, i) => (
                            <button
                                key={i}
                                onClick={() => handleQuickRequest(req.type, req.notes)}
                                className="glass p-5 rounded-3xl flex flex-col items-start border border-white shadow-sm hover:shadow-md transition-all active:scale-95 group relative overflow-hidden text-left"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    {renderIcon(req.icon, "w-12 h-12")}
                                </div>
                                <div className="text-slate-400 mb-3 group-hover:text-amber-500 transition-colors">
                                    {renderIcon(req.icon, "w-5 h-5")}
                                </div>
                                <p className="text-sm font-bold text-slate-900 leading-tight">{req.label}</p>
                                <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{req.notes}</p>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* 4. Main Experience Card (Order Cuisine) */}
                <motion.section variants={item}>
                    <ServiceCard
                        featured
                        title="Order Cuisine"
                        description="Luxury Dining at your door"
                        image="/images/luxury/dining.png"
                        icon={<Utensils className="w-6 h-6" />}
                        onClick={() => router.push(`/${hotelSlug}/guest/restaurant`)}
                    />
                </motion.section>

                {/* 5. Active Requests (Status Tracking) */}
                <AnimatePresence>
                    {activeRequests.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            variants={item}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-blue-500 mr-2" />
                                    <h2 className="text-xl font-serif text-slate-900">Your Requests</h2>
                                </div>
                                <button onClick={() => router.push(`/${hotelSlug}/guest/status`)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View All</button>
                            </div>

                            <div className="space-y-4">
                                {activeRequests.slice(0, 2).map((req) => (
                                    <div key={req.id} className="glass p-5 rounded-[2rem] flex items-center justify-between border border-white/50">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{req.type}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Status: <span className="text-blue-500 font-black">{req.status}</span></p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* 6. Concierge Section (Upsell) */}
                <motion.section variants={item}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-emerald-500 mr-2" />
                            <h2 className="text-xl font-serif text-slate-900">Concierge Desk</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { title: "Explore City", desc: "Nearby Attractions", icon: <Music /> },
                            { title: "Travel", desc: "Book a Taxi", icon: <MapPin /> },
                        ].map((c, i) => (
                            <button
                                key={i}
                                className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-left group hover:shadow-md transition-all active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center mb-4 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                    {renderIcon(c.icon, "w-5 h-5")}
                                </div>
                                <p className="text-sm font-bold text-slate-900 leading-tight">{c.title}</p>
                                <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{c.desc}</p>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* 7. Special Offers */}
                <motion.section variants={item}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 mr-2" />
                            <h2 className="text-xl font-serif text-slate-900">Special Offers</h2>
                        </div>
                    </div>

                    <div className="bg-amber-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <Sparkles className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 mb-2 block">Limited Time</span>
                                <h3 className="text-2xl font-serif mb-2">Luxury Spa Experience</h3>
                                <p className="text-amber-100/70 text-[11px] font-medium uppercase tracking-widest">20% Off All Treatments Today</p>
                            </div>
                            <button className="bg-white text-amber-900 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-transform hover:bg-amber-50">Book Now</button>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
}
