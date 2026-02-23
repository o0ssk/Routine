import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SettingsView from "@/components/settings/SettingsView";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    // Mock settings data if DB fetch isn't ready
    const initialSettings = {
        theme: "system",
        notifications: true,
        language: "ar",
    };

    return (
        <SettingsView
            user={{
                name: session?.user?.name || "",
                email: session?.user?.email || "",
                image: session?.user?.image || null
            }}
            initialSettings={initialSettings}
        />
    );
}
