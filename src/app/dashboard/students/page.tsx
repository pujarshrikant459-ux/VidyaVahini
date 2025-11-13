"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { students as initialStudents } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StudentEditDialog } from "@/components/dashboard/student-edit-dialog";
import { StudentAddDialog } from "@/components/dashboard/student-add-dialog";
import type { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { role } = useUserRole();

  const handleEditOpen = (student: Student) => {
    setEditingStudent(student);
  };

  const handleEditClose = () => {
    setEditingStudent(null);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    toast({
      title: "Student Updated",
      description: `${updatedStudent.name}'s information has been successfully updated.`,
    });
    handleEditClose();
  };

  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'attendance' | 'fees'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `s-${Date.now()}`,
      attendance: [],
      fees: [],
    };
    setStudents(prev => [newStudent, ...prev]);
    toast({
      title: "Student Added",
      description: `${newStudent.name} has been added to the records.`,
    });
    setAddDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>Manage all student records in the school.</CardDescription>
          </div>
          {role === 'admin' && (
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="hidden md:table-cell">Roll Number</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Student avatar"
                      className="aspect-square rounded-full object-cover"
                      height="64"
                      src={student.photo}
                      width="64"
                      data-ai-hint="student portrait"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/students/${student.id}`} className="hover:underline">
                      {student.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.class}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{student.rollNumber}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link href={`/dashboard/students/${student.id}`}>View Details</Link></DropdownMenuItem>
                        {role === 'admin' && <DropdownMenuItem onClick={() => handleEditOpen(student)}>Edit</DropdownMenuItem>}
                        {role === 'admin' && <DropdownMenuItem>Delete</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {editingStudent && (
        <StudentEditDialog
          student={editingStudent}
          isOpen={!!editingStudent}
          onClose={handleEditClose}
          onSave={handleUpdateStudent}
        />
      )}
       <StudentAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddStudent}
      />
    </>
  );
}
