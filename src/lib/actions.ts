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
