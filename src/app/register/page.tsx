
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
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { GraduationCap, Home } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  displayName: z.string().min(2, { message: 'Name is required.' }),
  studentId: z.string().nonempty({ message: 'Please select your child.' }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { students } = useStudents();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      studentId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const parentProfile = {
        uid: user.uid,
        email: values.email,
        displayName: values.displayName,
        studentIds: [values.studentId],
      };

      const parentDocRef = doc(firestore, 'parents', user.uid);
      
      setDocumentNonBlocking(parentDocRef, parentProfile, { merge: true });

      toast({
        title: 'Registration Successful',
        description: "You've been successfully registered. Please log in.",
      });
      router.push('/login');
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
       <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline">VidyaVahini</h1>
          </Link>
           <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">
                  Login
                </Link>
              </Button>
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Parent Registration</CardTitle>
          <CardDescription>
            Create an account to access the parent portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., parent@example.com"
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
               <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Child</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your child..." />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {students.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                            {s.name} - {s.class}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Create Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

    