
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { UserRoleProvider } from '@/hooks/use-user-role';
import { AnnouncementsProvider } from '@/hooks/use-announcements';
import { StudentsProvider } from '@/hooks/use-students';
import { GalleryProvider } from '@/hooks/use-gallery';
import { SiteContentProvider } from '@/hooks/use-site-content';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'VidyaVahini',
  description: 'Karnataka Government School Management Portal',
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
          <UserRoleProvider>
            <AnnouncementsProvider>
              <StudentsProvider>
                <GalleryProvider>
                  <SiteContentProvider>
                    {children}
                  </SiteContentProvider>
                </GalleryProvider>
              </StudentsProvider>
            </AnnouncementsProvider>
          </UserRoleProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
