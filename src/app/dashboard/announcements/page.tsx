
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import type { Announcement } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Trash2 } from "lucide-react";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useLocalization } from "@/hooks/use-localization";

const FormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
});

type FormData = z.infer<typeof FormSchema>;

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { toast } = useToast();
  const { role } = useUserRole();
  const { t } = useLocalization();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    addAnnouncement(data.title, data.content);
    toast({
      title: "Announcement Posted",
      description: "The new announcement has been published.",
    });
    form.reset();
  };
  
  const handleDelete = (id: string) => {
    deleteAnnouncement(id);
    toast({
        title: "Announcement Deleted",
        description: "The announcement has been removed.",
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {role === "admin" && (
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('newAnnouncement')}</CardTitle>
              <CardDescription>{t('createAndPublishNewAnnouncement')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('title')}</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., School Holiday" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('content')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the announcement..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('postAnnouncement')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className={role === "admin" ? "md:col-span-2" : "md:col-span-3"}>
        <Card>
          <CardHeader>
            <CardTitle>{t('allAnnouncements')}</CardTitle>
            <CardDescription>{t('viewAllAnnouncements')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg relative">
                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('postedOn')} {format(new Date(announcement.date), "PPP")}
                </p>
                <p>{announcement.content}</p>
                {role === 'admin' && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleDelete(announcement.id)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                    </Button>
                )}
              </div>
            ))}
            {announcements.length === 0 && (
                <p className="text-center text-muted-foreground py-8">{t('noAnnouncementsYet')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
