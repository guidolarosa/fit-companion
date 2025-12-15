# Fit Companion - Weight Loss Tracker

A modern Next.js application for tracking weight loss progress with AI assistance.

## Features

- **Dashboard**: View current weight, total calories burnt, and recent entries
- **Weight Tracking**: Record weight entries and visualize progress with charts
- **Exercise Tracking**: Log exercises and calories burnt with AI exercise suggestions
- **Food Tracking**: Track food consumption and calories with AI food recommendations
- **Healthy Products List**: Create and export shopping lists
- **AI Agent**: Get personalized weight loss advice
- **Settings**: Configure your profile (name, height, age, lifestyle)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** components
- **Prisma** with SQLite
- **Recharts** for data visualization
- **Dark theme** by default
- **Inter font** (modern, clean typography)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Accessing on Mobile Device

To access the app on your phone:

1. Make sure your phone is on the same Wi-Fi network as your computer.

2. Find your computer's local IP address:
   - **Mac/Linux**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows**: Run `ipconfig` and look for IPv4 Address

3. Start the dev server with mobile access:
   ```bash
   npm run dev:mobile
   ```

4. On your phone's browser, navigate to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   For example: `http://192.168.1.72:3000`

**Note**: Make sure your firewall allows connections on port 3000.

## Project Structure

```
fit-companion/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── weight/            # Weight tracking page
│   ├── exercise/          # Exercise tracking page
│   ├── food/              # Food tracking page
│   ├── agent/             # AI agent page
│   ├── settings/          # Settings page
│   └── page.tsx           # Dashboard
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── ...               # Feature components
├── lib/                  # Utility functions
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Utility functions
└── prisma/              # Database schema
    └── schema.prisma
```

## Database

The app uses SQLite with Prisma ORM. The database file will be created automatically at `prisma/dev.db` when you run `prisma db push`.

## Environment Variables

Create a `.env.local` file in the root directory with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Notes

- All measurements use the metric system (kg, cm)
- Dark theme is enabled by default
- AI agents are integrated with OpenAI (using gpt-4o-mini model)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

### Quick Production Setup

1. Set up a PostgreSQL database (Railway, Supabase, or Neon)
2. Update `prisma/schema.prisma` to use PostgreSQL
3. Set environment variables in your deployment platform
4. Deploy to Vercel, Railway, or your preferred platform

## License

MIT

