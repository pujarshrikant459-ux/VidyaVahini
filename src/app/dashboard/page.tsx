import { students, announcements } from "@/lib/data";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { FinancialInsights } from "@/components/dashboard/financial-insights";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <OverviewCards students={students} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
           <FinancialInsights />
        </div>
        <div className="lg:col-span-3 space-y-4">
           <Card>
              <CardHeader>
                 <CardTitle>Recent Announcements</CardTitle>
                 <CardDescription>Latest news and updates from the school.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.slice(0, 2).map((announcement) => (
                  <div key={announcement.id} className="flex items-start gap-4">
                      <div className="bg-accent text-accent-foreground p-2 rounded-full mt-1">
                         <Bell className="h-4 w-4"/>
                      </div>
                      <div>
                         <p className="font-medium">{announcement.title}</p>
                         <p className="text-sm text-muted-foreground">{announcement.content}</p>
                         <p className="text-xs text-muted-foreground mt-1">{format(new Date(announcement.date), "PPP")}</p>
                      </div>
                  </div>
                ))}
                 <Button variant="outline" asChild>
                    <Link href="/dashboard/announcements">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
