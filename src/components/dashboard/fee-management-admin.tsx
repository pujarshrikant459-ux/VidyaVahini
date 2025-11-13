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
import { Sparkles, Loader2, PlusCircle, IndianRupee, CheckCircle2 } from 'lucide-react';
import { useStudents } from '@/hooks/use-students';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FormSchema = z.object({
  studentId: z.string({ required_error: "Please select a student." }),
  feeType: z.string().min(2, { message: "Fee type is required." }),
  amount: z.coerce.number().positive(),
  classLevel: z.string().min(1, { message: "Class is required." }),
  dueDate: z.string().min(1, { message: "Due date is required." }),
  description: z.string().min(5, { message: "Description is required." }),
});

type FormData = z.infer<typeof FormSchema>;

export function FeeManagementAdmin({ initialStudents }: { initialStudents?: Student[] }) {
  const { students, addFee, approveFee } = useStudents();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const { toast } = useToast();
  
  const studentList = initialStudents || students;

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      feeType: "",
      amount: 0,
      description: "",
      dueDate: "",
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
    const { studentId, ...feeData } = data;
    addFee(studentId, feeData);
    toast({
      title: "Success!",
      description: `Fee record for ${data.feeType} has been added.`,
    });
    setDialogOpen(false);
    form.reset();
  };
  
  const getFeeStatus = (student: Student) => {
    const overdue = student.fees.some(f => f.status === 'overdue');
    const approved = student.fees.some(f => f.status === 'approved');
    const pending = student.fees.some(f => f.status === 'pending');

    if (overdue) return { text: 'Overdue', variant: 'destructive' as const };
    if (approved) return { text: 'Payment Due', variant: 'secondary' as const };
    if (pending) return { text: 'Approval Pending', variant: 'outline' as const };
    return { text: 'Paid Up', variant: 'default' as const };
  };
  
  const handleApproveFee = (studentId: string, feeId: string) => {
    approveFee(studentId, feeId);
    toast({
      title: "Fee Approved",
      description: "The parent can now complete the payment.",
    });
  };

  const statusBadge = (status: 'paid' | 'pending' | 'overdue' | 'approved') => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'approved':
        return <Badge variant="secondary">Awaiting Payment</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending Approval</Badge>;
    }
  };

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
                        const student = studentList.find(s => s.id === value);
                        field.onChange(value);
                        if(student) form.setValue('classLevel', student.class);
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studentList.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.class}</SelectItem>)}
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
                          <FormLabel>Amount</FormLabel>
                           <div className="relative">
                            <FormControl>
                              <Input type="number" placeholder="e.g., 5000" className="pl-8" {...field} />
                            </FormControl>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </div>
                           </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

      <Accordion type="single" collapsible className="w-full">
        {studentList.map((student) => {
          const status = getFeeStatus(student);
          return (
            <AccordionItem value={student.id} key={student.id}>
              <AccordionTrigger>
                  <div className="flex justify-between w-full items-center pr-4">
                    <div className="flex flex-col items-start">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-sm text-muted-foreground">{student.class}</span>
                    </div>
                    <Badge variant={status.variant} className={cn(status.variant === 'default' && 'bg-green-600 hover:bg-green-700')}>{status.text}</Badge>
                  </div>
              </AccordionTrigger>
              <AccordionContent>
                {student.fees.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.fees.map(fee => (
                        <TableRow key={fee.id}>
                          <TableCell>{fee.type}</TableCell>
                          <TableCell className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />{fee.amount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell>{fee.dueDate}</TableCell>
                          <TableCell>{statusBadge(fee.status)}</TableCell>
                          <TableCell>
                            {fee.status === 'pending' && (
                              <Button size="sm" onClick={() => handleApproveFee(student.id, fee.id)}>
                                <CheckCircle2 className="mr-2 h-4 w-4"/>
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground p-4">No fee records found.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  );
}
