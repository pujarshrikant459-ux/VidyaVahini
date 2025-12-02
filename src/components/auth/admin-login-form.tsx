
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserRole } from '@/hooks/use-user-role';
import { useToast } from '@/hooks/use-toast';

export function AdminLoginForm() {
  const { setLogin } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();
  
  const [schoolId, setSchoolId] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [adminPassword, setAdminPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    setLoading(true);
    // Add validation for schoolId if needed
    if (schoolId && adminEmail === 'admin@example.com' && adminPassword === 'password') {
        setLogin('admin');
        router.push('/dashboard');
    } else {
         toast({
            variant: 'destructive',
            title: 'Invalid Credentials',
            description: 'Please check your School ID, admin email, and password.',
        });
    }
    setLoading(false);
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
