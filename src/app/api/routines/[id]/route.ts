import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET single routine
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
        const routine = await prisma.routine.findUnique({
            where: {
                id,
                userId: session.user.id
            },
            include: {
                logs: {
                    orderBy: { date: "desc" },
                    take: 30, // Last 30 days
                },
            },
        });

        if (!routine) {
            return new NextResponse("Routine not found", { status: 404 });
        }

        return NextResponse.json(routine);
    } catch (error) {
        console.error("Routine fetch error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH update routine
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
        const existingRoutine = await prisma.routine.findUnique({
            where: { id },
        });

        if (!existingRoutine || existingRoutine.userId !== session.user.id) {
            return new NextResponse("Routine not found", { status: 404 });
        }

        const json = await req.json();

        // Sanitize update data
        const updateData: any = {};
        if (json.title !== undefined) updateData.title = json.title;
        if (json.type !== undefined) updateData.type = json.type;
        if (json.time !== undefined) updateData.time = json.time;
        if (json.repeatDays !== undefined) updateData.repeatDays = json.repeatDays;
        if (json.enabled !== undefined) updateData.enabled = json.enabled;

        const routine = await prisma.routine.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(routine);
    } catch (error) {
        console.error("Routine update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// DELETE routine
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
        const existingRoutine = await prisma.routine.findUnique({
            where: { id },
        });

        if (!existingRoutine || existingRoutine.userId !== session.user.id) {
            return new NextResponse("Routine not found", { status: 404 });
        }

        // Prisma cascade will delete logs
        await prisma.routine.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Routine delete error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
