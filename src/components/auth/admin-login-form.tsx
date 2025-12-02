
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
import { doc, getDoc } from 'firebase/firestore';

export function AdminLoginForm() {
  const { setLogin } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  
  const [schoolId, setSchoolId] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    if (!schoolId || !adminEmail || !adminPassword) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter School ID, email, and password.',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;

      // 2. Verify the user is an admin for the given school ID
      const schoolDocRef = doc(firestore, `schools/${schoolId}`);
      const schoolDocSnap = await getDoc(schoolDocRef);

      if (!schoolDocSnap.exists()) {
        throw new Error("Invalid School ID.");
      }

      const schoolData = schoolDocSnap.data();
      const adminUids = schoolData.adminUids || [];

      if (!adminUids.includes(user.uid)) {
        throw new Error("You are not an authorized administrator for this school.");
      }
      
      // 3. If everything is valid, set login state and redirect
      setLogin('admin');
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
            <Label htmlFor="school-id">School ID</Label>
            <Input id="school-id" type="text" placeholder="Enter your school's unique ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} />
        </div>
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
