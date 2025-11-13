"use client";

import Link from "next/link";
import {
  Bell,
  GraduationCap,
  LifeBuoy,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useUserRole } from "@/hooks/use-user-role";

export function DashboardHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { announcements, notificationCount, resetNotificationCount } = useAnnouncements();
  const { role } = useUserRole();

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1 && segments[0] === 'dashboard') {
      return 'Dashboard';
    }
    if (segments.length > 1) {
      const title = segments[segments.length - 1];
      if (segments[1] === 'students' && segments.length > 2) return 'Student Profile';
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
    return "VidyaVahini";
  };
  
  const handleNotificationClick = (e: React.MouseEvent) => {
    if (notificationCount > 0) {
      resetNotificationCount();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isMobile && <SidebarTrigger />}
      <h1 className="text-xl font-semibold md:text-2xl font-headline">{getPageTitle()}</h1>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5" />
              {role === 'parent' && notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive" />
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
             {announcements.slice(0, 3).map(ann => (
              <DropdownMenuItem key={ann.id} asChild>
                <Link href="/dashboard/announcements" className="flex flex-col items-start gap-1">
                  <p className="font-medium">{ann.title}</p>
                  <p className="text-xs text-muted-foreground">{ann.content.substring(0, 50)}...</p>
                </Link>
              </DropdownMenuItem>
             ))}
             {announcements.length === 0 && (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
             )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" alt="User Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Parent/Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  parent@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <User className="mr-2" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
