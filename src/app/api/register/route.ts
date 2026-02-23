import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "البيانات غير مكتملة" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "المستخدم مسجل بالفعل" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                language: "ar",
            },
        });

        // Create default routine for new user
        await prisma.routine.create({
            data: {
                userId: user.id,
                title: "التخطيط لليوم",
                type: "morning",
                time: "08:00",
                repeatDays: "0,1,2,3,4,5,6", // Every day
            },
        });

        return NextResponse.json(
            { message: "user created successfully", user: { id: user.id, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "حدث خطأ أثناء التسجيل" },
            { status: 500 }
        );
    }
}
