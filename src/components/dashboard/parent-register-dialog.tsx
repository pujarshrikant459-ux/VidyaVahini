
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Student } from "@/lib/types";
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// This is a temporary auth instance for creating users on the server-side via an admin action.
// In a real production app, this would be handled by a secure backend function (e.g., a Firebase Function).
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

const FormSchema = z.object({
  parentName: z.string().min(2, { message: "Parent's name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof FormSchema>;

interface ParentRegisterDialogProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export function ParentRegisterDialog({ student, isOpen, onClose }: ParentRegisterDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const auth = useAuth(); // Main auth instance

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      parentName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      // NOTE: This approach of creating users on the client is for demonstration ONLY.
      // In a production environment, you MUST use a secure backend (like Firebase Functions)
      // to create user accounts to avoid exposing admin credentials or allowing open sign-ups.
      
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 1. Create the parent's profile document in Firestore
      const parentDocRef = doc(firestore, "parents", user.uid);
      await setDocumentNonBlocking(parentDocRef, {
        uid: user.uid,
        displayName: data.parentName,
        email: data.email,
        studentIds: [student.id]
      }, {});

      // 2. (Optional but good practice) Update the student document with the parent's UID
      const studentDocRef = doc(firestore, `schools/school-1/students/${student.id}`);
      const studentSnap = await getDoc(studentDocRef);
      if (studentSnap.exists()){
           await updateDoc(studentDocRef, { parentId: user.uid });
      }

      toast({
        title: "Parent Registered Successfully",
        description: `${data.parentName} can now log in with the created credentials.`,
      });
      onClose();

    } catch (error: any) {
      let description = "An unknown error occurred.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already registered. Please use a different email.";
      } else {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register Parent for {student.name}</DialogTitle>
          <DialogDescription>
            Create a login for the parent/guardian. They will use this email and password to access the portal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Parent's Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Suresh Kumar" {...field} />
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
                    <FormLabel>Parent's Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="e.g., parent@example.com" {...field} />
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
                        <Input type="password" placeholder="Min. 6 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
