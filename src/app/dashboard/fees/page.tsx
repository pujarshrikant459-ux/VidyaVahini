
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeeManagementAdmin } from "@/components/dashboard/fee-management-admin";
import { IndianRupee } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useStudents } from "@/hooks/use-students";
import { useToast } from "@/hooks/use-toast";
import { feeStructure } from "@/lib/data";


export default function FeesPage() {
  const { role } = useUserRole();
  const { students, currentStudent, payFee } = useStudents();
  const { toast } = useToast();
  const parentStudent = currentStudent;

  
  const handlePayFee = (studentId: string, feeId: string, feeType: string) => {
    payFee(studentId, feeId);
    toast({
      title: "Payment Successful",
      description: `The ${feeType} has been paid.`,
    });
  };
  
  const statusBadge = (status: 'paid' | 'pending' | 'overdue' | 'approved') => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'approved':
        return <Badge variant="secondary">Ready to Pay</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending Approval</Badge>;
    }
  };

  return (
    <Tabs defaultValue="parent-view" className="w-full">
      <TabsList className={cn("grid w-full", role === 'admin' ? 'grid-cols-3' : 'grid-cols-2')}>
        <TabsTrigger value="parent-view">My Child's Fees</TabsTrigger>
        <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
        {role === 'admin' && <TabsTrigger value="admin-view">Manage Fees (Admin)</TabsTrigger>}
      </TabsList>
      <TabsContent value="parent-view">
        <Card>
          <CardHeader>
            <CardTitle>Fee Details for {parentStudent?.name}</CardTitle>
            <CardDescription>View upcoming payments and your payment history.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parentStudent?.fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{fee.type}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />{fee.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>{fee.dueDate}</TableCell>
                    <TableCell>
                      {statusBadge(fee.status)}
                    </TableCell>
                    <TableCell>
                      {fee.status === 'approved' || fee.status === 'overdue' ? (
                        <Button size="sm" onClick={() => handlePayFee(parentStudent.id, fee.id, fee.type)}>Pay Now</Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>{fee.status === 'paid' ? 'Paid' : 'Pending'}</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                 {!parentStudent || parentStudent.fees.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                            No fee records found for your child.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="fee-structure">
        <Card>
          <CardHeader>
            <CardTitle>School Fee Structure</CardTitle>
            <CardDescription>An overview of the different types of fees applicable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeStructure.map((fee, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{fee.name}</TableCell>
                    <TableCell>{fee.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      {role === 'admin' && (
        <TabsContent value="admin-view">
            <Card>
            <CardHeader>
                <CardTitle>Fee Management</CardTitle>
                <CardDescription>Oversee and manage all student fee records.</CardDescription>
            </CardHeader>
            <CardContent>
                <FeeManagementAdmin initialStudents={students} />
            </CardContent>
            </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}

    