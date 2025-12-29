
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bus,
  CreditCard,
  GraduationCap,
  Home,
  Megaphone,
  Settings,
  Users,
  BookCopy
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/use-user-role";
import { useLocalization } from "@/hooks/use-localization";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role, studentId } = useUserRole();
  const { t } = useLocalization();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };
  
  const studentProfilePath = studentId ? `/dashboard/students/${studentId}` : '/dashboard/students';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <GraduationCap className="w-7 h-7 text-sidebar-primary" />
            <span className="text-lg font-semibold font-headline">Shiksha Connect</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip={t('dashboard')}>
                <Link href="/dashboard">
                  <Home />
                  <span>{t('dashboard')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/students")} tooltip={role === 'admin' ? t('students') : t('myChild')}>
                <Link href={role === 'admin' ? '/dashboard/students' : studentProfilePath}>
                  <Users />
                  <span>{role === 'admin' ? t('students') : t('myChild')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/academics")} tooltip={t('academics')}>
                <Link href="/dashboard/academics">
                  <BookOpen />
                  <span>{t('academics')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             {role === 'admin' && (
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/classes")} tooltip={t('classes')}>
                  <Link href="/dashboard/classes">
                    <BookCopy />
                    <span>{t('classes')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/transport")} tooltip={t('transport')}>
                <Link href="/dashboard/transport">
                  <Bus />
                  <span>{t('transport')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/fees")} tooltip={t('fees')}>
                <Link href="/dashboard/fees">
                  <CreditCard />
                  <span>{t('fees')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {role === 'admin' && (
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/staff")} tooltip={t('staff')}>
                  <Link href="/dashboard/staff">
                    <Users />
                    <span>{t('staff')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/announcements")} tooltip={t('announcements')}>
                  <Link href="/dashboard/announcements">
                    <Megaphone />
                    <span>{t('announcements')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")} tooltip={t('settings')}>
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>{t('settings')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
