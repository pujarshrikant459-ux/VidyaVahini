
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { collection, doc } from 'firebase/firestore';
import { GraduationCap, Home, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  schoolName: z.string().min(3, { message: 'School name is required.' }),
  adminName: z.string().min(2, { message: "Admin's name is required." }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SchoolRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [registeredSchoolId, setRegisteredSchoolId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      adminName: '',
      email: '',
      password: '',
    },
  });
  
  async function getOrCreateUser(values: z.infer<typeof formSchema>): Promise<User> {
    try {
      // First, try to sign in. This handles the "email-already-in-use" case gracefully.
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      return userCredential.user;
    } catch (error: any) {
      // If sign-in fails because the user doesn't exist, create a new user.
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        return userCredential.user;
      }
      // Re-throw other errors (e.g., wrong password, network issues).
      throw error;
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // 1. Get existing user or create a new one.
      const user = await getOrCreateUser(values);

      // 2. Create the school document in Firestore
      const schoolsColRef = collection(firestore, 'schools');
      const schoolDocRef = await addDocumentNonBlocking(schoolsColRef, {
        name: values.schoolName,
        adminUids: [user.uid], // Store admin's UID
      });
      const schoolId = schoolDocRef.id;

      // 3. Create the admin's staff profile within the school's subcollection
      const staffColRef = collection(firestore, `schools/${schoolId}/staff`);
      const adminStaffDocRef = doc(staffColRef, user.uid);
      setDocumentNonBlocking(adminStaffDocRef, {
        name: values.adminName,
        email: values.email,
        role: 'Admin',
        uid: user.uid,
      }, {});

      setRegisteredSchoolId(schoolId);
      toast({
        title: 'School Registered Successfully!',
        description: "Your school and admin account have been created.",
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  }
  
  const copyToClipboard = () => {
    if (registeredSchoolId) {
      navigator.clipboard.writeText(registeredSchoolId);
      toast({ title: 'Copied!', description: 'School ID copied to clipboard.' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline">Shiksha Connect</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/"><Home className="mr-2" /> Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          {registeredSchoolId ? (
             <CardContent className="pt-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
                <p className="text-muted-foreground mb-4">Your school has been successfully registered. Please save your School ID. You will need it to log in.</p>
                <Alert>
                  <AlertTitle>Your School ID</AlertTitle>
                  <AlertDescription
                    className="font-mono text-lg break-all cursor-pointer"
                    onClick={copyToClipboard}
                    title="Click to copy"
                  >
                    {registeredSchoolId}
                  </AlertDescription>
                </Alert>
                <Button asChild className="mt-6 w-full">
                  <Link href="/login">Proceed to Login</Link>
                </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>School Registration</CardTitle>
                <CardDescription>
                  Register your school to start using Shiksha Connect.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Govt. High School, Mysuru" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="adminName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Administrator's Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Ramesh Kumar" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Administrator's Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="e.g., admin@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Registering...' : 'Register School'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
