import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE - Delete user account and all associated data
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const json = await req.json();

        // Require confirmation
        if (json.confirm !== "DELETE_MY_ACCOUNT") {
            return new NextResponse(
                "Confirmation required. Send { confirm: 'DELETE_MY_ACCOUNT' }",
                { status: 400 }
            );
        }

        const userId = session.user.id;

        // Use transaction to ensure all data is deleted atomically
        await prisma.$transaction(async (tx) => {
            // Delete all user's tasks tags
            await tx.taskTag.deleteMany({
                where: { task: { userId } },
            });

            // Delete all user's tasks
            await tx.task.deleteMany({
                where: { userId },
            });

            // Delete all user's routine logs
            await tx.routineLog.deleteMany({
                where: { routine: { userId } },
            });

            // Delete all user's routines
            await tx.routine.deleteMany({
                where: { userId },
            });

            // Delete all user's goal tags
            await tx.goalTag.deleteMany({
                where: { goal: { userId } },
            });

            // Delete all user's milestones
            await tx.milestone.deleteMany({
                where: { goal: { userId } },
            });

            // Delete all user's goals
            await tx.goal.deleteMany({
                where: { userId },
            });

            // Delete all user's projects
            await tx.project.deleteMany({
                where: { userId },
            });

            // Delete all user's achievements
            await tx.achievement.deleteMany({
                where: { userId },
            });

            // Finally, delete the user
            await tx.user.delete({
                where: { id: userId },
            });
        });

        return NextResponse.json({
            success: true,
            message: "تم حذف الحساب بنجاح",
        });
    } catch (error) {
        console.error("Account deletion error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
