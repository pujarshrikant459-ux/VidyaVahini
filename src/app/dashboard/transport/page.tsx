
"use client";

import { useState } from "react";
import Image from "next/image";
import { transport as initialTransport } from "@/lib/data";
import type { Transport, TransportStop } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, MapPin, Clock, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/use-user-role";
import { useStudents } from "@/hooks/use-students";
import { Input } from "@/components/ui/input";

export default function TransportPage() {
  const { role } = useUserRole();
  const { currentStudent } = useStudents();
  
  const transportForParent = currentStudent ? [initialTransport.find(t => t.id === 'bus-1')] : [];
  const transportDataForRole = role === 'parent' ? transportForParent.filter(Boolean) as Transport[] : initialTransport;

  const [transportData, setTransportData] = useState<Transport[]>(transportDataForRole);
  const [editingTransportId, setEditingTransportId] = useState<string | null>(null);
  const [editableTransport, setEditableTransport] = useState<Transport | null>(null);
  const { toast } = useToast();

  const handleEditStart = (transport: Transport) => {
    setEditingTransportId(transport.id);
    setEditableTransport(JSON.parse(JSON.stringify(transport))); // Deep copy for editing
  };

  const handleEditCancel = () => {
    setEditingTransportId(null);
    setEditableTransport(null);
  };

  const handleSave = () => {
    if (!editableTransport) return;
    
    setTransportData(prev => prev.map(t => t.id === editableTransport.id ? editableTransport : t));
    toast({
      title: "Transport Updated",
      description: `Details for Bus Route ${editableTransport.route} have been updated.`,
    });
    handleEditCancel();
  };
  
  const handleDriverChange = (field: 'name' | 'mobile' | 'photo', value: string) => {
    if (editableTransport) {
      setEditableTransport({
        ...editableTransport,
        driver: {
          ...editableTransport.driver,
          [field]: value
        }
      });
    }
  }

  const handleStopTimeChange = (index: number, field: keyof TransportStop, value: string) => {
      if (editableTransport) {
        const newStops = [...editableTransport.stops];
        const stopToUpdate = { ...newStops[index], [field]: value };
        newStops[index] = stopToUpdate;
        setEditableTransport({ ...editableTransport, stops: newStops });
      }
  };

  return (
    <div className="space-y-6">
      {transportData.map((bus) => {
        const isEditing = editingTransportId === bus.id && editableTransport;
        const currentBusData = isEditing ? editableTransport : bus;

        return (
          <Card key={bus.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bus Route: {bus.route}</CardTitle>
                <p className="text-muted-foreground">Bus Number: {bus.busNumber}</p>
              </div>
              {role === 'admin' && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleEditCancel}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleEditStart(bus)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 flex flex-col items-center text-center p-4 bg-secondary/50 rounded-lg">
                <Image
                  src={currentBusData.driver.photo}
                  alt={currentBusData.driver.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover aspect-square mb-4 border-2 border-primary"
                  data-ai-hint="driver portrait"
                />
                {isEditing ? (
                  <div className="space-y-2">
                     <Input 
                        value={editableTransport.driver.name} 
                        onChange={(e) => handleDriverChange('name', e.target.value)}
                        className="text-center font-semibold text-lg"
                      />
                      <div className="relative">
                         <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                         <Input 
                            value={editableTransport.driver.mobile} 
                            onChange={(e) => handleDriverChange('mobile', e.target.value)}
                            className="pl-8 text-center"
                          />
                      </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg">{currentBusData.driver.name}</h3>
                    <p className="text-muted-foreground">Driver</p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{currentBusData.driver.mobile}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Stops & Timings</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><MapPin className="inline-block mr-1 h-4 w-4"/>Stop</TableHead>
                      <TableHead><Clock className="inline-block mr-1 h-4 w-4"/>Pickup</TableHead>
                      <TableHead><Clock className="inline-block mr-1 h-4 w-4"/>Drop</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBusData.stops.map((stop, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{stop.stop}</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input value={stop.pickupTime} onChange={(e) => handleStopTimeChange(index, 'pickupTime', e.target.value)} className="h-8"/>
                          ) : (
                            stop.pickupTime
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input value={stop.dropTime} onChange={(e) => handleStopTimeChange(index, 'dropTime', e.target.value)} className="h-8"/>
                          ) : (
                            stop.dropTime
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )
      })}
       {transportData.length === 0 && role === 'parent' && (
          <Card>
              <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Your child is not currently enrolled in school transport.</p>
              </CardContent>
          </Card>
       )}
    </div>
  );
}
