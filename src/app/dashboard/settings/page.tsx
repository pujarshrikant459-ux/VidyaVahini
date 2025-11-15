"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/use-site-content";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";

const aboutSchema = z.object({
  about: z.string().min(20, "About text must be at least 20 characters."),
});

export default function SettingsPage() {
  const { role } = useUserRole();
  const { aboutContent, setAboutContent } = useSiteContent();
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      about: aboutContent,
    },
  });

  const onAboutSubmit = (data: { about: string }) => {
    setAboutContent(data.about);
    toast({
      title: "Success!",
      description: "The About Us section has been updated.",
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Parent Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="parent@example.com" />
          </div>
           <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Edit the "About Us" section on the homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onAboutSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about">About Section Content</Label>
                <Controller
                  name="about"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="about"
                      rows={5}
                      {...field}
                    />
                  )}
                />
                {errors.about && <p className="text-sm font-medium text-destructive">{errors.about.message}</p>}
              </div>
              <Button type="submit">Save About Section</Button>
            </form>
          </CardContent>
        </Card>
      )}

       <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive critical alerts via SMS.</p>
                </div>
                <Switch />
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language.</CardDescription>
        </CardHeader>
        <CardContent>
           <Select defaultValue="english">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
              </SelectContent>
            </Select>
        </CardContent>
      </Card>
    </div>
  );
}
