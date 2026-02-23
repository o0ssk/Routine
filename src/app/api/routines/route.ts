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
        const routines = await prisma.routine.findMany({
            where: { userId: session.user.id },
            orderBy: { time: "asc" },
            include: {
                logs: {
                    where: {
                        date: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            },
        });
        return NextResponse.json(routines);
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
        const routine = await prisma.routine.create({
            data: {
                ...json,
                userId: session.user.id,
            },
        });
        return NextResponse.json(routine);
    } catch (error) {
        console.error("Routine creation error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
