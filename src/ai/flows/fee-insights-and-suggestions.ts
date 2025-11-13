'use server';

/**
 * @fileOverview Provides fee structure insights and suggestions using AI.
 *
 * - getFeeInsightsAndSuggestions - A function that returns insights and suggestions about the school's fee structure.
 * - FeeInsightsAndSuggestionsInput - The input type for the getFeeInsightsAndSuggestions function.
 * - FeeInsightsAndSuggestionsOutput - The return type for the getFeeInsightsAndSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FeeInsightsAndSuggestionsInputSchema = z.object({
  currentFeeStructure: z.string().describe('The current fee structure of the school, described in detail.'),
  studentCount: z.number().describe('The total number of students in the school.'),
  location: z.string().describe('The location of the school (city, state).'),
  schoolType: z.string().describe('The type of school (e.g., private, government).'),
  otherRelevantInfo: z.string().optional().describe('Any other relevant information about the school that may affect fee structuring.'),
});
export type FeeInsightsAndSuggestionsInput = z.infer<typeof FeeInsightsAndSuggestionsInputSchema>;

const FeeInsightsAndSuggestionsOutputSchema = z.object({
  insights: z.string().describe('Insights about the current fee structure compared to similar schools.'),
  suggestions: z.string().describe('Suggestions for improving the school\'s financial planning and competitiveness.'),
});
export type FeeInsightsAndSuggestionsOutput = z.infer<typeof FeeInsightsAndSuggestionsOutputSchema>;

export async function getFeeInsightsAndSuggestions(
  input: FeeInsightsAndSuggestionsInput
): Promise<FeeInsightsAndSuggestionsOutput> {
  return feeInsightsAndSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'feeInsightsAndSuggestionsPrompt',
  input: {schema: FeeInsightsAndSuggestionsInputSchema},
  output: {schema: FeeInsightsAndSuggestionsOutputSchema},
  prompt: `You are a financial advisor specializing in school fee structures.

You will analyze the school's current fee structure, student count, location, and school type to provide insights and suggestions for improvement.

Current Fee Structure: {{{currentFeeStructure}}}
Student Count: {{{studentCount}}}
Location: {{{location}}}
School Type: {{{schoolType}}}
Other Relevant Info: {{{otherRelevantInfo}}}

Provide insights about the current fee structure compared to similar schools and suggestions for improving the school\'s financial planning and competitiveness.
`,
});

const feeInsightsAndSuggestionsFlow = ai.defineFlow(
  {
    name: 'feeInsightsAndSuggestionsFlow',
    inputSchema: FeeInsightsAndSuggestionsInputSchema,
    outputSchema: FeeInsightsAndSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
