"use client";

import { students as initialStudents } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Phone, Hash, BookUser, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { AttendanceRecord } from "@/lib/types";
import { useUserRole } from "@/hooks/use-user-role";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { DateRange } from "react-day-picker";

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const { role } = useUserRole();
  const { toast } = useToast();
  const [students, setStudents] = useState(initialStudents);
  const student = students.find((s) => s.id === params.id);

  if (!student) {
    notFound();
  }

  const handleAttendanceChange = (
    day: Date,
    status: 'present' | 'absent' | 'late'
  ) => {
    const dateString = day.toISOString().split('T')[0];

    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (s.id === student.id) {
          const newAttendance = [...s.attendance];
          const existingRecordIndex = newAttendance.findIndex(
            (a) => a.date === dateString
          );

          if (existingRecordIndex > -1) {
            // Update existing record
            newAttendance[existingRecordIndex] = { date: dateString, status };
          } else {
            // Add new record
            newAttendance.push({ date: dateString, status });
          }

          return { ...s, attendance: newAttendance };
        }
        return s;
      })
    );
     toast({
      title: "Attendance Updated",
      description: `Marked ${student.name} as ${status} on ${day.toLocaleDateString()}.`,
    });
  };

  const attendanceDates = student.attendance.map(a => new Date(a.date));
  const modifiers = {
    present: student.attendance.filter(a => a.status === 'present').map(a => new Date(a.date)),
    absent: student.attendance.filter(a => a.status === 'absent').map(a => new Date(a.date)),
    late: student.attendance.filter(a => a.status === 'late').map(a => new Date(a.date)),
  };

  const modifiersStyles = {
    present: {
      backgroundColor: 'hsl(var(--primary) / 0.2)',
      color: 'hsl(var(--primary))',
    },
    absent: {
      backgroundColor: 'hsl(var(--destructive) / 0.2)',
      color: 'hsl(var(--destructive))',
    },
    late: {
      backgroundColor: 'hsl(var(--accent) / 0.2)',
      color: 'hsl(var(--accent))',
    },
  };

  const AttendanceCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    const getStatusForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        const record = student.attendance.find(a => a.date === dateString);
        return record?.status || 'present';
    }

    const handleSelect = (day: Date | undefined) => {
        if (role === 'admin' && day) {
            setSelectedDate(day);
        }
    }
    
    return (
        <Popover>
            <PopoverTrigger asChild disabled={role !== 'admin'}>
                <div className="relative">
                    <Calendar
                        mode="multiple"
                        selected={attendanceDates}
                        onDayClick={handleSelect}
                        defaultMonth={attendanceDates.length > 0 ? attendanceDates[0] : new Date()}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        className={cn("rounded-md border", role === 'admin' && "cursor-pointer")}
                    />
                    {role === 'admin' && (
                        <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                            <p className="bg-background/80 px-4 py-2 rounded-md text-sm text-muted-foreground">
                                Click on a date to update attendance
                            </p>
                        </div>
                    )}
                </div>
            </PopoverTrigger>
            {selectedDate && (
                <PopoverContent className="w-auto p-4">
                     <div className="space-y-4">
                         <h4 className="font-medium">Update Attendance for {selectedDate.toLocaleDateString()}</h4>
                        <RadioGroup
                            defaultValue={getStatusForDate(selectedDate)}
                            onValueChange={(status: 'present' | 'absent' | 'late') => handleAttendanceChange(selectedDate, status)}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="present" id="present" />
                                <Label htmlFor="present">Present</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="late" id="late" />
                                <Label htmlFor="late">Late</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="absent" id="absent" />
                                <Label htmlFor="absent">Absent</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Image
              src={student.photo}
              alt={student.name}
              width={128}
              height={128}
              className="rounded-full object-cover aspect-square"
              data-ai-hint="student portrait"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold font-headline">{student.name}</h2>
              <p className="text-muted-foreground">{student.class}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem icon={<User />} label="Name" value={student.name} />
            <InfoItem icon={<BookUser />} label="Class" value={student.class} />
            <InfoItem icon={<Hash />} label="Roll Number" value={student.rollNumber} />
            <InfoItem icon={<Phone />} label="Contact" value={student.contact} />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Record</CardTitle>
            <CardDescription>
              {role === 'admin' ? "Click a date to mark attendance." : "Monthly attendance overview."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <AttendanceCalendar />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee History</CardTitle>
            <CardDescription>Record of all fee payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.type}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />{fee.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>{fee.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={fee.status === 'paid' ? 'default' : (fee.status === 'overdue' ? 'destructive' : 'secondary')}
                        className={cn(fee.status === 'paid' && 'bg-green-600 hover:bg-green-700')}
                      >
                        {fee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                 {student.fees.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                            No fee records found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
