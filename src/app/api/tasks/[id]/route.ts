import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET single task
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
        const task = await prisma.task.findUnique({
            where: {
                id,
                userId: session.user.id
            },
        });

        if (!task) {
            return new NextResponse("Task not found", { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Task fetch error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH update task
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
        const existingTask = await prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask || existingTask.userId !== session.user.id) {
            return new NextResponse("Task not found", { status: 404 });
        }

        const json = await req.json();

        // Sanitize update data
        const updateData: any = {};
        if (json.title !== undefined) updateData.title = json.title;
        if (json.description !== undefined) updateData.description = json.description || null;
        if (json.status !== undefined) updateData.status = json.status;
        if (json.urgency !== undefined) updateData.urgency = json.urgency;
        if (json.category !== undefined) updateData.category = json.category;
        if (json.priority !== undefined) updateData.priority = json.priority;
        if (json.dueDate !== undefined) {
            updateData.dueDate = json.dueDate ? new Date(json.dueDate) : null;
        }
        if (json.order !== undefined) updateData.order = json.order;

        const task = await prisma.task.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error("Task update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// DELETE task
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
        const existingTask = await prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask || existingTask.userId !== session.user.id) {
            return new NextResponse("Task not found", { status: 404 });
        }

        await prisma.task.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Task delete error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
