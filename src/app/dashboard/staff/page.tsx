
"use client";

import { useState } from "react";
import { teachers as initialTeachers } from "@/lib/data";
import type { Teacher } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, PlusCircle, BookUser, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StaffAddDialog } from "@/components/dashboard/staff-add-dialog";
import { useUserRole } from "@/hooks/use-user-role";
import { Badge } from "@/components/ui/badge";

export default function StaffPage() {
  const [staff, setStaff] = useState<Teacher[]>(initialTeachers);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<Teacher | null>(null);
  const { toast } = useToast();
  const { role } = useUserRole();

  const handleAddStaff = (newStaffData: Omit<Teacher, 'id' | 'photo'>) => {
    const newStaff: Teacher = {
      ...newStaffData,
      id: `staff-${Date.now()}`,
    };
    setStaff(prev => [newStaff, ...prev]);
    toast({
      title: "Staff Added",
      description: `${newStaff.name} has been added to the records.`,
    });
    setAddDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (deletingStaff) {
      setStaff(prev => prev.filter(s => s.id !== deletingStaff.id));
      toast({
        title: "Staff Deleted",
        description: `${deletingStaff.name} has been removed from the records.`,
      });
      setDeletingStaff(null);
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Staff</CardTitle>
            <CardDescription>Manage all staff records in the school.</CardDescription>
          </div>
          {role === 'admin' && (
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {staff.map((member) => (
              <Card key={member.id} className="text-center overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group">
                <CardContent className="p-4 pt-6 space-y-1">
                  <h3 className="font-bold text-lg font-headline">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                  {member.subject && <p className="text-sm text-muted-foreground">{member.subject}</p>}
                  {member.classAssigned && <Badge variant="outline"><BookUser className="mr-1.5 h-3 w-3" />{member.classAssigned}</Badge>}
                  <div className="pt-2 flex justify-center gap-4 text-muted-foreground">
                      <a href={`tel:${member.contact}`} className="hover:text-primary"><Phone className="h-5 w-5" /></a>
                      <a href={`mailto:${member.name.replace(/\s+/g, '.').toLowerCase()}@school.ac.in`} className="hover:text-primary"><Mail className="h-5 w-5" /></a>
                  </div>
                </CardContent>
                 {role === 'admin' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setDeletingStaff(member)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Staff</span>
                    </Button>
                 )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
       <StaffAddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddStaff}
      />
       {deletingStaff && (
        <AlertDialog open={!!deletingStaff} onOpenChange={() => setDeletingStaff(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the staff record for <span className="font-semibold">{deletingStaff.name}</span>.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
