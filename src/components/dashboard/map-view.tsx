"use client";

import type { SuggestCarpoolMatchesOutput } from "@/ai/flows/suggest-carpool-matches";
import { Card, CardContent } from "@/components/ui/card";
import { Map, MapPin, Route } from "lucide-react";

type Match = SuggestCarpoolMatchesOutput[0];
type UserRoute = { origin: string; destination: string } | null;

type MapViewProps = {
  userRoute: UserRoute;
  matches: Match[];
};

const hashCode = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return Math.abs(h);
}

const getPosition = (id: string) => {
    const hash = hashCode(id);
    const top = (hash % 70) + 15; // 15% to 85%
    const left = (hash % 80) + 10; // 10% to 90%
    return { top: `${top}%`, left: `${left}%` };
}

export default function MapView({ userRoute, matches }: MapViewProps) {
  if (!userRoute) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-card rounded-lg p-8 text-center">
        <Map className="h-24 w-24 mb-4 text-primary/20" strokeWidth={1} />
        <h2 className="text-xl font-headline text-foreground">Your Commute Map</h2>
        <p className="mt-2 max-w-md">
          Once you enter your route, this map will visualize your commute and show potential ride-sharing matches along the way.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4">
        <Card className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0"/>
                <p className="text-sm font-medium text-foreground/80">From: <span className="font-semibold text-foreground">{userRoute.origin}</span></p>
                <Route className="h-6 w-6 text-primary/50 mx-4"/>
                <MapPin className="h-5 w-5 text-primary flex-shrink-0"/>
                <p className="text-sm font-medium text-foreground/80">To: <span className="font-semibold text-foreground">{userRoute.destination}</span></p>
            </CardContent>
        </Card>
        <div className="flex-1 bg-muted/50 rounded-lg relative overflow-hidden border-2 border-dashed border-primary/10">
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Simulated route line */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                    <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="10 10" />
                </svg>
            </div>
            
            {/* User pins */}
            <div className="absolute top-1/2 left-[10%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <MapPin className="h-8 w-8 text-accent fill-accent/50"/>
                <span className="text-xs font-bold bg-accent text-accent-foreground rounded-full px-2 py-0.5">You</span>
            </div>
            <div className="absolute top-1/2 left-[90%] -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-8 w-8 text-primary fill-primary/50"/>
            </div>

            {/* Match pins */}
            {matches.map(match => {
                const position = getPosition(match.studentId);
                return (
                    <div key={match.studentId} className="absolute" style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}>
                        <div className="flex flex-col items-center group cursor-pointer animate-in fade-in zoom-in duration-500">
                             <MapPin className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors"/>
                             <span className="text-xs font-semibold bg-card rounded-full px-2 py-0.5 shadow-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                               Match
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  );
}
