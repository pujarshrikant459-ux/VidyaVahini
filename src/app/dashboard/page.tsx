import { students } from "@/lib/data";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { FinancialInsights } from "@/components/dashboard/financial-insights";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Bell, BookOpen } from "lucide-react";

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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-accent text-accent-foreground p-2 rounded-full">
                       <Bell className="h-4 w-4"/>
                    </div>
                    <div>
                       <p className="font-medium">Annual Day Function</p>
                       <p className="text-sm text-muted-foreground">The annual day will be held on December 15th. All are invited.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-accent text-accent-foreground p-2 rounded-full">
                       <BookOpen className="h-4 w-4"/>
                    </div>
                    <div>
                       <p className="font-medium">Mid-term Exams</p>
                       <p className="text-sm text-muted-foreground">Mid-term exams will commence from November 20th.</p>
                    </div>
                </div>
                 <Button variant="outline" asChild>
                    <Link href="#">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
