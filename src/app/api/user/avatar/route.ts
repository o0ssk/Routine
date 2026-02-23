import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// POST - Upload profile avatar
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return new NextResponse("Invalid file type. Allowed: JPG, PNG, GIF, WebP", { status: 400 });
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return new NextResponse("File too large. Max size: 2MB", { status: 400 });
        }

        // Generate unique filename
        const ext = file.name.split(".").pop();
        const filename = `avatar_${session.user.id}_${Date.now()}.${ext}`;

        // Save to public/uploads
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, filename);
        const bytes = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(bytes));

        // Update user image in database
        const imageUrl = `/uploads/${filename}`;
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl },
        });

        // Delete old avatar if exists (optional cleanup)
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { image: true },
        });

        return NextResponse.json({
            success: true,
            imageUrl,
            message: "تم تحديث الصورة بنجاح"
        });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
