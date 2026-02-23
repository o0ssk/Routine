import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET single goal
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    try {
        const goal = await prisma.goal.findUnique({
            where: {
                id,
                userId: session.user.id
            },
            include: {
                milestones: true,
                tags: true,
            },
        });

        if (!goal) {
            return new NextResponse("Goal not found", { status: 404 });
        }

        return NextResponse.json(goal);
    } catch (error) {
        console.error("Goal fetch error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH update goal
export async function PATCH(
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
        const existingGoal = await prisma.goal.findUnique({
            where: { id },
        });

        if (!existingGoal || existingGoal.userId !== session.user.id) {
            return new NextResponse("Goal not found", { status: 404 });
        }

        const json = await req.json();

        // Sanitize update data
        const updateData: any = {};
        if (json.title !== undefined) updateData.title = json.title;
        if (json.description !== undefined) updateData.description = json.description || null;
        if (json.type !== undefined) updateData.type = json.type;
        if (json.status !== undefined) updateData.status = json.status;
        if (json.priority !== undefined) updateData.priority = json.priority;
        if (json.progress !== undefined) updateData.progress = json.progress;
        if (json.startDate !== undefined) {
            updateData.startDate = json.startDate ? new Date(json.startDate) : null;
        }
        if (json.endDate !== undefined) {
            updateData.endDate = json.endDate ? new Date(json.endDate) : null;
        }

        const goal = await prisma.goal.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(goal);
    } catch (error) {
        console.error("Goal update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// DELETE goal
export async function DELETE(
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
        const existingGoal = await prisma.goal.findUnique({
            where: { id },
        });

        if (!existingGoal || existingGoal.userId !== session.user.id) {
            return new NextResponse("Goal not found", { status: 404 });
        }

        // Prisma cascade will delete milestones and tags
        await prisma.goal.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Goal delete error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
