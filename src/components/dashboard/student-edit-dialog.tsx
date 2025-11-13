"use client";

import { useEffect } from 'react';
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

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  class: z.string().min(1, { message: "Class is required." }),
  rollNumber: z.string().min(1, { message: "Roll number is required." }),
  contact: z.string().min(10, { message: "A valid contact number is required." }),
});

type FormData = z.infer<typeof FormSchema>;

interface StudentEditDialogProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}

export function StudentEditDialog({ student, isOpen, onClose, onSave }: StudentEditDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: student.name,
      class: student.class,
      rollNumber: student.rollNumber,
      contact: student.contact,
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        class: student.class,
        rollNumber: student.rollNumber,
        contact: student.contact,
      });
    }
  }, [student, form]);

  const onSubmit: SubmitHandler<FormData> = async data => {
    onSave({ ...student, ...data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Make changes to the student's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}