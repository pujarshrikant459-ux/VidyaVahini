'use server';

/**
 * @fileOverview Fee description generation flow using AI.
 *
 * - generateFeeDescription - A function that generates fee descriptions.
 * - GenerateFeeDescriptionInput - The input type for the generateFeeDescription function.
 * - GenerateFeeDescriptionOutput - The return type for the generateFeeDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFeeDescriptionInputSchema = z.object({
  feeType: z.string().describe('The type of fee (e.g., tuition, library, sports).'),
  classLevel: z.string().describe('The class level for which the fee applies (e.g., 1st, 2nd, ..., 10th).'),
  amount: z.number().describe('The amount of the fee.'),
});
export type GenerateFeeDescriptionInput = z.infer<
  typeof GenerateFeeDescriptionInputSchema
>;

const GenerateFeeDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('The AI-generated description of the fee.'),
});
export type GenerateFeeDescriptionOutput = z.infer<
  typeof GenerateFeeDescriptionOutputSchema
>;

export async function generateFeeDescription(
  input: GenerateFeeDescriptionInput
): Promise<GenerateFeeDescriptionOutput> {
  return generateFeeDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeeDescriptionPrompt',
  input: {schema: GenerateFeeDescriptionInputSchema},
  output: {schema: GenerateFeeDescriptionOutputSchema},
  prompt: `You are an expert in school fee management. Generate a concise and informative description for the following fee, intended for parents. Be professional and clear.

Fee Type: {{feeType}}
Class Level: {{classLevel}}
Amount: {{amount}}

Description:`,
});

const generateFeeDescriptionFlow = ai.defineFlow(
  {
    name: 'generateFeeDescriptionFlow',
    inputSchema: GenerateFeeDescriptionInputSchema,
    outputSchema: GenerateFeeDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
