"use client"; // Switched to client component for animations, moving data fetch to a wrapper or keep basic server fetch if needed. 
// However, the previous code was a server component. To keep it server-side for SEO/Performance but have animations, 
// I will keep the page as Server Component and use a client-side wrapper for the animated parts.
// Actually, let's make it a client component for maximum UI smoothness as requested, leveraging SWR or useEffect if needed, 
// OR just pass data from a Server Component to a Client Component.
// For simplicity in this refactor, I will modify it to be a Client Component calling an API/Server Action or just standard Server Component -> Client Component pattern.
// Wait, the previous file was `export default async function`. I should verify if I can keep it `async`.
// I will keep it `async` (Server Component) and import a new Client Component for the animated layout.
// OR I can just use `motion.div` in a Client Component. 
// Let's refactor: Page (Server) fetches data -> DashboardView (Client).

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/dashboard/DashboardView";

async function getDashboardData(userId: string) {
    const [
        tasksCount,
        tasksCompleted,
        activeGoals,
        routinesCompletedToday
    ] = await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: "completed" } }),
        prisma.goal.count({ where: { userId, status: "in_progress" } }),
        prisma.routineLog.count({
            where: {
                routine: { userId },
                date: new Date(new Date().setHours(0, 0, 0, 0)),
                completed: true
            }
        })
    ]);

    return {
        tasksCount,
        tasksCompleted,
        activeGoals,
        routinesCompletedToday
    };
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    let data = {
        tasksCount: 0,
        tasksCompleted: 0,
        activeGoals: 0,
        routinesCompletedToday: 0
    };

    if (session?.user?.id) {
        try {
            data = await getDashboardData(session.user.id);
        } catch (e) {
            console.error("Failed to fetch dashboard data", e);
        }
    }

    return <DashboardView data={data} userName={session?.user?.name || "يا بطل"} />;
}
