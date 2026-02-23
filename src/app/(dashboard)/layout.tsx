import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-text-primary selection:bg-primary/30 selection:text-primary-dark">
            {/* Ambient Background Mesh */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[100px]" />
            </div>

            <Sidebar className="hidden md:flex relative z-20" />

            <div className="flex flex-1 flex-col overflow-hidden relative z-10">
                <Header />
                <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-8 scroll-smooth">
                    <div className="mx-auto max-w-7xl animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
