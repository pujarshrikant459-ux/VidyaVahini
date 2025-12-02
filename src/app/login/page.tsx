
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCog, Shield, GraduationCap, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/hooks/use-user-role';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';


export default function LoginPage() {
  const { setLogin } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [adminPassword, setAdminPassword] = useState('password');
  const [parentEmail, setParentEmail] = useState('parent@example.com');
  const [parentPassword, setParentPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    // This is a mock login for admin role for now.
    // In a real app, you would have a separate admin authentication system.
    setLoading(true);
    if (adminEmail === 'admin@example.com' && adminPassword === 'password') {
        setLogin('admin');
        router.push('/dashboard');
    } else {
         toast({
            variant: 'destructive',
            title: 'Invalid Credentials',
            description: 'Please check your admin email and password.',
        });
    }
    setLoading(false);
  };

  const handleParentLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, parentEmail, parentPassword);
      const user = userCredential.user;
      
      const parentDocRef = doc(firestore, "parents", user.uid);
      const parentDocSnap = await getDoc(parentDocRef);

      let studentId = '1'; // Fallback to mock studentId
      if (parentDocSnap.exists()) {
        const parentData = parentDocSnap.data();
        if (parentData && parentData.studentIds && parentData.studentIds.length > 0) {
          studentId = parentData.studentIds[0];
        }
      }
      
      setLogin('parent', studentId);
      router.push('/dashboard');
    } catch (error: any) {
      let description = 'An unknown error occurred.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = 'Invalid email or password. Please try again.';
      } else {
        description = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: description,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
       <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline">VidyaVahini</h1>
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
                    <Input id="admin-email" type="email" placeholder="admin@example.com" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input id="admin-password" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleAdminLogin} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login as Admin'}
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
                    <Label htmlFor="parent-email">Email</Label>
                    <Input id="parent-email" type="email" placeholder="parent@example.com" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="parent-password">Password</Label>
                    <Input id="parent-password" type="password" value={parentPassword} onChange={(e) => setParentPassword(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleParentLogin} disabled={loading}>
                 {loading ? 'Logging in...' : 'Login as Parent'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
