
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { UserRoleProvider } from '@/hooks/use-user-role';
import { AnnouncementsProvider } from '@/hooks/use-announcements';
import { StudentsProvider } from '@/hooks/use-students';
import { SiteContentProvider } from '@/hooks/use-site-content';
import { FirebaseClientProvider } from '@/firebase';
import { LocalizationProvider } from '@/hooks/use-localization';

export const metadata: Metadata = {
  title: 'Shiksha Connect: Karnataka\'s Digital Education Portal',
  description: 'Connecting schools, empowering students, and building a brighter future for Karnataka.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <FirebaseClientProvider>
          <LocalizationProvider>
            <UserRoleProvider>
              <AnnouncementsProvider>
                <StudentsProvider>
                  <SiteContentProvider>
                    {children}
                  </SiteContentProvider>
                </StudentsProvider>
              </AnnouncementsProvider>
            </UserRoleProvider>
          </LocalizationProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
