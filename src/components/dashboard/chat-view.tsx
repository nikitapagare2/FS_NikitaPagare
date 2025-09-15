"use client";

import type { SuggestCarpoolMatchesOutput } from "@/ai/flows/suggest-carpool-matches";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, User } from "lucide-react";
import { useState } from "react";

type Match = SuggestCarpoolMatchesOutput[0] & { pseudonym?: string, avatarUrl?: string };

type ChatViewProps = {
  match: Match;
  onClose: () => void;
};

const dummyMessages = [
  { sender: "match", text: "Hey! Looks like we're heading the same way." },
  { sender: "user", text: "Awesome! What time are you thinking of leaving?" },
  { sender: "match", text: "Around 8:00 AM works for me. Does that fit your schedule?" },
];

export default function ChatView({ match, onClose }: ChatViewProps) {
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setMessages([...messages, { sender: "user", text: newMessage.trim() }]);
    setNewMessage("");
  };

  return (
    <div className="w-full h-full flex flex-col bg-card rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center gap-4 p-3 border-b">
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <ArrowLeft />
        </Button>
        <Avatar className="h-10 w-10">
            <AvatarImage src={match.avatarUrl} data-ai-hint="person portrait" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold font-headline text-primary">{match.pseudonym}</p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hidden md:inline-flex ml-auto">
          <ArrowLeft />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "match" && <Avatar className="h-8 w-8"><AvatarImage src={match.avatarUrl} /><AvatarFallback><User/></AvatarFallback></Avatar>}
              <div
                className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.sender === "user" && <Avatar className="h-8 w-8"><AvatarImage src="https://picsum.photos/seed/currentUser/100/100" /><AvatarFallback><User/></AvatarFallback></Avatar>}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${match.pseudonym}...`}
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="bg-accent text-accent-foreground flex-shrink-0 hover:bg-accent/90">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
