import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Search across tasks, goals, and routines
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim();

        if (!query || query.length < 2) {
            return NextResponse.json({ tasks: [], goals: [], routines: [] });
        }

        const userId = session.user.id;

        // Search in parallel
        const [tasks, goals, routines] = await Promise.all([
            prisma.task.findMany({
                where: {
                    userId,
                    OR: [
                        { title: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
                take: 10,
                orderBy: { updatedAt: "desc" },
            }),
            prisma.goal.findMany({
                where: {
                    userId,
                    OR: [
                        { title: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
                take: 10,
                orderBy: { updatedAt: "desc" },
            }),
            prisma.routine.findMany({
                where: {
                    userId,
                    title: { contains: query },
                },
                take: 10,
                orderBy: { updatedAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            tasks,
            goals,
            routines,
            total: tasks.length + goals.length + routines.length,
        });
    } catch (error) {
        console.error("Search error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
