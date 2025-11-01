# Agricultural Dashboard

## Overview
A React-based agricultural dashboard application built with Vite, TypeScript, and Tailwind CSS. The project uses Shadcn/UI components for a modern, responsive interface focused on agricultural data visualization and management.

## Current State
Successfully configured and running in Replit environment on port 5000.

## Project Architecture

### Frontend Framework
- **React 18** with TypeScript
- **Vite** as build tool and dev server
- **React Router** for client-side routing
- **TanStack Query** for data fetching and state management

### UI Components
- **Shadcn/UI** component library
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization

### Project Structure
```
src/
├── components/
│   ├── charts/           # Chart components for data visualization
│   ├── ui/              # Shadcn UI components
│   ├── AppSidebar.tsx   # Main navigation sidebar
│   └── [other components]
├── pages/               # Page components
│   ├── Overview.tsx     # Dashboard overview
│   ├── WeatherPage.tsx  # Weather data
│   ├── SoilPage.tsx     # Soil analytics
│   ├── CropsPage.tsx    # Crop management
│   └── AnalyticsPage.tsx # Analytics dashboard
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── App.tsx             # Main application component
```

## Development Configuration

### Vite Configuration
- Host: `0.0.0.0` (configured for Replit environment)
- Port: `5000`
- Aliases configured for `@/` imports

### Workflow
- **Start application**: `npm run dev` on port 5000
- Configured with webview output type for frontend preview

## Recent Changes
- Updated Vite configuration for Replit compatibility
- Fixed ES module compatibility issues with __dirname
- Configured proper host and port settings for Replit environment
- **CRITICAL FIX**: Added `allowedHosts: true` to resolve proxy host blocking
- Set up workflow to run on port 5000 with webview output
- Configured deployment for autoscale target

## User Preferences
- Using existing project structure and dependencies
- Maintaining React Router for navigation (project already configured)
- Keeping Shadcn/UI component system
- Following agricultural/farming domain theme