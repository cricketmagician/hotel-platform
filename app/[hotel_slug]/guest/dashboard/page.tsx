"use client";

import React, { useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import {
    Wifi, Utensils, Phone,
    Zap, Droplets, Wind, Sparkles, Coffee, Layout, ChefHat, Home, User, Compass, AlertCircle,
    ChevronLeft, ChevronRight, ExternalLink, Clock, MapPin, Music, Star, Shirt
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useHotelBranding, useSupabaseRequests, addSupabaseRequest, useSpecialOffers } from "@/utils/store";
import { useGuestRoom } from "../GuestAuthWrapper";
import { Toast } from "@/components/Toast";

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
    const { offers, loading: loadingOffers } = useSpecialOffers(branding?.id);
    const requests = useSupabaseRequests(branding?.id);
    const { roomNumber } = useGuestRoom();

    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

    const [submittingType, setSubmittingType] = React.useState<string | null>(null);
    const [toast, setToast] = React.useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
        message: "",
        type: "success",
        isVisible: false
    });

    const activeRequests = requests.filter(r => r.status === "Pending" || r.status === "In Progress");

    const handleQuickRequest = async (type: string, notes: string) => {
        if (!branding?.id || submittingType) return;

        setSubmittingType(type);
        const { error } = await addSupabaseRequest(branding.id, {
            room: roomNumber,
            type: type,
            notes: notes,
            status: "Pending",
            price: 0,
            total: 0
        });

        setSubmittingType(null);

        if (error) {
            setToast({ message: `Error: ${error.message}`, type: "error", isVisible: true });
        } else {
            setToast({ message: `${type} Request Placed Successfully`, type: "success", isVisible: true });
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
        <div className="pb-40 px-5 pt-6 min-h-screen bg-background max-w-[520px] mx-auto overflow-x-hidden">
            {/* 1. Branded Header Section (Light Luxury Glass) */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md z-50"
            >
                <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-3 px-6 border border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mr-3 border border-slate-200/50 shadow-sm overflow-hidden p-1">
                            {branding?.logoImage ? (
                                <img src={branding.logoImage} alt={branding.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-serif text-slate-900">{branding?.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-sm font-serif text-slate-900 leading-tight">{branding?.name || "The Grand Palace"}</h1>
                            <h2 className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-600/60 leading-tight mt-0.5">Concierge Active</h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-600">Secure Access</span>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Spacer for fixed header - perfectly optimized for screen flow */}
            <div className="h-[73px]"></div>

            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative group cursor-pointer z-10"
            >
                <div className="relative bg-white rounded-[2.5rem] p-8 border border-white/50 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
                    {/* Inner 3D Glow / Depth Layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/20"></div>

                    {/* Header Row: Flex between Title and Check-out */}
                    <div className="relative z-10 flex items-start justify-between mb-8">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-600/50 mb-3">Authenticated Room</p>
                            <h3 className="text-4xl font-serif text-slate-900 tracking-tight flex items-baseline">
                                Room <span className="ml-3 text-amber-600 font-bold drop-shadow-sm">{roomNumber || "101"}</span>
                            </h3>
                        </div>

                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">Check-out</p>
                            <div className="flex flex-col items-end">
                                <p className="text-xl font-serif text-slate-900 leading-none">24 Jun</p>
                                <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mt-2 whitespace-nowrap">11:00 AM Sharp</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Divider */}
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200/40 to-transparent relative z-10 mb-8"></div>

                    {/* Sanctuary Entrance Detail / Small Footer */}
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Live Concierge Active</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Secure Sanctuary</span>
                    </div>
                </div>
            </motion.div>

            {/* 5. Dynamic Special Offers Slider */}
            {(offers.length > 0 || loadingOffers) && (
                <motion.section variants={item} className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">Exclusive Privileges</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentOfferIndex((prev: number) => (prev === 0 ? offers.length - 1 : prev - 1))}
                                className="w-8 h-8 rounded-full glass flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentOfferIndex((prev: number) => (prev === offers.length - 1 ? 0 : prev + 1))}
                                className="w-8 h-8 rounded-full glass flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden group">
                        {loadingOffers ? (
                            <div className="w-full h-full glass animate-pulse flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-foreground/10 border-t-foreground/40 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentOfferIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="relative w-full h-full"
                                >
                                    <img
                                        src={offers[currentOfferIndex]?.image_url || "https://images.unsplash.com/photo-1544161515-4ae6ce6db87e?auto=format&fit=crop&q=80"}
                                        alt={offers[currentOfferIndex]?.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <h3 className="text-2xl font-serif text-white mb-2">{offers[currentOfferIndex]?.title}</h3>
                                        <p className="text-white/60 text-sm font-medium max-w-xs">{offers[currentOfferIndex]?.description}</p>
                                        <div className="mt-6">
                                            <button className="px-6 py-2.5 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-black hover:bg-amber-500 transition-colors">
                                                Claim Privilege
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </motion.section>
            )
            }

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8 mt-10"
            >
                {/* 2. Quick Actions Grid (4 Icons) */}
                <motion.section variants={item}>
                    <div className="grid grid-cols-4 gap-6">
                        {[
                            { label: "Laundry", icon: <Shirt />, bg: "bg-indigo-500/10 text-indigo-600", action: () => { } },
                            { label: "Wi-Fi", icon: <Wifi />, bg: "bg-emerald-500/10 text-emerald-600", action: () => { router.push(`/${hotelSlug}/guest/wifi`) } },
                            { label: "Dining", icon: <ChefHat />, bg: "bg-amber-500/10 text-amber-600", action: () => { router.push(`/${hotelSlug}/guest/restaurant`) } },
                            {
                                label: "Contact",
                                icon: <Phone />,
                                bg: "bg-rose-500/10 text-rose-600",
                                action: () => {
                                    if (branding?.receptionPhone) {
                                        setToast({
                                            message: `Call Reception: Dial ${branding.receptionPhone} from your room landline`,
                                            type: "success",
                                            isVisible: true
                                        });
                                        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000);
                                    }
                                }
                            }
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => action.action()}
                                className="flex flex-col items-center group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all group-active:scale-95 border border-white/5`}>
                                    {renderIcon(action.icon, "w-6 h-6")}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-foreground/40">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* 3. Smart Requests (Express Items) */}
                <motion.section variants={item}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Zap className="w-4 h-4 text-amber-500 mr-2" />
                            <h2 className="text-xl font-serif text-foreground">Quick Requests</h2>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Fast Response</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Mineral Water", icon: <Droplets />, notes: "1L Bottle", type: "Water" },
                            { label: "Clean Towels", icon: <Wind />, notes: "Fresh Set", type: "Towel" },
                            { label: "Room Cleaning", icon: <Sparkles />, notes: "Full Service", type: "Cleaning" },
                            { label: "Tea/Coffee", icon: <Coffee />, notes: "Hot Beverage", type: "TeaCoffee" },
                        ].map((req, i) => (
                            <button
                                key={i}
                                onClick={() => handleQuickRequest(req.type, req.notes)}
                                className="glass-dark p-6 rounded-[2rem] flex flex-col justify-end min-h-[110px] border border-white/10 shadow-2xl shadow-black/20 hover:shadow-emerald-500/10 hover:border-emerald-500/20 transition-all duration-500 active:scale-95 group relative overflow-hidden text-left"
                            >
                                {/* Premium Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s]"></div>

                                {/* Background Icon (Subtle Watermark) */}
                                <div className="absolute top-2 right-2 text-white opacity-10 group-hover:opacity-20 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-700">
                                    {renderIcon(req.icon, "w-12 h-12")}
                                </div>

                                {/* Accent Indicator (Rectangular Hover-Only) */}
                                <div className={`absolute top-6 left-6 w-1 h-3 rounded-sm transition-all duration-500 ${submittingType === req.type ? "bg-white animate-pulse opacity-100" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] opacity-0 group-hover:opacity-100 group-hover:-translate-y-1"}`}></div>

                                <div className="relative z-10 w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <div>
                                            <p className="text-base font-bold text-white leading-tight group-hover:translate-x-1 transition-transform duration-300">{req.label}</p>
                                            <p className="text-[9px] font-black text-white/30 mt-1 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform duration-500">{req.notes}</p>
                                        </div>
                                        {submittingType === req.type && (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-amber-500 group-hover:w-full transition-all duration-700"></div>
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
                                    <h2 className="text-xl font-serif text-foreground">Your Requests</h2>
                                </div>
                                <button onClick={() => router.push(`/${hotelSlug}/guest/status`)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View All</button>
                            </div>

                            <div className="space-y-4">
                                {activeRequests.slice(0, 2).map((req) => (
                                    <div key={req.id} className="glass p-5 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-sm">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{req.type}</p>
                                                <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-widest mt-0.5">Status: <span className="text-blue-500 font-black">{req.status}</span></p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-foreground/20" />
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
                            <h2 className="text-xl font-serif text-foreground">Concierge Desk</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { title: "Explore City", desc: "Nearby Attractions", icon: <Music /> },
                            { title: "Travel", desc: "Book a Taxi", icon: <MapPin /> },
                        ].map((c, i) => (
                            <button
                                key={i}
                                className="p-6 glass rounded-[2.5rem] border border-white/5 shadow-sm text-left group transition-all active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 text-foreground/30 group-hover:text-emerald-500 transition-colors">
                                    {renderIcon(c.icon, "w-5 h-5")}
                                </div>
                                <p className="text-sm font-bold text-foreground leading-tight">{c.title}</p>
                                <p className="text-[9px] font-medium text-foreground/40 mt-1 uppercase tracking-widest">{c.desc}</p>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* 7. Special Offers */}
                <motion.section variants={item}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 mr-2" />
                            <h2 className="text-xl font-serif text-foreground">Special Offers</h2>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#4a0404] to-[#630d0d] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(74,4,4,0.3)] border border-white/10 group">
                        {/* Luxury Decorative Elements */}
                        <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                            <Sparkles className="w-32 h-32 text-amber-400" />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 blur-[80px] rounded-full"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-md">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-400">Limited Privilege</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></div>
                                </div>
                                <h3 className="text-2xl font-serif text-white mb-2 leading-tight">Luxury Spa Experience</h3>
                                <p className="text-white/60 text-[11px] font-medium uppercase tracking-[0.25em] leading-relaxed">20% Off All Treatments Today</p>
                            </div>
                            <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(245,158,11,0.4)] active:scale-95 transition-all hover:translate-y-[-2px] hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.5)]">
                                Book Now
                            </button>
                        </div>
                    </div>
                </motion.section>
            </motion.div>

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div >
    );
}
