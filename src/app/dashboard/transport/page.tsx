"use client";

import { useState } from "react";
import Image from "next/image";
import { transport as initialTransport } from "@/lib/data";
import type { Transport } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, MapPin, Clock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DriverEditDialog } from "@/components/dashboard/driver-edit-dialog";
import { useUserRole } from "@/hooks/use-user-role";

export default function TransportPage() {
  const [transportData, setTransportData] = useState<Transport[]>(initialTransport);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null);
  const { toast } = useToast();
  const { role } = useUserRole();

  const handleEditOpen = (transport: Transport) => {
    setEditingTransport(transport);
  };

  const handleEditClose = () => {
    setEditingTransport(null);
  };

  const handleSave = (updatedTransport: Transport) => {
    setTransportData(prev => prev.map(t => t.id === updatedTransport.id ? updatedTransport : t));
    toast({
      title: "Driver Updated",
      description: `Details for ${updatedTransport.driver.name} have been updated.`,
    });
    handleEditClose();
  };

  return (
    <>
      <div className="space-y-6">
        {transportData.map((bus) => (
          <Card key={bus.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bus Route: {bus.route}</CardTitle>
                <p className="text-muted-foreground">Bus Number: {bus.busNumber}</p>
              </div>
              {role === 'admin' && (
                <Button variant="outline" size="sm" onClick={() => handleEditOpen(bus)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Driver
                </Button>
              )}
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg">
                <Image
                  src={bus.driver.photo}
                  alt={bus.driver.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover aspect-square mb-4 border-2 border-primary"
                  data-ai-hint="driver portrait"
                />
                <h3 className="font-semibold text-lg">{bus.driver.name}</h3>
                <p className="text-muted-foreground">Driver</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{bus.driver.mobile}</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Stops & Timings</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><MapPin className="inline-block mr-1 h-4 w-4"/>Stop</TableHead>
                      <TableHead><Clock className="inline-block mr-1 h-4 w-4"/>Pickup</TableHead>
                      <TableHead><Clock className="inline-block mr-1 h-4 w-4"/>Drop</TabelHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bus.stops.map((stop, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{stop.stop}</TableCell>
                        <TableCell>{stop.pickupTime}</TableCell>
                        <TableCell>{stop.dropTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {editingTransport && (
        <DriverEditDialog
          transport={editingTransport}
          isOpen={!!editingTransport}
          onClose={handleEditClose}
          onSave={handleSave}
        />
      )}
    </>
  );
}
