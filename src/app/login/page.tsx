
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCog, Shield, GraduationCap, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/hooks/use-user-role';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/hooks/use-students';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Combobox } from '@/components/ui/combobox';

export default function LoginPage() {
  const { setLogin } = useUserRole();
  const { students } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();

  const handleAdminLogin = () => {
    setLogin('admin');
    router.push('/dashboard');
  };

  const handleParentLogin = () => {
    if (!selectedStudent) {
      toast({
        variant: 'destructive',
        title: 'Please select a student',
        description: 'You must select your child from the list to log in as a parent.',
      });
      return;
    }
    setLogin('parent', selectedStudent);
    router.push('/dashboard');
  };

  const studentOptions = students.map(student => ({
    value: student.id,
    label: `${student.name} - ${student.class}`
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
       <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline">VidyaVahini</h1>
          </Link>
           <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2" />
                  Back to Home
                </Link>
            </Button>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent text-accent-foreground rounded-full p-4 w-fit mb-4">
                  <Shield className="h-10 w-10" />
                </div>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Access the administrative dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input id="admin-email" type="email" placeholder="admin@example.com" defaultValue="admin@example.com" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input id="admin-password" type="password" defaultValue="password" />
                </div>
                <Button className="w-full" onClick={handleAdminLogin}>
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-accent text-accent-foreground rounded-full p-4 w-fit mb-4">
                  <UserCog className="h-10 w-10" />
                </div>
                <CardTitle>Parent Login</CardTitle>
                <CardDescription>Access the parent portal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="parent-student">Select Your Child</Label>
                    <Combobox
                        options={studentOptions}
                        value={selectedStudent}
                        onChange={setSelectedStudent}
                        placeholder="Select a student..."
                        searchPlaceholder="Search for a student..."
                        noResultsMessage="No student found."
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="parent-password">Password</Label>
                    <Input id="parent-password" type="password" defaultValue="password" />
                </div>
                <Button className="w-full" onClick={handleParentLogin}>
                  Login as Parent
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
