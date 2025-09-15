"use client";

import { useState } from "react";
import type { SuggestCarpoolMatchesOutput } from "@/ai/flows/suggest-carpool-matches";
import Header from "@/components/layout/header";
import RouteForm from "@/components/dashboard/route-form";
import MatchList from "@/components/dashboard/match-list";
import MapView from "@/components/dashboard/map-view";
import ChatView from "@/components/dashboard/chat-view";
import { getMatches } from "@/lib/actions";

type Match = SuggestCarpoolMatchesOutput[0];
type UserRoute = { origin: string; destination: string };

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRoute, setUserRoute] = useState<UserRoute | null>(null);

  const handleFindMatches = async (data: any) => {
    setIsLoading(true);
    setMatches([]);
    setUserRoute({ origin: data.origin, destination: data.destination });
    setSelectedMatch(null);

    const result = await getMatches(data);
    
    if (result) {
      setMatches(result);
    }
    
    setIsLoading(false);
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleCloseChat = () => {
    setSelectedMatch(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 overflow-hidden">
        <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col gap-4">
          <RouteForm onSubmit={handleFindMatches} isLoading={isLoading} />
          <MatchList
            matches={matches}
            isLoading={isLoading}
            onSelectMatch={handleSelectMatch}
            selectedMatchId={selectedMatch?.studentId}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 rounded-lg shadow-inner bg-card/50 h-full">
          {selectedMatch ? (
            <ChatView match={selectedMatch} onClose={handleCloseChat} />
          ) : (
            <MapView userRoute={userRoute} matches={matches} />
          )}
        </div>
      </main>
    </div>
  );
}
