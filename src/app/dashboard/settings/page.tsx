
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth, useFirestore, useUser, setDocumentNonBlocking } from "@/firebase";
import { useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { doc } from "firebase/firestore";

const aboutSchema = z.object({
  about: z.string().min(20, "About text must be at least 20 characters."),
});

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
});

export default function SettingsPage() {
  const { role } = useUserRole();
  const { aboutContent, setAboutContent } = useSiteContent();
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const aboutForm = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      about: aboutContent,
    },
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      email: "",
    },
  });

  useEffect(() => {
    if(user) {
      profileForm.reset({
        displayName: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, profileForm]);

  const onAboutSubmit = (data: { about: string }) => {
    setAboutContent(data.about);
    toast({
      title: "Success!",
      description: "The About Us section has been updated.",
    });
  };

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user || !auth.currentUser) {
      toast({ variant: "destructive", title: "Not logged in", description: "You must be logged in to update your profile." });
      return;
    }

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
      });

      // Update Firestore profile document
      const parentDocRef = doc(firestore, 'parents', user.uid);
      setDocumentNonBlocking(parentDocRef, { 
        displayName: data.displayName 
      }, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile.",
      });
    }
  };


  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Edit the "About Us" section on the homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...aboutForm}>
              <form onSubmit={aboutForm.handleSubmit(onAboutSubmit)} className="space-y-4">
                <FormField
                  control={aboutForm.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Section Content</FormLabel>
                      <FormControl>
                        <Textarea id="about" rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save About Section</Button>
              </form>
            </Form>
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
