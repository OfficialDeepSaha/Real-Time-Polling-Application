# Overview

This is a real-time polling application built with Node.js, Express, React, and PostgreSQL. The application allows users to create polls with multiple options and vote on them, with real-time updates delivered via WebSockets. The system features a REST API for CRUD operations and WebSocket connections for live poll result updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with proper HTTP status codes
- **Real-time Communication**: WebSocket server using native WebSocket API
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with tsx for development server

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection Pooling**: Neon serverless connection pooling

## Database Schema Design
- **Users**: Basic user management with email, name, and password hash
- **Polls**: Poll entities with question, publication status, and creator relationship
- **Poll Options**: Multiple choice options per poll with cascade delete
- **Votes**: Junction table implementing many-to-many relationship between users and poll options
- **Relationships**: Proper foreign key constraints and cascading deletes

## Authentication and Authorization
- **Password Security**: Bcrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **User Context**: Temporary user ID system (placeholder for full auth implementation)

## Real-time Features
- **WebSocket Implementation**: Native WebSocket server integrated with HTTP server
- **Subscription Model**: Clients subscribe to specific poll updates
- **Live Updates**: Real-time broadcasting of vote counts and percentages
- **Connection Management**: Automatic cleanup of disconnected clients

## Development and Build Process
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Development Tools**: Replit-specific plugins for development environment
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Hot Reload**: Development server with automatic restart on changes

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **Database URL**: Environment variable-based connection string

## UI and Component Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Component variant management

## Development and Build Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Fast JavaScript bundler for backend
- **TypeScript**: Type safety across the entire application
- **Drizzle Kit**: Database schema management and migrations

## Runtime Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation library
- **date-fns**: Date manipulation utilities
- **bcrypt**: Password hashing library

## WebSocket and Real-time
- **ws**: WebSocket library for Node.js
- **Native WebSocket API**: Browser-side WebSocket implementation

## Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express
- **Express Session**: Session middleware for user state management