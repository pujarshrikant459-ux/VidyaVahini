import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { homework, timetable } from "@/lib/data";

export default function AcademicsPage() {
  return (
    <Tabs defaultValue="homework" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="homework">Homework</TabsTrigger>
        <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
      </TabsList>
      <TabsContent value="homework">
        <Card>
          <CardHeader>
            <CardTitle>Homework</CardTitle>
            <CardDescription>Daily and weekly homework updates.</CardDescription>
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
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="timetable">
        <Card>
          <CardHeader>
            <CardTitle>Class Timetable</CardTitle>
            <CardDescription>Weekly class schedule for 10th A.</CardDescription>
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
    </Tabs>
  );
}
