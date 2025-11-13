"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  getFeeInsightsAndSuggestions,
  type FeeInsightsAndSuggestionsOutput,
} from '@/ai/flows/fee-insights-and-suggestions';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  currentFeeStructure: z.string().min(10, { message: 'Please provide more details.' }),
  studentCount: z.coerce.number().positive(),
  location: z.string().min(2, { message: 'Location is required.' }),
  schoolType: z.string().min(2, { message: 'School type is required.' }),
  otherRelevantInfo: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export function FinancialInsights() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FeeInsightsAndSuggestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentFeeStructure: '',
      studentCount: 1000,
      location: 'Bengaluru, Karnataka',
      schoolType: 'Government School',
      otherRelevantInfo: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async data => {
    setLoading(true);
    setResult(null);
    try {
      const insights = await getFeeInsightsAndSuggestions(data);
      setResult(insights);
    } catch (error) {
      console.error('Error getting financial insights:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate financial insights. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-accent" />
          AI Financial Insights
        </CardTitle>
        <CardDescription>
          Get AI-powered insights and suggestions to optimize your school's fee structure.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Students</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bengaluru, Karnataka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="schoolType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Government School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentFeeStructure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Fee Structure</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your current fee structure in detail. e.g., Tuition: 5000/quarter, Sports: 1500/year..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="otherRelevantInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Relevant Info (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other details? e.g., upcoming infrastructure projects, recent grants..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {result && (
              <div className="space-y-4 pt-4">
                 <div className="p-4 bg-secondary/50 rounded-lg border">
                    <h4 className="font-semibold mb-2">Insights</h4>
                    <p className="text-sm text-muted-foreground">{result.insights}</p>
                 </div>
                 <div className="p-4 bg-secondary/50 rounded-lg border">
                    <h4 className="font-semibold mb-2">Suggestions</h4>
                    <p className="text-sm text-muted-foreground">{result.suggestions}</p>
                 </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Get Insights'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
