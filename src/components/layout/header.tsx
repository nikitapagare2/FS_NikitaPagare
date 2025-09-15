"use client";

import { useEffect, useState } from "react";
import { Car, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateCurrentUserPseudonym } from "@/lib/user";

export default function Header() {
  const [pseudonym, setPseudonym] = useState<string | null>(null);

  useEffect(() => {
    // Generate pseudonym on the client-side to avoid hydration mismatch
    setPseudonym(generateCurrentUserPseudonym());
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <Car className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-headline font-semibold text-primary">
          StudentRideShare
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/currentUser/100/100" alt="User avatar" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="text-right">
          {pseudonym ? (
            <p className="font-semibold text-sm text-foreground">{pseudonym}</p>
          ) : (
            <div className="h-5 w-28 bg-muted rounded animate-pulse" />
          )}
          <p className="text-xs text-muted-foreground">Student</p>
        </div>
      </div>
    </header>
  );
}
