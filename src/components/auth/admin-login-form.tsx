
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/hooks/use-user-role';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function AdminLoginForm() {
  const { setLogin } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [adminPassword, setAdminPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    if (!adminEmail || !adminPassword) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter your email and password.',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;

      // 2. Verify the user is an admin by checking across all schools
      const schoolsQuery = query(collection(firestore, 'schools'), where('adminUids', 'array-contains', user.uid));
      const querySnapshot = await getDocs(schoolsQuery);

      if (querySnapshot.empty) {
         throw new Error("You are not an authorized administrator for any school.");
      }
      
      // Assuming admin belongs to the first school found
      const schoolDoc = querySnapshot.docs[0];
      const schoolData = schoolDoc.data();
      const schoolId = schoolDoc.id;
      const schoolName = schoolData.name;

      // 3. If everything is valid, set login state and redirect
      setLogin('admin', { schoolId, schoolName });
      router.push('/dashboard');

    } catch (error: any) {
      let description = "An unknown error occurred.";
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
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
