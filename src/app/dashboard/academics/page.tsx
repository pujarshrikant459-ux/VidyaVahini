"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStudents } from "@/hooks/use-students";
import { useUserRole } from "@/hooks/use-user-role";
import { useToast } from "@/hooks/use-toast";
import { homework, timetable, teachers } from "@/lib/data";

const noteSchema = z.object({
  studentId: z.string().nonempty({ message: "Please select a student." }),
  note: z.string().min(10, { message: "Note must be at least 10 characters." }),
});

export default function AcademicsPage() {
  const { role } = useUserRole();
  const { students, currentStudent, addBehavioralNote } = useStudents();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { studentId: "", note: "" },
  });
  
  const studentForNotes = role === 'parent' ? currentStudent : null;

  const onSubmit = (values: z.infer<typeof noteSchema>) => {
    // Assuming the teacher's name is available, e.g. from a logged-in teacher context
    const teacherName = teachers[1]?.name || 'A Teacher';
    addBehavioralNote(values.studentId, values.note, teacherName);
    toast({
      title: "Note Saved",
      description: `Behavioral note for the student has been recorded.`,
    });
    form.reset();
  };

  return (
    <Tabs defaultValue="homework" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="homework">Homework</TabsTrigger>
        <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
        <TabsTrigger value="notes">Behavioral Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="homework">
        <Card>
          <CardHeader>
            <CardTitle>Homework</CardTitle>
            <CardDescription>Daily and weekly homework updates for your child.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {homework.map((hw) => (
              <div key={hw.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{hw.title}</h3>
                    <p className="text-sm text-muted-foreground">Subject: {hw.subject} | Teacher: {hw.teacher}</p>
                  </div>
                  <div className="text-sm text-right">
                    <p>Due: {hw.dueDate}</p>
                    <p className="text-muted-foreground">Assigned: {hw.assignedDate}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm">{hw.description}</p>
              </div>
            ))}
             {homework.length === 0 && <p className="text-center text-muted-foreground">No homework assigned.</p>}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="timetable">
        <Card>
          <CardHeader>
            <CardTitle>Class Timetable</CardTitle>
            <CardDescription>Weekly class schedule for your child's class.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>09:00 - 10:00</TableHead>
                  <TableHead>10:00 - 11:00</TableHead>
                  <TableHead>11:00 - 12:00</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((dayEntry) => (
                  <TableRow key={dayEntry.day}>
                    <TableCell className="font-medium">{dayEntry.day}</TableCell>
                    {dayEntry.periods.map((period, index) => (
                      <TableCell key={index}>
                        <p className="font-semibold">{period.subject}</p>
                        <p className="text-xs text-muted-foreground">{period.teacher}</p>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notes">
        <div className="grid gap-6 md:grid-cols-3">
          {role === 'admin' && ( // Or 'teacher' role when implemented
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add Behavioral Note</CardTitle>
                  <CardDescription>Record an observation for a student.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a student" />
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
                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="e.g., Showed great leadership during the group project."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Save Note</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          )}

          <div className={role === 'admin' ? "md:col-span-2" : "md:col-span-3"}>
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Notes</CardTitle>
                <CardDescription>
                  Observations from teachers about your child's behavior and involvement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentForNotes && studentForNotes.behavioralNotes?.length > 0 ? (
                  studentForNotes.behavioralNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <p className="text-sm">{note.note}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        - {note.teacher} on {format(new Date(note.date), "PPP")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {role === 'parent' ? "No notes have been recorded for your child yet." : "Select a student to view notes."}
                  </p>
                )}
                 {role === 'admin' && <p className="text-center text-muted-foreground py-8">This view is for parents. Admins can add notes.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
