import React from "react";
import { CheckCircle2, Clock, Loader2, PlayCircle } from "lucide-react";

export type RequestStatus = "Pending" | "Assigned" | "In Progress" | "Completed";

export function StatusBadge({ status }: { status: RequestStatus }) {
    const statusConfig = {
        Pending: { color: "bg-amber-500/10 text-amber-500 border-amber-500/10", icon: <Clock className="w-3.5 h-3.5 mr-1.5" /> },
        Assigned: { color: "bg-white/5 text-foreground/70 border-white/10", icon: <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> },
        "In Progress": { color: "bg-blue-500/10 text-blue-500 border-blue-500/10", icon: <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> },
        Completed: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/10", icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> },
    };

    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${config.color} shadow-sm transition-all duration-300`}>
            {config.icon}
            {status}
        </span>
    );
}
