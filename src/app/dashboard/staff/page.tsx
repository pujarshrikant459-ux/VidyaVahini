import Image from "next/image";
import { teachers } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function StaffPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {teachers.map((staff) => (
        <Card key={staff.id} className="text-center overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="bg-secondary/50 p-4">
             <Image
              src={staff.photo}
              alt={staff.name}
              width={100}
              height={100}
              className="rounded-full object-cover aspect-square mx-auto border-4 border-background"
              data-ai-hint="professional portrait"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold text-lg font-headline">{staff.name}</h3>
            <p className="text-primary">{staff.role}</p>
            {staff.subject && <p className="text-sm text-muted-foreground">{staff.subject}</p>}
            <div className="mt-4 flex justify-center gap-4 text-muted-foreground">
                <a href={`tel:${staff.contact}`} className="hover:text-primary"><Phone className="h-5 w-5" /></a>
                <a href={`mailto:${staff.name.replace(/\s+/g, '.').toLowerCase()}@school.ac.in`} className="hover:text-primary"><Mail className="h-5 w-5" /></a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
