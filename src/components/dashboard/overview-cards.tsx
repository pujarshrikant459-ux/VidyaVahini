"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, AlertTriangle, IndianRupee } from "lucide-react";
import type { Student } from "@/lib/types";

export function OverviewCards({ students }: { students: Student[] }) {
  const totalStudents = students.length;

  const totalAttendance = students.flatMap(s => s.attendance).length;
  const presentAttendance = students.flatMap(s => s.attendance).filter(a => a.status === 'present' || a.status === 'late').length;
  const attendancePercentage = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(0) : 100;

  const pendingFees = students.flatMap(s => s.fees).filter(f => f.status === 'pending' || f.status === 'overdue').length;
  const totalFeesValue = students.flatMap(s => s.fees).reduce((acc, fee) => acc + fee.amount, 0);


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
          <div className="text-2xl font-bold">₹{totalFeesValue.toLocaleString('en-IN')}</div>
          <p className="text-xs text-muted-foreground">for this academic year</p>
        </CardContent>
      </Card>
    </div>
  );
}
