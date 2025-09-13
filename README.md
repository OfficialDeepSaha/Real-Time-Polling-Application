# Polling App

A modern, full-stack polling application built with React, Express.js, and PostgreSQL. Create polls, vote, and view real-time results with Google OAuth authentication.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **Create Polls** - Easy poll creation with multiple options
- **Real-time Voting** - Vote on polls and see live results
- **Responsive Design** - Beautiful UI that works on all devices
- **Modern Tech Stack** - Built with the latest technologies

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Performant forms
- **Tanstack Query** - Data fetching and caching
- **Wouter** - Lightweight routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Robust relational database
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for sessions

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESBuild** - Fast JavaScript bundler
- **Drizzle Kit** - Database migrations
- **TSX** - TypeScript execution

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Google OAuth credentials** (for authentication)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd JobBoardAPI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/polling_app

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App Configuration
NODE_ENV=development
PORT=5000
```

### 4. Database Setup

```bash
# Push the schema to your database
npm run db:push
```

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

For detailed instructions, see `GOOGLE_OAUTH_SETUP.md`

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
JobBoardAPI/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # React entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── auth.ts             # Authentication configuration
│   ├── db.ts               # Database connection
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── vite.ts             # Vite integration
├── shared/                 # Shared code between client/server
│   └── schema.ts           # Database schema and types
├── .env                    # Environment variables
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🗄️ Database Schema

The application uses Drizzle ORM with the following PostgreSQL tables:

### Users
- `id` - Unique identifier (UUID)
- `name` - User's display name
- `email` - User's email address (unique)
- `passwordHash` - Hashed password
- `createdAt` - Account creation timestamp

### Polls
- `id` - Unique identifier (UUID)
- `question` - Poll question
- `isPublished` - Publication status (boolean)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `creatorId` - Reference to user who created the poll

### Poll Options
- `id` - Unique identifier (UUID)
- `text` - Option text
- `pollId` - Reference to parent poll (cascade delete)

### Votes
- `id` - Unique identifier (UUID)
- `userId` - Reference to voting user
- `pollOptionId` - Reference to selected option (cascade delete)
- `createdAt` - Vote timestamp

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run check        # Type checking

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push     # Push schema changes to database
```

## 🌐 API Endpoints

### Authentication Endpoints

#### Initiate Google OAuth
```http
GET /auth/google
```
Redirects to Google OAuth consent screen.

#### OAuth Callback
```http
GET /auth/google/callback
```
Handles Google OAuth callback and creates/updates user session.

#### Get Current User
```http
GET /auth/me
```
Returns current authenticated user information.

**Response:**
```json
{
  "id": "user-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Logout
```http
POST /auth/logout
```
Logs out the current user and clears session.

### Poll Endpoints

#### Get All Polls
```http
GET /api/polls
```
Returns all published polls with their options and vote counts.

**Response:**
```json
[
  {
    "id": "poll-uuid",
    "question": "What's your favorite programming language?",
    "isPublished": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creator": {
      "id": "user-uuid",
      "name": "John Doe"
    },
    "options": [
      {
        "id": "option-uuid",
        "text": "JavaScript",
        "voteCount": 5
      },
      {
        "id": "option-uuid",
        "text": "Python",
        "voteCount": 3
      }
    ]
  }
]
```

#### Create New Poll
```http
POST /api/polls
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "What's your favorite programming language?",
  "options": [
    { "text": "JavaScript" },
    { "text": "Python" },
    { "text": "TypeScript" }
  ]
}
```

**Response:**
```json
{
  "id": "poll-uuid",
  "question": "What's your favorite programming language?",
  "isPublished": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creatorId": "user-uuid"
}
```

#### Get Specific Poll
```http
GET /api/polls/:id
```
Returns detailed information about a specific poll.

#### Vote on Poll
```http
POST /api/polls/:id/vote
Content-Type: application/json
```

**Request Body:**
```json
{
  "optionId": "option-uuid"
}
```

**Response:**
```json
{
  "id": "vote-uuid",
  "userId": "user-uuid",
  "pollOptionId": "option-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing the API

### Using cURL

#### Test Authentication
```bash
# Check if user is authenticated
curl -X GET http://localhost:5000/auth/me \
  -H "Cookie: your-session-cookie"
```

#### Create a Poll
```bash
curl -X POST http://localhost:5000/api/polls \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "question": "What is your favorite framework?",
    "options": [
      {"text": "React"},
      {"text": "Vue"},
      {"text": "Angular"}
    ]
  }'
```

#### Get All Polls
```bash
curl -X GET http://localhost:5000/api/polls
```

#### Vote on a Poll
```bash
curl -X POST http://localhost:5000/api/polls/POLL_ID/vote \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"optionId": "OPTION_ID"}'
```

### Using Postman

1. **Import Collection**: Create a new Postman collection
2. **Set Base URL**: `http://localhost:5000`
3. **Authentication**: 
   - First, visit `http://localhost:5000/auth/google` in browser
   - Copy session cookie from browser dev tools
   - Add cookie to Postman requests
4. **Test Endpoints**: Use the API endpoints documented above

### Using Browser

1. **Start the application**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:5000`
3. **Sign in**: Click "Sign in with Google"
4. **Create polls**: Use the web interface
5. **Check Network tab**: Monitor API calls in browser dev tools

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects back with authorization code
4. Server exchanges code for user profile information
5. User account is created/updated in database
6. JWT token is issued and stored in HTTP-only cookie
7. User is redirected to application dashboard

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=5000
```

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database credentials and database exists

**Google OAuth Error**
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
- Verify redirect URI in Google Cloud Console matches exactly
- Ensure Google+ API is enabled in Google Cloud Console

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires v18+)
- Verify all environment variables are set

**Port Already in Use**
- Change PORT in .env file
- Kill existing process: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

**CORS Issues**
- Ensure frontend and backend are running on correct ports
- Check Vite proxy configuration in vite.config.ts

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Polling! 🗳️**