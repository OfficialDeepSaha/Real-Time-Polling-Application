import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { User } from '@shared/schema';

// JWT secret - in production, use a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'sk_prod_9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2b1c0d9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1a0b9c8d7e6f5g4h3i2j1k0l9m8n7o6p5q4r3s2t1u0v9w8x7y6z5a4b3c2d1e0f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z9a8b7c6d5e4f3g2h1i0j';
const JWT_EXPIRES_IN = '7d';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '519686378035-ks6adkrlas5p4ptqohe8duq3uekbq8i1.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback';

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
    
    if (!user) {
      // Create new user if doesn't exist
      const userData = {
        name: profile.displayName || profile.name?.givenName || 'Unknown User',
        email: profile.emails?.[0]?.value || '',
        passwordHash: 'google-oauth' // Placeholder for OAuth users
      };
      
      user = await storage.createUser(userData);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, undefined);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Generate JWT token
export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware to authenticate JWT token
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Also check for token in cookies
  const cookieToken = req.cookies?.token;
  const finalToken = token || cookieToken;
  
  if (!finalToken) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  const decoded = verifyToken(finalToken);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
}

// Optional middleware - doesn't fail if no token
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const cookieToken = req.cookies?.token;
  const finalToken = token || cookieToken;
  
  if (finalToken) {
    const decoded = verifyToken(finalToken);
    if (decoded) {
      req.user = decoded;
    }
  }
  
  next();
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

export default passport;