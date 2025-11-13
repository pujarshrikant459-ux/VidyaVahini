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
import type { Transport } from "@/lib/types";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  mobile: z.string().min(10, { message: "A valid mobile number is required." }),
  photo: z.string().url({ message: "Please enter a valid image URL." }),
});

type FormData = z.infer<typeof FormSchema>;

interface DriverEditDialogProps {
  transport: Transport;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transport: Transport) => void;
}

export function DriverEditDialog({ transport, isOpen, onClose, onSave }: DriverEditDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: transport.driver.name,
      mobile: transport.driver.mobile,
      photo: transport.driver.photo,
    },
  });

  useEffect(() => {
    if (transport) {
      form.reset({
        name: transport.driver.name,
        mobile: transport.driver.mobile,
        photo: transport.driver.photo,
      });
    }
  }, [transport, form]);

  const onSubmit: SubmitHandler<FormData> = async data => {
    const updatedTransport = {
      ...transport,
      driver: {
        ...transport.driver,
        ...data,
      }
    };
    onSave(updatedTransport);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Driver Details</DialogTitle>
          <DialogDescription>
            Make changes to the driver's information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Driver Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
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
