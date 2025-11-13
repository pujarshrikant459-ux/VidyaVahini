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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role, studentId } = useUserRole();
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
            <span className="text-lg font-semibold font-headline">VidyaVahini</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/students")} tooltip={role === 'admin' ? "Students" : "My Child"}>
                <Link href={role === 'admin' ? '/dashboard/students' : studentProfilePath}>
                  <Users />
                  <span>{role === 'admin' ? "Students" : "My Child"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/academics")} tooltip="Academics">
                <Link href="/dashboard/academics">
                  <BookOpen />
                  <span>Academics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/transport")} tooltip="Transport">
                <Link href="/dashboard/transport">
                  <Bus />
                  <span>Transport</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/fees")} tooltip="Fees">
                <Link href="/dashboard/fees">
                  <CreditCard />
                  <span>Fees</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {role === 'admin' && (
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/staff")} tooltip="Staff">
                  <Link href="/dashboard/staff">
                    <Users />
                    <span>Staff</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/announcements")} tooltip="Announcements">
                  <Link href="/dashboard/announcements">
                    <Megaphone />
                    <span>Announcements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")} tooltip="Settings">
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>Settings</span>
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
