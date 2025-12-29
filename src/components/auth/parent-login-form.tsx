
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

export function ParentLoginForm() {
  const { setLogin } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [parentEmail, setParentEmail] = useState('parent@example.com');
  const [parentPassword, setParentPassword] = useState('password');
  const [loading, setLoading] = useState(false);

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
      
      setLogin('parent', { studentId });
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
  );
}
