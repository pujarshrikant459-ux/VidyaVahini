"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useGallery } from "@/hooks/use-gallery";
import { useToast } from "@/hooks/use-toast";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Trash2, Camera, Video, PlayCircle } from "lucide-react";

const FormSchema = z.object({
  type: z.enum(["photo", "video"]),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
  imageHint: z.string().min(2, { message: "Hint must be at least 2 characters." }),
});

type FormData = z.infer<typeof FormSchema>;

export default function GalleryManagementPage() {
  const { photos, videos, addGalleryItem, deleteGalleryItem } = useGallery();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      imageUrl: "",
      description: "",
      imageHint: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { type, ...itemData } = data;
    addGalleryItem(type, {
      ...itemData,
      id: `${type}-${Date.now()}`
    });
    toast({
      title: `${type === 'photo' ? 'Photo' : 'Video'} Added`,
      description: "The new item has been added to the gallery.",
    });
    form.reset();
  };

  const handleDelete = (type: 'photo' | 'video', id: string) => {
    deleteGalleryItem(type, id);
    toast({
        title: "Item Deleted",
        description: "The gallery item has been removed.",
    });
  }
  
  const UploadForm = ({ type }: { type: 'photo' | 'video' }) => (
    <Card>
      <CardHeader>
        <CardTitle>Add New {type === 'photo' ? 'Photo' : 'Video'}</CardTitle>
        <CardDescription>Provide the URL and description for the new gallery item.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} value={type} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image/Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Annual Sports Day 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., school sports" {...field} />
                  </FormControl>
                   <FormDescription>Two keyword hint for AI image search.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" onClick={() => form.setValue('type', type)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Gallery
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="photos" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="photos"><Camera className="mr-2"/>Manage Photos</TabsTrigger>
        <TabsTrigger value="videos"><Video className="mr-2"/>Manage Videos</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <UploadForm type="photo" />
          </div>
          <div className="md:col-span-2">
             <Card>
                <CardHeader>
                    <CardTitle>Existing Photos</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                    <div key={photo.id} className="group relative overflow-hidden rounded-lg">
                        <Image
                            src={photo.imageUrl}
                            alt={photo.description}
                            width={600}
                            height={400}
                            className="object-cover w-full h-full aspect-video"
                            data-ai-hint={photo.imageHint}
                        />
                         <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDelete('photo', photo.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                    ))}
                    {photos.length === 0 && <p className="col-span-full text-center text-muted-foreground">No photos in the gallery.</p>}
                </CardContent>
             </Card>
          </div>
        </div>
      </TabsContent>
       <TabsContent value="videos">
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
                <UploadForm type="video" />
            </div>
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Existing Videos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {videos.map((video) => (
                        <div key={video.id} className="group relative overflow-hidden rounded-lg">
                            <Image
                                src={video.imageUrl}
                                alt={video.description}
                                width={600}
                                height={400}
                                className="object-cover w-full h-full aspect-video"
                                data-ai-hint={video.imageHint}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <PlayCircle className="h-16 w-16 text-white/80" />
                            </div>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={() => handleDelete('video', video.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                        ))}
                        {videos.length === 0 && <p className="col-span-full text-center text-muted-foreground">No videos in the gallery.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
