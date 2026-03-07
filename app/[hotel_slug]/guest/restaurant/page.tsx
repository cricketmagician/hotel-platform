"use client";

import React, { useState } from "react";
import { MenuCard } from "@/components/MenuCard";
import { ShoppingCart, CheckCircle, ArrowLeft, Trash2, Plus } from "lucide-react";
import { addSupabaseRequest, useHotelBranding } from "@/utils/store";
import { useGuestRoom } from "../GuestAuthWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

export default function RestaurantPage() {
    const router = useRouter();
    const params = useParams();
    const hotelSlug = params?.hotel_slug as string;
    const { branding } = useHotelBranding(hotelSlug);
    const { roomNumber } = useGuestRoom();

    const [cart, setCart] = useState<{ id: string; title: string; price: number }[]>([]);
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const menu = [
        { id: "1", title: "Club Sandwich", description: "Triple decker with chicken, bacon, lettuce, and tomato.", price: 18.0, image: "https://images.unsplash.com/photo-1528733918455-5a59687cedf0?q=80&w=300&h=300&auto=format&fit=crop" },
        { id: "2", title: "Caesar Salad", description: "Crisp romaine, croutons, parmesan, creamy dressing.", price: 14.5, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=300&h=300&auto=format&fit=crop" },
        { id: "3", title: "Margherita Pizza", description: "Fresh mozzarella, tomatoes, and basil on thin crust.", price: 22.0, image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?q=80&w=300&h=300&auto=format&fit=crop" },
        { id: "4", title: "Beef Burger", description: "Wagyu beef patty, cheddar, caramelized onions, fries.", price: 24.0, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&h=300&auto=format&fit=crop" },
    ];

    const addToCart = (item: any) => {
        setCart([...cart, item]);
    };

    const handleOrder = async () => {
        if (!branding?.id) return;
        setIsOrdering(true);
        // Artificial delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 2000));

        const { error } = await addSupabaseRequest(branding.id, {
            room: roomNumber,
            type: `Dining Order (${cart.length} items)`,
            notes: cart.map(item => item.title).join(", "),
            status: "Pending",
            price: cartTotal,
            total: cartTotal
        });

        setIsOrdering(false);

        if (error) {
            alert(`Order Failed: ${error.message || 'Please try again or contact the front desk.'}`);
        } else {
            setOrderComplete(true);
            setCart([]);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

    if (orderComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
            >
                <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-100/50">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Order Received!</h2>
                <p className="text-slate-500 font-medium mb-8">Chef is starting your meal right now.</p>
                <button onClick={() => router.push(`/${hotelSlug}/guest/status`)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                    View Progress
                </button>
            </motion.div>
        );
    }

    return (
        <div className="pb-40 section-padding pt-10">
            <div className="flex items-center justify-between mb-10">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full glass flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                    <ArrowLeft className="w-5 h-5 text-slate-800" />
                </button>
                <h1 className="text-2xl font-serif text-slate-900">{branding?.name || "The Grand Dining"}</h1>
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative w-12 h-12 rounded-[1.25rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                    style={{ backgroundColor: branding?.primaryColor }}
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cart.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-amber-600 text-white text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                        >
                            {cart.length}
                        </motion.span>
                    )}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[2.5rem] p-6 mb-10 flex items-center border border-white"
            >
                <div className="w-1.5 h-12 bg-amber-600 rounded-full mr-5"></div>
                <div>
                    <h4 className="font-serif text-lg text-slate-900">Gourmet Selection</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Curated for your palate</p>
                </div>
            </motion.div>

            <div className="space-y-6">
                {menu.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                    >
                        <MenuCard
                            title={item.title}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            onAdd={() => addToCart(item)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Premium Slide-up Cart */}
            <AnimatePresence>
                {cart.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md z-50 px-2"
                    >
                        <div className="glass-dark rounded-[2.5rem] p-6 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 mb-1">Total Signals</p>
                                    <p className="text-2xl font-serif text-white">${cartTotal.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={handleOrder}
                                    disabled={isOrdering}
                                    className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isOrdering ? "Transmitting..." : "Initialize"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
