import { students } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Phone, Hash, BookUser } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = students.find((s) => s.id === params.id);

  if (!student) {
    notFound();
  }
  
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
            <CardDescription>Monthly attendance overview.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
                mode="multiple"
                selected={attendanceDates}
                defaultMonth={attendanceDates.length > 0 ? attendanceDates[0] : new Date()}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
            />
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
                    <TableCell>₹{fee.amount.toLocaleString('en-IN')}</TableCell>
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
