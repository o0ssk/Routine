import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const tasks = await prisma.task.findMany({
            where: { userId: session.user.id },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        });
        return NextResponse.json(tasks);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const json = await req.json();

        // Sanitize the data - handle empty date strings
        const taskData = {
            title: json.title,
            description: json.description || null,
            urgency: json.urgency || "normal",
            category: json.category || "personal",
            priority: json.priority || "medium",
            dueDate: json.dueDate ? new Date(json.dueDate) : null,
            userId: session.user.id,
        };

        const task = await prisma.task.create({
            data: taskData,
        });
        return NextResponse.json(task);
    } catch (error) {
        console.error("Task creation error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
