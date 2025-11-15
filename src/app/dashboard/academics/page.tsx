
"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useStudents } from "@/hooks/use-students";
import { useUserRole } from "@/hooks/use-user-role";
import { useToast } from "@/hooks/use-toast";
import { homework as initialHomework, timetable as initialTimetable, teachers } from "@/lib/data";
import type { TimetableEntry, Homework } from "@/lib/types";
import { Pencil, Save, PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";


const noteSchema = z.object({
  studentId: z.string().nonempty({ message: "Please select a student." }),
  note: z.string().min(10, { message: "Note must be at least 10 characters." }),
});

const homeworkSchema = z.object({
    id: z.string(),
    title: z.string().min(5, "Title must be at least 5 characters."),
    subject: z.string().min(3, "Subject is required."),
    teacher: z.string().min(3, "Teacher is required."),
    description: z.string().min(10, "Description is required."),
    dueDate: z.string().min(1, "Due date is required."),
    assignedDate: z.string().min(1, "Assigned date is required."),
})

export default function AcademicsPage() {
  const { role } = useUserRole();
  const { students, currentStudent, addBehavioralNote } = useStudents();
  const { toast } = useToast();

  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);
  const [isEditingTimetable, setIsEditingTimetable] = useState(false);
  const [homeworkList, setHomeworkList] = useState<Homework[]>(initialHomework);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [isAddHomeworkOpen, setAddHomeworkOpen] = useState(false);


  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { studentId: "", note: "" },
  });

  const homeworkForm = useForm<z.infer<typeof homeworkSchema>>({
    resolver: zodResolver(homeworkSchema),
  });

  useEffect(() => {
    if (editingHomework) {
        homeworkForm.reset(editingHomework);
    }
  }, [editingHomework, homeworkForm]);
  
  const studentForNotes = role === 'parent' ? currentStudent : null;

  const onNoteSubmit = (values: z.infer<typeof noteSchema>) => {
    const teacherName = teachers[1]?.name || 'A Teacher';
    addBehavioralNote(values.studentId, values.note, teacherName);
    toast({
      title: "Note Saved",
      description: `Behavioral note for the student has been recorded.`,
    });
    noteForm.reset();
  };
  
  const handleTimetableChange = (dayIndex: number, periodIndex: number, field: 'subject' | 'teacher', value: string) => {
    const updatedTimetable = [...timetable];
    updatedTimetable[dayIndex].periods[periodIndex] = {
      ...updatedTimetable[dayIndex].periods[periodIndex],
      [field]: value,
    };
    setTimetable(updatedTimetable);
  };

  const handleSaveTimetable = () => {
    // In a real app, you'd save this to a backend.
    setIsEditingTimetable(false);
    toast({
      title: "Timetable Saved",
      description: "The class timetable has been updated.",
    });
  };
  
  const handleEditHomework = (homework: Homework) => {
    setEditingHomework(homework);
  };

  const handleCancelEdit = () => {
    setEditingHomework(null);
  };

  const handleUpdateHomework = (data: z.infer<typeof homeworkSchema>) => {
    setHomeworkList(homeworkList.map(hw => hw.id === data.id ? data : hw));
    setEditingHomework(null);
    toast({
      title: "Homework Updated",
      description: `The assignment "${data.title}" has been updated.`,
    });
  };

  const handleAddHomework = (data: Omit<z.infer<typeof homeworkSchema>, 'id' | 'assignedDate'>) => {
    const newHomework: Homework = {
        ...data,
        id: `hw-${Date.now()}`,
        assignedDate: new Date().toISOString().split('T')[0],
    };
    setHomeworkList([newHomework, ...homeworkList]);
    setAddHomeworkOpen(false);
    toast({
      title: "Homework Added",
      description: `The assignment "${data.title}" has been created.`,
    });
  };

  const handleDeleteHomework = (id: string) => {
    setHomeworkList(homeworkList.filter(hw => hw.id !== id));
    toast({
      title: "Homework Deleted",
      description: "The assignment has been removed.",
    });
  };

  const HomeworkFormFields = ({ form, isEdit = false }: { form: any, isEdit?: boolean }) => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
       </div>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <Tabs defaultValue="homework" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="homework">Homework</TabsTrigger>
        <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
        <TabsTrigger value="notes">Behavioral Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="homework">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Homework</CardTitle>
              <CardDescription>Daily and weekly homework updates.</CardDescription>
            </div>
             {role === 'admin' && (
               <Dialog open={isAddHomeworkOpen} onOpenChange={setAddHomeworkOpen}>
                  <DialogTrigger asChild>
                     <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Homework</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Add New Homework</DialogTitle>
                        <DialogDescription>Create a new assignment for students.</DialogDescription>
                     </DialogHeader>
                      <Form {...homeworkForm}>
                        <form onSubmit={homeworkForm.handleSubmit(handleAddHomework)}>
                           <HomeworkFormFields form={homeworkForm} />
                           <DialogFooter className="mt-4">
                              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                              <Button type="submit">Add Homework</Button>
                           </DialogFooter>
                        </form>
                      </Form>
                  </DialogContent>
               </Dialog>
             )}
          </CardHeader>
          <CardContent className="space-y-4">
            {homeworkList.map((hw) => (
                <div key={hw.id}>
                {editingHomework?.id === hw.id ? (
                  <Form {...homeworkForm}>
                    <form onSubmit={homeworkForm.handleSubmit(handleUpdateHomework)} className="p-4 border rounded-lg bg-secondary/50 space-y-4">
                      <HomeworkFormFields form={homeworkForm} isEdit={true} />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="p-4 border rounded-lg relative group">
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
                     {role === 'admin' && (
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditHomework(hw)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteHomework(hw.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                     )}
                  </div>
                )}
              </div>
            ))}
             {homeworkList.length === 0 && <p className="text-center text-muted-foreground">No homework assigned.</p>}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="timetable">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Class Timetable</CardTitle>
              <CardDescription>Weekly class schedule for your child's class.</CardDescription>
            </div>
            {role === 'admin' && (
              isEditingTimetable ? (
                <Button onClick={handleSaveTimetable} size="sm">
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditingTimetable(true)} variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" /> Edit Timetable
                </Button>
              )
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>09:00 - 10:00</TableHead>
                  <TableHead>10:00 - 11:00</TableHead>
                  <TableHead>11:00 - 12:00</TableHead>
                  <TableHead>12:00 - 01:00</TableHead>
                  <TableHead>01:00 - 02:00</TableHead>
                  <TableHead>02:00 - 03:00</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((dayEntry, dayIndex) => (
                  <TableRow key={dayEntry.day}>
                    <TableCell className="font-medium">{dayEntry.day}</TableCell>
                    {dayEntry.periods.map((period, periodIndex) => (
                      <TableCell key={periodIndex}>
                        {isEditingTimetable ? (
                          period.subject === 'Lunch' ? (
                            <div>
                              <p className="font-semibold">{period.subject}</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <Input
                                value={period.subject}
                                onChange={(e) => handleTimetableChange(dayIndex, periodIndex, 'subject', e.target.value)}
                                placeholder="Subject"
                                className="h-8 text-sm"
                              />
                              <Input
                                value={period.teacher}
                                onChange={(e) => handleTimetableChange(dayIndex, periodIndex, 'teacher', e.target.value)}
                                placeholder="Teacher"
                                className="h-8 text-xs"
                              />
                            </div>
                          )
                        ) : (
                          <div>
                            <p className="font-semibold">{period.subject}</p>
                            <p className="text-xs text-muted-foreground">{period.teacher}</p>
                          </div>
                        )}
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
                  <Form {...noteForm}>
                    <form onSubmit={noteForm.handleSubmit(onNoteSubmit)} className="space-y-6">
                      <FormField
                        control={noteForm.control}
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
                        control={noteForm.control}
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

    