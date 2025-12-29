
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCog, Shield, GraduationCap, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminLoginForm } from '@/components/auth/admin-login-form';
import { ParentLoginForm } from '@/components/auth/parent-login-form';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <div className="min-h-screen bg-background flex flex-col">
       <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline">Shiksha Connect</h1>
          </Link>
           <div className="flex items-center gap-4">
               <Button variant="outline" asChild>
                    <Link href="/">
                      <Home className="mr-2" />
                      Back to Home
                    </Link>
                </Button>
            </div>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="container max-w-4xl mx-auto">
         {isClient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent text-accent-foreground rounded-full p-4 w-fit mb-4">
                  <Shield className="h-10 w-10" />
                </div>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Access the administrative dashboard.</CardDescription>
              </CardHeader>
              <AdminLoginForm />
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent text-accent-foreground rounded-full p-4 w-fit mb-4">
                  <UserCog className="h-10 w-10" />
                </div>
                <CardTitle>Parent Login</CardTitle>
                <CardDescription>Access the parent portal.</CardDescription>
              </CardHeader>
              <ParentLoginForm />
            </Card>
          </div>
         )}
        </div>
      </div>
    </div>
  );
}
