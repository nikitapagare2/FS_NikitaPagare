"use client";

import type { SuggestCarpoolMatchesOutput } from "@/ai/flows/suggest-carpool-matches";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, MessageCircle, Route, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Match = SuggestCarpoolMatchesOutput[0] & { pseudonym?: string, avatarUrl?: string };

type MatchCardProps = {
  match: Match;
  onSelect: (match: Match) => void;
  isSelected: boolean;
};

export default function MatchCard({ match, onSelect, isSelected }: MatchCardProps) {
  const { pseudonym, departureTime, routeSimilarityScore, timeSimilarityScore, avatarUrl } = match;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer",
        isSelected && "border-primary bg-primary/5"
      )}
      onClick={() => onSelect(match)}
    >
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={avatarUrl} data-ai-hint="person portrait" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold font-headline text-primary">
              {pseudonym || "Anonymous Rider"}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Departs at {departureTime}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-accent hover:text-accent hover:bg-accent/10">
            <MessageCircle />
          </Button>
        </div>
        <div className="space-y-2 text-sm">
           <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-primary/80"/>
              <span className="font-semibold text-foreground/80 w-20">Route Fit</span>
              <Progress value={routeSimilarityScore * 100} className="w-full" />
           </div>
           <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary/80"/>
              <span className="font-semibold text-foreground/80 w-20">Time Fit</span>
              <Progress value={timeSimilarityScore * 100} className="w-full" />
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
