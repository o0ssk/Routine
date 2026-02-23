import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoutinesView from "@/components/routines/RoutinesView";

async function getRoutines(userId: string) {
    return await prisma.routine.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export default async function RoutinesPage() {
    const session = await getServerSession(authOptions);
    let routines: any[] = [];

    if (session?.user?.id) {
        try {
            routines = await getRoutines(session.user.id);
        } catch (e) {
            console.error(e);
            routines = [];
        }
    }

    return <RoutinesView routines={routines} />;
}
