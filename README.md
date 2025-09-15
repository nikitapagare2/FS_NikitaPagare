# StudentRideShare: AI-Powered Carpooling App

## System Overview

StudentRideShare is a modern web application designed to help students find carpool matches for their daily commutes. Users can input their origin, destination, and desired departure time, and the application leverages AI to suggest relevant matches with other students. The system is designed to be intelligent, considering not just exact locations but also route overlaps and flexible timing to provide the best possible suggestions.

## Features

- **Smart Matchmaking**: Enter your route details and get AI-powered suggestions for carpool partners.
- **Flexible Matching Logic**: The AI is designed to find relevant matches even if the routes don't start and end at the exact same points, focusing on route and time similarity.
- **Real-World Geolocation**: Integrates with the Google Maps API to convert addresses into coordinates, allowing for accurate geographic-based matching.
- **Interactive Map View**: Visualize your route and the locations of potential matches on a simple, intuitive map.
- **In-App Chat**: Once a match is selected, a chat interface allows for direct communication to coordinate details.
- **Modern, Responsive UI**: Built with ShadCN UI and Tailwind CSS for a clean and responsive user experience on any device.

## System Design & Application Flow

The application follows a modern, server-centric architecture using Next.js. The frontend client communicates with backend logic via Server Actions, which then orchestrate AI-powered tasks using the Genkit framework.

```mermaid
graph TD
    subgraph " "
        direction LR
        subgraph "Frontend (Browser)"
            direction TB
            A[<div style='font-weight:bold; font-size:1.1em; margin-bottom:5px;'>User Interface</div><div style='font-size:0.9em; text-align:left; margin-left:10px;'><b style='color:#3B82F6;'>- Next.js / React</b><br/>- TypeScript<br/>- TailwindCSS</div>]
        end

        subgraph "Backend (Server)"
            direction TB
            B[<div style='font-weight:bold; font-size:1.1em; margin-bottom:5px;'>Server Logic</div><div style='font-size:0.9em; text-align:left; margin-left:10px;'><b style='color:#3B82F6;'>- Next.js Server Actions</b><br/>- TypeScript</div>]
            C[<div style='font-weight:bold; font-size:1.1em; margin-bottom:5px;'>AI Orchestration</div><div style='font-size:0.9em; text-align:left; margin-left:10px;'><b style='color:#9333EA;'>- Genkit Framework</b><br/>- TypeScript</div>]
            D[<div style='font-weight:bold; font-size:1.1em; margin-bottom:5px;'>External Services</div><div style='font-size:0.9em; text-align:left; margin-left:10px;'><b style='color:#D97706;'>- Google AI (Gemini)</b><br/>- Google Maps API</div>]
        end
        
        subgraph "Data Store"
            direction TB
            E[<div style='font-weight:bold; font-size:1.1em; margin-bottom:5px;'>Database</div><div style='font-size:0.9em; text-align:left; margin-left:10px;'><b style='color:#16A34A;'>- Mock Student Data</b><br/>(In-memory array)</div>]
        end
    end

    A -- "1. User submits route <br/>(via Next.js Server Action call)" --> B
    B -- "2. Calls Genkit Flow: `suggestCarpoolMatches`" --> C
    C -- "3. Fetches potential matches" --> E
    C -- "4. Uses `getCoordinates` tool via Google Maps API" --> D
    C -- "5. Sends prompt with user route & potential matches to Gemini" --> D
    D -- "6. Returns ranked matches" --> C
    C -- "7. Returns matches to Server Action" --> B
    B -- "8. Processes data (adds pseudonyms) & returns to UI" --> A
    
    classDef frontend fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px;
    classDef backend fill:#F5F3FF,stroke:#9333EA,stroke-width:2px;
    classDef data fill:#F0FFF4,stroke:#16A34A,stroke-width:2px;
    classDef services fill:#FFFBEB,stroke:#D97706,stroke-width:2px;

    class A frontend
    class B backend
    class C backend
    class D services
    class E data

```

1.  **UI (Frontend)**: The user interacts with a form built in Next.js (React) and TypeScript.
2.  **Server Action**: On form submission, a Next.js Server Action is called.
3.  **Genkit Flow**: The action invokes a Genkit flow (`suggestCarpoolMatches`) which orchestrates the matching logic.
4.  **Data Retrieval & External APIs**: The flow fetches potential matches from a mock database and uses a Genkit tool to call the Google Maps Geocoding API, converting addresses to coordinates.
5.  **AI Processing**: The flow sends a detailed prompt—including the user's route, potential matches, and coordinate data—to the Gemini AI model.
6.  **Response**: The AI model returns a ranked list of the best matches based on route and time similarity.
7.  **Data Post-Processing**: The Server Action receives the AI's response, enhances it by generating pseudonyms for privacy, and returns the final list to the UI.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Orchestration**: [Genkit](https://firebase.google.com/docs/genkit)
- **AI Model**: [Google Gemini](https://deepmind.google/technologies/gemini/)
- **External Services**: [Google Maps API (Geocoding)](https://developers.google.com/maps/documentation/geocoding)
- **Database**: In-memory mock data (a simple TypeScript array) for demonstration purposes.

---

This project was built in Firebase Studio. To get started, take a look at `src/app/page.tsx`.
