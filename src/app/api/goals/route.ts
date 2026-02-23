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
        const goals = await prisma.goal.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(goals);
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
        const goalData = {
            title: json.title,
            description: json.description || null,
            type: json.type || "short",
            priority: json.priority || "medium",
            startDate: json.startDate ? new Date(json.startDate) : null,
            endDate: json.endDate ? new Date(json.endDate) : null,
            userId: session.user.id,
        };

        const goal = await prisma.goal.create({
            data: goalData,
        });
        return NextResponse.json(goal);
    } catch (error) {
        console.error("Goal creation error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
