"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: "rtl" | "ltr";
}

const translations: Record<Language, Record<string, string>> = {
    ar: {
        // Navigation
        "nav.dashboard": "لوحة التحكم",
        "nav.tasks": "المهام",
        "nav.goals": "الأهداف",
        "nav.routines": "العادات",
        "nav.achievements": "الإنجازات",
        "nav.settings": "الإعدادات",
        "nav.signOut": "تسجيل الخروج",

        // Common
        "common.save": "حفظ",
        "common.cancel": "إلغاء",
        "common.delete": "حذف",
        "common.edit": "تعديل",
        "common.add": "إضافة",
        "common.new": "جديد",
        "common.loading": "جاري التحميل...",
        "common.error": "حدث خطأ",
        "common.success": "تم بنجاح",

        // Settings
        "settings.title": "الإعدادات",
        "settings.subtitle": "إدارة حسابك وتفضيلات التطبيق.",
        "settings.profile": "الملف الشخصي",
        "settings.appearance": "المظهر",
        "settings.darkMode": "الوضع الليلي",
        "settings.darkModeDesc": "استخدم ألوان داكنة لراحة العين.",
        "settings.language": "اللغة",
        "settings.languageDesc": "لغة واجهة التطبيق.",
        "settings.notifications": "التنبيهات",
        "settings.dangerZone": "منطقة الخطر",
        "settings.deleteAccount": "حذف الحساب",
        "settings.deleteAccountDesc": "إزالة جميع بياناتك نهائياً.",

        // Auth
        "auth.login": "تسجيل الدخول",
        "auth.register": "إنشاء حساب",
        "auth.email": "البريد الإلكتروني",
        "auth.password": "كلمة المرور",
        "auth.name": "الاسم الكامل",
        "auth.forgotPassword": "نسيت كلمة المرور؟",
        "auth.noAccount": "ليس لديك حساب؟",
        "auth.hasAccount": "لديك حساب بالفعل؟",

        // Dashboard
        "dashboard.welcome": "مرحباً",
        "dashboard.subtitle": "لنحقق بعض الإنجازات اليوم",
        "dashboard.completedTasks": "المهام المنجزة",
        "dashboard.activeGoals": "الأهداف النشطة",
        "dashboard.currentStreak": "الاستمرارية الحالية",

        // Tasks
        "tasks.title": "المهام",
        "tasks.new": "مهمة جديدة",
        "tasks.empty": "لا توجد مهام",
        "tasks.completed": "مكتمل",
        "tasks.urgent": "عاجل",
        "tasks.important": "مهم",
        "tasks.normal": "عادي",

        // Goals
        "goals.title": "الأهداف",
        "goals.new": "هدف جديد",
        "goals.empty": "لا توجد أهداف",
        "goals.progress": "التقدم",

        // Routines
        "routines.title": "العادات",
        "routines.new": "عادة جديدة",
        "routines.empty": "لا توجد عادات",
        "routines.streak": "يوم",
        "routines.morning": "روتين الصباح",
        "routines.evening": "روتين المساء",
        "routines.anytime": "طوال اليوم",

        // Achievements
        "achievements.title": "لوحة الإنجازات",
        "achievements.subtitle": "تابع تقدمك واحتفل بانتصاراتك الصغيرة.",
    },
    en: {
        // Navigation
        "nav.dashboard": "Dashboard",
        "nav.tasks": "Tasks",
        "nav.goals": "Goals",
        "nav.routines": "Routines",
        "nav.achievements": "Achievements",
        "nav.settings": "Settings",
        "nav.signOut": "Sign Out",

        // Common
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.delete": "Delete",
        "common.edit": "Edit",
        "common.add": "Add",
        "common.new": "New",
        "common.loading": "Loading...",
        "common.error": "An error occurred",
        "common.success": "Success",

        // Settings
        "settings.title": "Settings",
        "settings.subtitle": "Manage your account and app preferences.",
        "settings.profile": "Profile",
        "settings.appearance": "Appearance",
        "settings.darkMode": "Dark Mode",
        "settings.darkModeDesc": "Use dark colors for eye comfort.",
        "settings.language": "Language",
        "settings.languageDesc": "Application interface language.",
        "settings.notifications": "Notifications",
        "settings.dangerZone": "Danger Zone",
        "settings.deleteAccount": "Delete Account",
        "settings.deleteAccountDesc": "Permanently remove all your data.",

        // Auth
        "auth.login": "Sign In",
        "auth.register": "Create Account",
        "auth.email": "Email",
        "auth.password": "Password",
        "auth.name": "Full Name",
        "auth.forgotPassword": "Forgot password?",
        "auth.noAccount": "Don't have an account?",
        "auth.hasAccount": "Already have an account?",

        // Dashboard
        "dashboard.welcome": "Welcome",
        "dashboard.subtitle": "Let's achieve some goals today",
        "dashboard.completedTasks": "Completed Tasks",
        "dashboard.activeGoals": "Active Goals",
        "dashboard.currentStreak": "Current Streak",

        // Tasks
        "tasks.title": "Tasks",
        "tasks.new": "New Task",
        "tasks.empty": "No tasks",
        "tasks.completed": "Completed",
        "tasks.urgent": "Urgent",
        "tasks.important": "Important",
        "tasks.normal": "Normal",

        // Goals
        "goals.title": "Goals",
        "goals.new": "New Goal",
        "goals.empty": "No goals",
        "goals.progress": "Progress",

        // Routines
        "routines.title": "Routines",
        "routines.new": "New Routine",
        "routines.empty": "No routines",
        "routines.streak": "day",
        "routines.morning": "Morning Routine",
        "routines.evening": "Evening Routine",
        "routines.anytime": "Anytime",

        // Achievements
        "achievements.title": "Achievements",
        "achievements.subtitle": "Track your progress and celebrate your wins.",
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("ar");
    const [mounted, setMounted] = useState(false);

    const dir = language === "ar" ? "rtl" : "ltr";

    // Translation function
    const t = useCallback((key: string): string => {
        return translations[language][key] || key;
    }, [language]);

    // Apply language to DOM
    const applyLanguage = useCallback((lang: Language) => {
        const html = document.documentElement;
        html.lang = lang;
        html.dir = lang === "ar" ? "rtl" : "ltr";
    }, []);

    // Set language and persist
    const setLanguage = useCallback((newLang: Language) => {
        setLanguageState(newLang);
        applyLanguage(newLang);

        // Save to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("language", newLang);
        }

        // Save to database (fire and forget)
        fetch("/api/user/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: newLang }),
        }).catch(() => {
            // Ignore errors - localStorage is the primary persistence
        });
    }, [applyLanguage]);

    // Initialize on mount
    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language | null;
        const initialLang = savedLang || "ar";

        setLanguageState(initialLang);
        applyLanguage(initialLang);
        setMounted(true);
    }, [applyLanguage]);

    if (!mounted) {
        return (
            <LanguageContext.Provider value={{ language: "ar", setLanguage: () => { }, t: (key) => key, dir: "rtl" }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

export function useTranslation() {
    const { t, language, dir } = useLanguage();
    return { t, language, dir };
}
