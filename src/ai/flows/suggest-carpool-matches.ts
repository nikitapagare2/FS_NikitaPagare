'use server';

/**
 * @fileOverview Suggests carpool matches based on route similarity and timing.
 *
 * - suggestCarpoolMatches - A function that suggests potential carpool matches.
 * - SuggestCarpoolMatchesInput - The input type for the suggestCarpoolMatches function.
 * - SuggestCarpoolMatchesOutput - The return type for the suggestCarpoolMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCarpoolMatchesInputSchema = z.object({
  studentId: z.string().describe('The unique identifier of the student.'),
  origin: z.string().describe('The origin location of the student.'),
  destination: z.string().describe('The destination location of the student.'),
  departureTime: z.string().describe('The departure time of the student (e.g., "8:00 AM").'),
  acceptableDelay: z.number().describe('The acceptable delay in minutes for the student.'),
});
export type SuggestCarpoolMatchesInput = z.infer<typeof SuggestCarpoolMatchesInputSchema>;

const SuggestCarpoolMatchesOutputSchema = z.array(
  z.object({
    studentId: z.string().describe('The unique identifier of the potential carpool match.'),
    origin: z.string().describe('The origin location of the potential carpool match.'),
    destination: z.string().describe('The destination location of the potential carpool match.'),
    departureTime: z.string().describe('The departure time of the potential carpool match (e.g., "8:15 AM").'),
    routeSimilarityScore: z.number().describe('A score indicating how similar the routes are (0-1).'),
    timeSimilarityScore: z.number().describe('A score indicating how similar the departure times are (0-1).'),
    // You can add more fields here, such as contact info (pseudonym).
  })
);
export type SuggestCarpoolMatchesOutput = z.infer<typeof SuggestCarpoolMatchesOutputSchema>;

export async function suggestCarpoolMatches(input: SuggestCarpoolMatchesInput): Promise<SuggestCarpoolMatchesOutput> {
  return suggestCarpoolMatchesFlow(input);
}

const suggestCarpoolMatchesPrompt = ai.definePrompt({
  name: 'suggestCarpoolMatchesPrompt',
  input: {schema: SuggestCarpoolMatchesInputSchema},
  output: {schema: SuggestCarpoolMatchesOutputSchema},
  prompt: `You are a carpool matching expert. Given a student's origin, destination, and departure time, you will identify potential carpool matches from a database of students.

  Analyze the route similarity and timing compatibility to suggest the best matches.

  Consider students with similar routes and departure times within the acceptable delay.

  Student ID: {{{studentId}}}
  Origin: {{{origin}}}
  Destination: {{{destination}}}
  Departure Time: {{{departureTime}}}
  Acceptable Delay: {{{acceptableDelay}}} minutes

  Return a JSON array of potential carpool matches, including their student ID, origin, destination, departure time, route similarity score (0-1), and time similarity score (0-1).
  `,
});

const suggestCarpoolMatchesFlow = ai.defineFlow(
  {
    name: 'suggestCarpoolMatchesFlow',
    inputSchema: SuggestCarpoolMatchesInputSchema,
    outputSchema: SuggestCarpoolMatchesOutputSchema,
  },
  async input => {
    const {output} = await suggestCarpoolMatchesPrompt(input);
    return output!;
  }
);
