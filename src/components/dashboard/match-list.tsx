"use client";

import type { SuggestCarpoolMatchesOutput } from "@/ai/flows/suggest-carpool-matches";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import MatchCard from "./match-card";
import { Users } from "lucide-react";

type Match = SuggestCarpoolMatchesOutput[0] & { pseudonym?: string, avatarUrl?: string };

type MatchListProps = {
  matches: Match[];
  isLoading: boolean;
  onSelectMatch: (match: Match) => void;
  selectedMatchId?: string;
};

export default function MatchList({
  matches,
  isLoading,
  onSelectMatch,
  selectedMatchId,
}: MatchListProps) {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Potential Matches</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 pt-0 space-y-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            {!isLoading && matches.length === 0 && (
              <div className="text-center text-muted-foreground py-10 px-4">
                <Users className="mx-auto h-12 w-12" />
                <p className="mt-4 text-sm">
                  Enter your route details to find students traveling nearby.
                </p>
              </div>
            )}
            {!isLoading &&
              matches.map((match) => (
                <MatchCard
                  key={match.studentId}
                  match={match}
                  onSelect={onSelectMatch}
                  isSelected={match.studentId === selectedMatchId}
                />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
