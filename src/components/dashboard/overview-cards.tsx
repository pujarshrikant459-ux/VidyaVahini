"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, AlertTriangle, IndianRupee, User } from "lucide-react";
import type { Student } from "@/lib/types";
import { useUserRole } from "@/hooks/use-user-role";
import { useStudents } from "@/hooks/use-students";

export function OverviewCards({ students: allStudents }: { students: Student[] }) {
  const { role } = useUserRole();
  const { currentStudent } = useStudents();

  if (role === 'parent') {
    const student = currentStudent;

    if (!student) {
        return (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardContent className="pt-6"><div className="text-center text-muted-foreground">Loading student data...</div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-center text-muted-foreground">Loading student data...</div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-center text-muted-foreground">Loading student data...</div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="text-center text-muted-foreground">Loading student data...</div></CardContent></Card>
            </div>
        )
    }

    const totalAttendance = student.attendance.length;
    const presentAttendance = student.attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const attendancePercentage = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(0) : 100;
    const pendingFees = student.fees.filter(f => f.status === 'pending' || f.status === 'overdue' || f.status === 'approved').length;

    return (
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Child</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{student.name}</div>
            <p className="text-xs text-muted-foreground">{student.class}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">Your child's attendance</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{pendingFees}</div>
            <p className="text-xs text-muted-foreground">installments remaining</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dues</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold flex items-center">
                 <IndianRupee className="h-6 w-6 mr-1" />
                {student.fees.filter(f => f.status !== 'paid').reduce((acc, fee) => acc + fee.amount, 0).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">Total outstanding amount</p>
            </CardContent>
        </Card>
       </div>
    )
  }

  // Admin view
  const totalStudents = allStudents.length;

  const totalAttendance = allStudents.flatMap(s => s.attendance).length;
  const presentAttendance = allStudents.flatMap(s => s.attendance).filter(a => a.status === 'present' || a.status === 'late').length;
  const attendancePercentage = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(0) : 100;

  const pendingFees = allStudents.flatMap(s => s.fees).filter(f => f.status === 'pending' || f.status === 'overdue').length;
  const totalFeesValue = allStudents.flatMap(s => s.fees).reduce((acc, fee) => acc + fee.amount, 0);


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground">in the current academic year</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendancePercentage}%</div>
          <p className="text-xs text-muted-foreground">based on daily records</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingFees}</div>
          <p className="text-xs text-muted-foreground">records require attention</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fee Collection</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-6 w-6 mr-1" />
            {totalFeesValue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-muted-foreground">for this academic year</p>
        </CardContent>
      </Card>
    </div>
  );
}
