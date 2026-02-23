import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Ambient Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[130px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[130px]" />
            </div>

            <div className="mb-8 flex items-center gap-3 relative z-10 animate-fade-in">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-2.5 rounded-xl shadow-glow">
                    <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">Routine Master</span>
            </div>

            <div className="w-full max-w-md space-y-4 relative z-10 animate-slide-up">
                {children}
            </div>
        </div>
    );
}
