import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GoalsView from "@/components/goals/GoalsView";

async function getGoals(userId: string) {
    return await prisma.goal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export default async function GoalsPage() {
    const session = await getServerSession(authOptions);
    let goals: any[] = [];

    if (session?.user?.id) {
        try {
            goals = await getGoals(session.user.id);
        } catch (e) {
            console.error(e);
            // Mock data if DB fails
            goals = [];
        }
    }

    return <GoalsView goals={goals} />;
}
