import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/components";
import { CheckCircle, Clock, Target, Trophy } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/components";

async function getDashboardData(userId: string) {
    // Parallel data fetching
    const [
        tasksCount,
        tasksCompleted,
        activeGoals,
        routinesCompletedToday
    ] = await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: "completed" } }),
        prisma.goal.count({ where: { userId, status: "in_progress" } }),
        prisma.routineLog.count({
            where: {
                routine: { userId },
                date: new Date(new Date().setHours(0, 0, 0, 0)), // Today at midnight
                completed: true
            }
        })
    ]);

    return {
        tasksCount,
        tasksCompleted,
        activeGoals,
        routinesCompletedToday
    };
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Create mocked data if database access fails (or handle gracefully)
    let data = {
        tasksCount: 0,
        tasksCompleted: 0,
        activeGoals: 0,
        routinesCompletedToday: 0
    };

    if (session?.user?.id) {
        try {
            data = await getDashboardData(session.user.id);
        } catch (e) {
            console.error("Failed to fetch dashboard data", e);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">نظرة عامة</h1>
                <div className="flex items-center gap-2">
                    <Link href="/tasks/new">
                        <Button>+ مهمة جديدة</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المهام المنجزة</CardTitle>
                        <CheckCircle className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.tasksCompleted} / {data.tasksCount}</div>
                        <p className="text-xs text-text-secondary">
                            {(data.tasksCount > 0 ? (data.tasksCompleted / data.tasksCount * 100).toFixed(0) : 0)}% معدل الإنجاز
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">عادات اليوم</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.routinesCompletedToday}</div>
                        <p className="text-xs text-text-secondary">عادات تم إنجازها اليوم</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الأهداف النشطة</CardTitle>
                        <Target className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.activeGoals}</div>
                        <p className="text-xs text-text-secondary">أهداف جارية العمل عليها</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">النقاط (قريباً)</CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-text-secondary">نظام المكافآت قادم</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>الإنتاجية الأسبوعية</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
                            <p className="text-text-secondary text-sm">مخطط الإنتاجية سيظهر هنا</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>مهام اليوم</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-text-secondary text-center py-8">لا توجد مهام معلقة اليوم.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
