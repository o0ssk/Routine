import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Achievement definitions with unlock criteria
const ACHIEVEMENT_DEFINITIONS = [
    {
        id: "first_task",
        type: "tasks",
        title: "بداية الرحلة",
        description: "أنجز مهمتك الأولى",
        icon: "CheckCircle",
        threshold: 1,
    },
    {
        id: "task_10",
        type: "tasks",
        title: "محارب المهام",
        description: "أنجز 10 مهام",
        icon: "Target",
        threshold: 10,
    },
    {
        id: "task_50",
        type: "tasks",
        title: "سيد الإنتاجية",
        description: "أنجز 50 مهمة",
        icon: "Crown",
        threshold: 50,
    },
    {
        id: "task_100",
        type: "tasks",
        title: "أسطورة الإنجاز",
        description: "أنجز 100 مهمة",
        icon: "Trophy",
        threshold: 100,
    },
    {
        id: "first_goal",
        type: "goals",
        title: "حالم طموح",
        description: "أنشئ هدفك الأول",
        icon: "Star",
        threshold: 1,
        countCreated: true,
    },
    {
        id: "goal_complete",
        type: "goals",
        title: "قاهر الأهداف",
        description: "حقق هدفك الأول",
        icon: "Medal",
        threshold: 1,
    },
    {
        id: "goal_5",
        type: "goals",
        title: "صانع النجاح",
        description: "حقق 5 أهداف",
        icon: "Award",
        threshold: 5,
    },
    {
        id: "first_routine",
        type: "routines",
        title: "باني العادات",
        description: "أنشئ عادتك الأولى",
        icon: "Zap",
        threshold: 1,
        countCreated: true,
    },
    {
        id: "streak_7",
        type: "streak",
        title: "أسبوع من الاستمرارية",
        description: "حافظ على عادة لمدة 7 أيام متتالية",
        icon: "Flame",
        threshold: 7,
    },
    {
        id: "streak_30",
        type: "streak",
        title: "شهر من الالتزام",
        description: "حافظ على عادة لمدة 30 يوماً متتالية",
        icon: "Fire",
        threshold: 30,
    },
];

// GET - Calculate achievements from real data
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const userId = session.user.id;

        // Get real counts
        const [
            completedTasksCount,
            totalGoalsCount,
            completedGoalsCount,
            totalRoutinesCount,
            bestStreak,
        ] = await Promise.all([
            prisma.task.count({
                where: { userId, status: "completed" },
            }),
            prisma.goal.count({
                where: { userId },
            }),
            prisma.goal.count({
                where: { userId, status: "completed" },
            }),
            prisma.routine.count({
                where: { userId },
            }),
            prisma.routine.findFirst({
                where: { userId },
                orderBy: { bestStreak: "desc" },
                select: { bestStreak: true },
            }),
        ]);

        const maxStreak = bestStreak?.bestStreak || 0;

        // Calculate which achievements are earned
        const achievements = ACHIEVEMENT_DEFINITIONS.map((def) => {
            let current = 0;
            let earned = false;

            switch (def.type) {
                case "tasks":
                    current = completedTasksCount;
                    earned = current >= def.threshold;
                    break;
                case "goals":
                    if (def.countCreated) {
                        current = totalGoalsCount;
                    } else {
                        current = completedGoalsCount;
                    }
                    earned = current >= def.threshold;
                    break;
                case "routines":
                    current = totalRoutinesCount;
                    earned = current >= def.threshold;
                    break;
                case "streak":
                    current = maxStreak;
                    earned = current >= def.threshold;
                    break;
            }

            return {
                ...def,
                current,
                earned,
                progress: Math.min(100, Math.round((current / def.threshold) * 100)),
            };
        });

        // Summary stats
        const stats = {
            completedTasks: completedTasksCount,
            completedGoals: completedGoalsCount,
            totalRoutines: totalRoutinesCount,
            bestStreak: maxStreak,
            earnedCount: achievements.filter((a) => a.earned).length,
            totalCount: achievements.length,
        };

        return NextResponse.json({ achievements, stats });
    } catch (error) {
        console.error("Achievements error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
