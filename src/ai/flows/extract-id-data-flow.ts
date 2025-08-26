'use server';
/**
 * @fileOverview An AI flow to extract structured data from an ID card image or PDF.
 *
 * - extractIdData - A function that handles the ID card data extraction process.
 * - ExtractIdDataInput - The input type for the extractIdData function.
 * - ExtractIdDataOutput - The return type for the extractIdData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExtractIdDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an ID card or a PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractIdDataInput = z.infer<typeof ExtractIdDataInputSchema>;

const ExtractIdDataOutputSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  fatherName: z.string().describe("The father's full name."),
  motherName: z.string().describe("The mother's full name."),
  dob: z.string().describe("The date of birth in YYYY-MM-DD format."),
  nidNumber: z.string().describe("The National ID number."),
  address: z.string().describe("The full address, combining all parts of the address fields (present, permanent, etc.) into a single comprehensive string."),
});
export type ExtractIdDataOutput = z.infer<typeof ExtractIdDataOutputSchema>;

export async function extractIdData(input: ExtractIdDataInput): Promise<ExtractIdDataOutput> {
  return extractIdDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractIdDataPrompt',
  input: {schema: ExtractIdDataInputSchema},
  output: {schema: ExtractIdDataOutputSchema},
  prompt: `You are an expert at extracting information from National ID cards, especially from Bangladesh.
  
You will be provided with an image or a PDF of an ID card or a server copy of one. Your task is to extract the following fields and return them in a structured JSON format:
- Name (extract the English name if available)
- Father's Name
- Mother's Name
- Date of Birth (must be in YYYY-MM-DD format)
- NID Number
- Address (Combine all available address parts like 'Present Address' and 'Permanent Address' into one single string. Clean it up for readability.)

Analyze the provided document carefully to find all the required information.

Document: {{media url=photoDataUri}}`,
});

const extractIdDataFlow = ai.defineFlow(
  {
    name: 'extractIdDataFlow',
    inputSchema: ExtractIdDataInputSchema,
    outputSchema: ExtractIdDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
