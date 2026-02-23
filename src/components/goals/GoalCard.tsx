import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/components";
import { Target } from "lucide-react";

interface GoalProps {
    id: string;
    title: string;
    progress: number;
    endDate: Date | null;
    status: string;
}

export function GoalCard({ goal }: { goal: GoalProps }) {
    return (
        <Link href={`/goals/${goal.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{goal.title}</CardTitle>
                        <Target className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm text-text-secondary">
                                <span>التقدم</span>
                                <span>{goal.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all rounded-full"
                                    style={{ width: `${goal.progress}%` }}
                                />
                            </div>
                        </div>

                        {goal.endDate && (
                            <div className="text-xs text-text-secondary">
                                ينتهي في {format(new Date(goal.endDate), "d MMMM yyyy", { locale: ar })}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
