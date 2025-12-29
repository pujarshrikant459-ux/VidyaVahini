"use client";

import { useState } from "react";
import Image from "next/image";
import { teachers as initialTeachers } from "@/lib/data";
import type { Teacher } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, PlusCircle, BookUser } from "lucide-react";
import { StaffAddDialog } from "@/components/dashboard/staff-add-dialog";
import { useUserRole } from "@/hooks/use-user-role";
import { Badge } from "@/components/ui/badge";

export default function StaffPage() {
  const [staff, setStaff] = useState<Teacher[]>(initialTeachers);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { role } = useUserRole();

  const handleAddStaff = (newStaffData: Omit<Teacher, 'id' | 'photo'>) => {
    const newStaff: Teacher = {
      ...newStaffData,
      id: `staff-${Date.now()}`,
      photo: `https://picsum.photos/seed/${Date.now()}/100/100`,
    };
    setStaff(prev => [newStaff, ...prev]);
    toast({
      title: "Staff Added",
      description: `${newStaff.name} has been added to the records.`,
    });
    setAddDialogOpen(false);
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
              <Card key={member.id} className="text-center overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-secondary/50 p-4">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={100}
                    height={100}
                    className="rounded-full object-cover aspect-square mx-auto border-4 border-background"
                    data-ai-hint="professional portrait"
                  />
                </div>
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-bold text-lg font-headline">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                  {member.subject && <p className="text-sm text-muted-foreground">{member.subject}</p>}
                  {member.classAssigned && <Badge variant="outline"><BookUser className="mr-1.5 h-3 w-3" />{member.classAssigned}</Badge>}
                  <div className="pt-2 flex justify-center gap-4 text-muted-foreground">
                      <a href={`tel:${member.contact}`} className="hover:text-primary"><Phone className="h-5 w-5" /></a>
                      <a href={`mailto:${member.name.replace(/\s+/g, '.').toLowerCase()}@school.ac.in`} className="hover:text-primary"><Mail className="h-5 w-5" /></a>
                  </div>
                </CardContent>
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
    </>
  );
}
