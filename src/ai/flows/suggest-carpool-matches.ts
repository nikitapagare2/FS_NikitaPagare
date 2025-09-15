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
import {getCoordinates} from '@/lib/google-maps';

// Mock student database
const mockStudentDatabase = [
  {
    studentId: 'student-A',
    origin: 'Borivali Station',
    destination: 'Atharva University',
    departureTime: '13:45',
  },
  {
    studentId: 'student-B',
    origin: 'Kandivali Station',
    destination: 'Atharva University',
    departureTime: '14:10',
  },
  {
    studentId: 'student-C',
    origin: 'Goregaon Station',
    destination: 'Malad Station',
    departureTime: '14:05',
  },
  {
    studentId: 'student-D',
    origin: 'Andheri Station',
    destination: 'Atharva University',
    departureTime: '13:30',
  },
  {
    studentId: 'student-E',
    origin: 'Malad East',
    destination: 'Atharva University',
    departureTime: '14:15',
  },
];

const getCoordinatesTool = ai.defineTool(
  {
    name: 'getCoordinates',
    description: 'Get the latitude and longitude for a given address.',
    inputSchema: z.object({address: z.string()}),
    outputSchema: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  },
  async ({address}) => {
    return getCoordinates(address);
  }
);


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
  })
);
export type SuggestCarpoolMatchesOutput = z.infer<typeof SuggestCarpoolMatchesOutputSchema>;

export async function suggestCarpoolMatches(input: SuggestCarpoolMatchesInput): Promise<SuggestCarpoolMatchesOutput> {
  return suggestCarpoolMatchesFlow(input);
}

const suggestCarpoolMatchesPrompt = ai.definePrompt({
  name: 'suggestCarpoolMatchesPrompt',
  input: {
    schema: SuggestCarpoolMatchesInputSchema.extend({
      potentialMatches: z.array(
        z.object({
          studentId: z.string(),
          origin: z.string(),
          destination: z.string(),
          departureTime: z.string(),
        })
      ),
    }),
  },
  output: {schema: SuggestCarpoolMatchesOutputSchema},
  tools: [getCoordinatesTool],
  prompt: `You are a carpool matching expert. Given a student's origin, destination, and departure time, you will identify potential carpool matches from a database of students.

  Use the getCoordinates tool to convert addresses into latitude and longitude to accurately assess route similarity.
  Analyze the route similarity and timing compatibility to suggest the best matches.

  Consider students with similar routes and departure times within the acceptable delay.

  Current Student Request:
  - Student ID: {{{studentId}}}
  - Origin: {{{origin}}}
  - Destination: {{{destination}}}
  - Departure Time: {{{departureTime}}}
  - Acceptable Delay: {{{acceptableDelay}}} minutes

  Potential Matches from Database:
  {{#each potentialMatches}}
  - Student ID: {{this.studentId}}
    - Origin: {{this.origin}}
    - Destination: {{this.destination}}
    - Departure Time: {{this.departureTime}}
  {{/each}}

  Return a JSON array of the top 3 potential carpool matches, including their student ID, origin, destination, departure time, route similarity score (0-1), and time similarity score (0-1).
  `,
});

const suggestCarpoolMatchesFlow = ai.defineFlow(
  {
    name: 'suggestCarpoolMatchesFlow',
    inputSchema: SuggestCarpoolMatchesInputSchema,
    outputSchema: SuggestCarpoolMatchesOutputSchema,
  },
  async input => {
    // In a real app, you would fetch this from a database.
    const potentialMatches = mockStudentDatabase.filter(
      (student) => student.studentId !== input.studentId
    );
    
    const {output} = await suggestCarpoolMatchesPrompt({
      ...input,
      potentialMatches,
    });
    return output!;
  }
);
