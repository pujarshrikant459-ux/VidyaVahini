"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateFeeDescription } from '@/ai/flows/generate-fee-descriptions';
import type { Student } from "@/lib/types";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, PlusCircle } from 'lucide-react';

const FormSchema = z.object({
  studentId: z.string({ required_error: "Please select a student." }),
  feeType: z.string().min(2, { message: "Fee type is required." }),
  amount: z.coerce.number().positive(),
  classLevel: z.string().min(1, { message: "Class is required." }),
  description: z.string().min(5, { message: "Description is required." }),
});

type FormData = z.infer<typeof FormSchema>;

export function FeeManagementAdmin({ students }: { students: Student[] }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      feeType: "",
      amount: 0,
      description: "",
    },
  });

  const handleGenerateDescription = async () => {
    const feeType = form.getValues("feeType");
    const amount = form.getValues("amount");
    const classLevel = form.getValues("classLevel");
    
    if (!feeType || !amount || !classLevel) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in Fee Type, Amount, and Class before generating a description.",
      });
      return;
    }

    setGeneratingDesc(true);
    try {
      const result = await generateFeeDescription({ feeType, amount, classLevel });
      form.setValue("description", result.description, { shouldValidate: true });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate fee description.",
      });
    } finally {
      setGeneratingDesc(false);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async data => {
    console.log("Submitting new fee record:", data);
    toast({
      title: "Success!",
      description: `Fee record for ${data.feeType} has been added.`,
    });
    setDialogOpen(false);
    form.reset();
  };
  
  const getFeeStatus = (student: Student) => {
    const pending = student.fees.some(f => f.status === 'pending');
    const overdue = student.fees.some(f => f.status === 'overdue');
    if (overdue) return { text: 'Overdue', variant: 'destructive' as const };
    if (pending) return { text: 'Pending', variant: 'secondary' as const };
    return { text: 'Paid Up', variant: 'default' as const };
  }

  return (
    <div>
       <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4"/>Add Fee Record</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Fee Record</DialogTitle>
              <DialogDescription>
                Create a new fee record for a student. Use the AI generator for a clear description.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={(value) => {
                        const student = students.find(s => s.id === value);
                        field.onChange(value);
                        if(student) form.setValue('classLevel', student.class);
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.class}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                   <FormField
                      control={form.control}
                      name="feeType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Tuition Fee" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 5000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name="classLevel"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                       <div className="relative">
                          <FormControl>
                            <Textarea placeholder="AI-generated description will appear here..." {...field} />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute bottom-1 right-1 h-7 w-7"
                            onClick={handleGenerateDescription}
                            disabled={generatingDesc}
                            >
                            {generatingDesc ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4 text-accent" />}
                            <span className="sr-only">Generate Description</span>
                          </Button>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create Record</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Fee Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const status = getFeeStatus(student);
            return (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <Badge variant={status.variant} className={cn(status.variant === 'default' && 'bg-green-600 hover:bg-green-700')}>{status.text}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
