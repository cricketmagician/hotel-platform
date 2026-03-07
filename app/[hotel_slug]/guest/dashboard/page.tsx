"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { HotelLogo } from "@/components/HotelLogo";
import { RoomHeader } from "@/components/RoomHeader";
import { Wifi, Utensils, Shirt, Sparkles, Phone, Info, Droplets, CheckCircle, Clock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useHotelBranding, useSupabaseRequests, addSupabaseRequest } from "@/utils/store";
import { useGuestRoom } from "../GuestAuthWrapper";

export default function GuestDashboard() {
    const router = useRouter();
    const params = useParams();
    const hotelSlug = params?.hotel_slug as string;

    const { branding, loading } = useHotelBranding(hotelSlug);
    const requests = useSupabaseRequests(branding?.id);

    // Check for active water request
    const pendingWater = requests.find(r => r.type === "Water" && (r.status === "Pending" || r.status === "In Progress"));
    const activeRequests = requests.filter(r => r.status === "Pending" || r.status === "In Progress");

    const { roomNumber } = useGuestRoom();

    const services = [
        { id: "room-service", title: "Order Cuisine", icon: <Utensils className="w-5 h-5" />, path: `/${hotelSlug}/guest/restaurant`, category: "Dining" },
        { id: "laundry", title: "Laundry Pickup", icon: <Shirt className="w-5 h-5" />, path: `/${hotelSlug}/guest/services?type=laundry`, category: "Care" },
        { id: "housekeeping", title: "Room Cleaning", icon: <Sparkles className="w-5 h-5" />, path: `/${hotelSlug}/guest/services?type=housekeeping`, category: "Service" },
        { id: "reception", title: "Concierge Chat", icon: <Phone className="w-5 h-5" />, path: `/${hotelSlug}/guest/services?type=reception`, category: "Contact" },
        { id: "hotel-info", title: "Hotel Details", icon: <Info className="w-5 h-5" />, path: `/${hotelSlug}/guest/info`, category: "Hotel" },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const handleQuickWater = async () => {
        if (!branding?.id) return;
        const { error } = await addSupabaseRequest(branding.id, {
            room: roomNumber,
            type: "Water",
            notes: "Immediate Necessity - 500ml",
            status: "Pending",
            price: 0,
            total: 0
        });

        if (error) {
            alert(`Could not send request: ${error.message || 'Unknown error'}. Please try again or call reception.`);
        } else {
            alert("Water request sent! Our staff is on the way.");
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

    return (
        <div className="pb-32 section-padding pt-10">
            {/* Premium Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-10"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.25em] text-[10px] mb-2">Authenticated Room {roomNumber}</p>
                        <h1 className="text-4xl font-serif text-slate-900 leading-tight">
                            {getTimeGreeting()},<br /> Guest
                        </h1>
                    </div>
                    {branding?.logoImage ? (
                        <img src={branding.logoImage} alt={branding.name} className="h-12 w-auto object-contain" />
                    ) : (
                        <div className="p-4 glass rounded-[1.5rem] shadow-sm">
                            <h2 className="text-lg font-serif">{branding?.name?.charAt(0)}</h2>
                        </div>
                    )}
                </div>

                {/* Active Request Tracker Banner (Ambient Style) */}
                <AnimatePresence>
                    {activeRequests.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => router.push(`/${hotelSlug}/guest/status`)}
                            className="glass rounded-3xl p-5 mb-8 flex items-center justify-between cursor-pointer border border-slate-100/50"
                        >
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-3"></div>
                                <p className="text-sm font-bold text-slate-700">{activeRequests.length} active service signals...</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Live Status</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Express Actions Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif text-slate-900">Immediate Request</h2>
                    <div className="h-[1px] flex-1 bg-slate-100 mx-4"></div>
                </div>

                <motion.button
                    onClick={pendingWater ? () => router.push(`/${hotelSlug}/guest/status`) : handleQuickWater}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full rounded-[2.5rem] p-8 flex items-center justify-between relative overflow-hidden group shadow-2xl transition-all duration-500 ${pendingWater ? 'glass border-blue-100 shadow-blue-50' : 'bg-slate-900 shadow-slate-200'}`}
                >
                    {!pendingWater && <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-transparent opacity-50"></div>}

                    <div className="relative z-10 flex items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 transition-transform duration-500 group-hover:scale-110 ${pendingWater ? 'bg-blue-50 text-blue-600' : 'bg-white/10 text-white backdrop-blur-md border border-white/10'}`}>
                            {pendingWater ? <Clock className="w-6 h-6" /> : <Droplets className="w-6 h-6" />}
                        </div>
                        <div className="text-left">
                            <h3 className={`text-xl font-serif ${pendingWater ? 'text-slate-900' : 'text-white'}`}>
                                {pendingWater ? "Water Arriving" : "Need Water?"}
                            </h3>
                            <p className={`text-[10px] uppercase tracking-[0.2em] font-black opacity-60 mt-1 ${pendingWater ? 'text-blue-600' : 'text-white'}`}>
                                {pendingWater ? "Approx 2-4 mins" : "Express Delivery"}
                            </p>
                        </div>
                    </div>
                    {!pendingWater && (
                        <div className="relative z-10 bg-white/10 border border-white/20 p-4 rounded-2xl">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Request Now</span>
                        </div>
                    )}
                </motion.button>
            </div>

            {/* Services Grid Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif text-slate-900">Hotel Services</h2>
                    <div className="h-[1px] flex-1 bg-slate-100 mx-4"></div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-5"
                >
                    {/* Primary Action: Dining */}
                    <ServiceCard
                        featured
                        title="Order Cuisine"
                        description="Luxury Dining at your door"
                        icon={<Utensils className="w-6 h-6" />}
                        onClick={() => router.push(`/${hotelSlug}/guest/restaurant`)}
                    />

                    {/* Secondary Services Grid */}
                    <div className="grid grid-cols-2 gap-5">
                        {services.slice(1).map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                title={service.title}
                                description={service.category}
                                icon={service.icon}
                                delay={index * 0.05}
                                onClick={() => router.push(service.path)}
                            />
                        ))}
                    </div>

                    {/* Wi-Fi Quick Access Card (Luxury Redesign) */}
                    {(branding?.wifiName || branding?.wifiPassword) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group mt-10"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Wifi className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mr-4 border border-white/10">
                                        <Wifi className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-serif">Property Wi-Fi</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">Network</p>
                                        <p className="font-bold text-white truncate text-sm">{branding.wifiName || "Guest_WiFi"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">Password</p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(branding.wifiPassword || "");
                                                alert("Password copied to concierge clip");
                                            }}
                                            className="flex items-center active:scale-95 transition-transform"
                                        >
                                            <p className="font-mono font-bold text-white mr-3 text-sm">{branding.wifiPassword || "********"}</p>
                                            <div className="text-[8px] font-black uppercase tracking-widest bg-white/10 px-2 py-1 rounded-lg">Copy</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
