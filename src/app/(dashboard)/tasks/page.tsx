import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TasksView from "@/components/tasks/TasksView";

async function getTasks(userId: string) {
    return await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

export default async function TasksPage() {
    const session = await getServerSession(authOptions);
    let tasks: any[] = [];

    if (session?.user?.id) {
        try {
            tasks = await getTasks(session.user.id);
        } catch (e) {
            console.error(e);
            tasks = [];
        }
    }

    return <TasksView tasks={tasks} />;
}
