import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Log routine completion for today
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    try {
        // Verify ownership
        const routine = await prisma.routine.findUnique({
            where: { id },
            include: {
                logs: {
                    orderBy: { date: "desc" },
                    take: 1,
                },
            },
        });

        if (!routine || routine.userId !== session.user.id) {
            return new NextResponse("Routine not found", { status: 404 });
        }

        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const json = await req.json();
        const completed = json.completed ?? true;

        // Check if log exists for today
        const existingLog = await prisma.routineLog.findUnique({
            where: {
                routineId_date: {
                    routineId: id,
                    date: today,
                },
            },
        });

        let log;
        let newStreak = routine.currentStreak;

        if (existingLog) {
            // Update existing log
            log = await prisma.routineLog.update({
                where: { id: existingLog.id },
                data: { completed },
            });

            // Recalculate streak if uncompleting
            if (!completed && existingLog.completed) {
                newStreak = Math.max(0, routine.currentStreak - 1);
            } else if (completed && !existingLog.completed) {
                newStreak = routine.currentStreak + 1;
            }
        } else {
            // Create new log
            log = await prisma.routineLog.create({
                data: {
                    routineId: id,
                    date: today,
                    completed,
                },
            });

            // Update streak
            if (completed) {
                // Check if yesterday was completed for streak continuation
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                const yesterdayLog = await prisma.routineLog.findUnique({
                    where: {
                        routineId_date: {
                            routineId: id,
                            date: yesterday,
                        },
                    },
                });

                if (yesterdayLog?.completed) {
                    newStreak = routine.currentStreak + 1;
                } else {
                    newStreak = 1; // Start new streak
                }
            }
        }

        // Update routine streak
        const bestStreak = Math.max(routine.bestStreak, newStreak);
        await prisma.routine.update({
            where: { id },
            data: {
                currentStreak: newStreak,
                bestStreak,
            },
        });

        return NextResponse.json({
            log,
            currentStreak: newStreak,
            bestStreak,
        });
    } catch (error) {
        console.error("Routine log error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
