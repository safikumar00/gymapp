# Gym Owner Management App

A comprehensive mobile application for gym owners to manage their gyms, members, attendance, and payments. Built with Expo and Supabase.

## Features

- **Hybrid Mode**: Works with or without Supabase configuration
- **Authentication**: Secure email/password authentication
- **Member Management**: Add, view, and manage gym members
- **Dashboard**: Overview of gym statistics and metrics
- **Attendance Tracking**: Monitor member check-ins
- **Payment Management**: Track member payments and subscriptions
- **Role-Based Access**: Support for owners, trainers, and members

## Tech Stack

- **Frontend**: React Native with Expo
- **Routing**: Expo Router with tab navigation
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native

## Project Structure

```
project/
├── app/                           # Expo Router pages
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Dashboard tab
│   │   ├── members.tsx          # Members tab
│   │   ├── attendance.tsx       # Attendance tab
│   │   ├── payments.tsx         # Payments tab
│   │   └── settings.tsx         # Settings tab
│   ├── auth/
│   │   └── login.tsx            # Login screen
│   └── _layout.tsx              # Root layout with auth routing
├── src/
│   ├── api/
│   │   └── supabase.ts          # Supabase client setup
│   ├── services/
│   │   ├── auth.service.ts      # Authentication service
│   │   ├── members.service.ts   # Members service
│   │   └── payments.service.ts  # Payments service
│   ├── store/
│   │   └── useAuthStore.ts      # Auth state management
│   ├── screens/
│   │   ├── Auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── Dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   └── Members/
│   │       └── MembersListScreen.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx       # Reusable button component
│   │   │   ├── Card.tsx         # Card component
│   │   │   └── Input.tsx        # Input component
│   │   └── members/
│   │       └── MemberCard.tsx   # Member card component
│   ├── constants/
│   │   └── theme.ts             # Theme constants
│   ├── utils/
│   │   └── mockData.ts          # Mock data for demo mode
│   └── types/
│       └── index.d.ts           # TypeScript definitions
├── .env.example                  # Environment variables template
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (installed automatically)
- Supabase account (optional for demo mode)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Create a `.env` file based on `.env.example`:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
USE_MOCK_DATA=true
```

3. Start the development server:
```bash
npm run dev
```

## Hybrid Mode

The app supports two modes:

### 1. Demo Mode (No Supabase)

When Supabase credentials are not configured, the app uses mock data:
- Sign in with any email/password
- View sample members, payments, and statistics
- Perfect for testing and development

### 2. Production Mode (With Supabase)

When Supabase is configured:
- Real authentication with email/password
- Data persistence in PostgreSQL
- Row Level Security for data protection
- Real-time updates

## Database Schema

The app uses the following tables:

- **gyms**: Gym information
- **profiles**: User profiles (linked to auth.users)
- **members**: Gym members
- **subscription_plans**: Available subscription plans
- **subscriptions**: Member subscriptions
- **attendance**: Check-in records
- **member_payments**: Payment records

## Security

All tables have Row Level Security (RLS) enabled with the following policies:

- **Owners**: Full access to their gym's data
- **Trainers**: Can view and manage members in their gym
- **Members**: Can only view their own data

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build:web` - Build for web platform
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
