"use server";

import {
  suggestCarpoolMatches,
  type SuggestCarpoolMatchesInput,
} from "@/ai/flows/suggest-carpool-matches";
import { z } from "zod";
import { generatePseudonym } from "./user";

const formSchema = z.object({
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
  departureTime: z.string().min(1, "Departure time is required."),
  acceptableDelay: z.coerce.number().min(0),
});

// PSEUDOCODE for getMatches server action:
// 1. RECEIVE DATA:
//    - The function is called from the client with the user's route details.
//
// 2. VALIDATE INPUT:
//    - Ensure the received data matches the expected schema.
//
// 3. PREPARE AI INPUT:
//    - Create a temporary, unique `studentId` for the current user's request.
//    - Combine the `studentId` with the validated form data to create an input object for the AI flow.
//
// 4. CALL AI FLOW:
//    - `await suggestCarpoolMatches(input)`: Call the Genkit flow to get potential carpool matches from the AI model.
//
// 5. PROCESS AI RESPONSE:
//    - The AI returns a list of matches.
//    - Iterate through each match and enhance it with user-friendly data:
//      - Generate a unique, anonymous `pseudonym` (e.g., "SwiftPuma42").
//      - Generate a unique `avatarUrl` for variety in the UI.
//
// 6. RETURN RESULT:
//    - Return the final, processed list of matches back to the client.
export async function getMatches(data: z.infer<typeof formSchema>) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    // This should ideally not happen with client-side validation
    // but serves as a backend safeguard.
    console.error("Invalid form data", validation.error);
    return null;
  }

  // Generate a dummy studentId for this session
  const studentId = `student-${Math.random().toString(36).substring(2, 9)}`;

  const input: SuggestCarpoolMatchesInput = {
    studentId,
    ...validation.data,
  };

  try {
    const matches = await suggestCarpoolMatches(input);
    
    // The AI doesn't know about pseudonyms, so we add them here.
    // We also simulate a unique avatar for each match.
    return matches.map((match, index) => ({
      ...match,
      pseudonym: generatePseudonym(match.studentId),
      avatarUrl: `https://picsum.photos/seed/${match.studentId}/100/100`,
    }));

  } catch (error) {
    console.error("Error calling suggestCarpoolMatches flow:", error);
    // In a real app, you would have more robust error handling and logging.
    return [];
  }
}
