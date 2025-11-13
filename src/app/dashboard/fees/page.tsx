"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { students } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeeManagementAdmin } from "@/components/dashboard/fee-management-admin";
import { IndianRupee } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";


export default function FeesPage() {
  const { role } = useUserRole();
  const parentStudent = students[0];

  return (
    <Tabs defaultValue={role === 'admin' ? 'admin-view' : 'parent-view'} className="w-full">
      <TabsList className={cn("grid w-full", role === 'admin' ? 'grid-cols-2' : 'grid-cols-1')}>
        <TabsTrigger value="parent-view">My Child's Fees</TabsTrigger>
        {role === 'admin' && <TabsTrigger value="admin-view">Manage Fees (Admin)</TabsTrigger>}
      </TabsList>
      <TabsContent value="parent-view">
        <Card>
          <CardHeader>
            <CardTitle>Fee Details for {parentStudent.name}</CardTitle>
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
                {parentStudent.fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{fee.type}</TableCell>
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
                    <TableCell>
                      {fee.status !== 'paid' ? (
                        <Button size="sm">Pay Now</Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>Paid</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                 {parentStudent.fees.length === 0 && (
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
      {role === 'admin' && (
        <TabsContent value="admin-view">
            <Card>
            <CardHeader>
                <CardTitle>Fee Management</CardTitle>
                <CardDescription>Oversee and manage all student fee records.</CardDescription>
            </CardHeader>
            <CardContent>
                <FeeManagementAdmin students={students} />
            </CardContent>
            </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
