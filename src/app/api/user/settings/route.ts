import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update user settings (theme, notifications, language)
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const json = await req.json();

        const updateData: any = {};
        if (json.name !== undefined) updateData.name = json.name;
        if (json.theme !== undefined) updateData.theme = json.theme;
        if (json.language !== undefined) updateData.language = json.language;
        if (json.emailNotifications !== undefined) {
            updateData.emailNotifications = json.emailNotifications;
        }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                theme: true,
                language: true,
                emailNotifications: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Settings update error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// GET - Get user settings
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                theme: true,
                language: true,
                emailNotifications: true,
            },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Settings fetch error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
