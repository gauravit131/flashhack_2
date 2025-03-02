# Food Donation Platform

A web application connecting food donors with NGOs to reduce food waste and help those in need.

## Features

- User authentication for both donors and NGOs
- Real-time food listing updates using WebSocket
- Time-based listings that expire after 2 hours
- City-based search functionality
- Detailed location information with Indian state/city suggestions
- Track donation history and accepted items

## Tech Stack

- Frontend: React with TypeScript
- Backend: Express.js
- State Management: TanStack Query (React Query)
- UI Components: shadcn/ui
- Real-time Updates: WebSocket
- Form Handling: React Hook Form + Zod
- Styling: Tailwind CSS

## Prerequisites

- Node.js 20 or later
- npm or yarn package manager

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd food-donation-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Register as either a food donor (helper) or an NGO
2. For donors:
   - Create food listings with details like quantity and location
   - Track your donation history
   - See which NGOs accepted your donations
3. For NGOs:
   - Browse available food listings
   - Search by city
   - Accept available donations
   - Track accepted donations

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions and configurations
│   │   ├── pages/      # Page components
│   │   └── App.tsx     # Main application component
├── server/              # Backend Express application
│   ├── auth.ts         # Authentication logic
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data storage implementation
│   └── websocket.ts    # WebSocket implementation
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema and types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
