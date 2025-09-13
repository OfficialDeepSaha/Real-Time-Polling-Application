import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertPollSchema, insertVoteSchema, type User } from "@shared/schema";
import { ZodError } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const pollSubscriptions = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws, request) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe' && data.pollId) {
          if (!pollSubscriptions.has(data.pollId)) {
            pollSubscriptions.set(data.pollId, new Set());
          }
          pollSubscriptions.get(data.pollId)!.add(ws);
          
          ws.on('close', () => {
            pollSubscriptions.get(data.pollId)?.delete(ws);
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast poll results to subscribers
  async function broadcastPollResults(pollId: string) {
    const subscribers = pollSubscriptions.get(pollId);
    if (!subscribers || subscribers.size === 0) return;

    try {
      const results = await storage.getPollResults(pollId);
      const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0);
      
      const pollData = {
        type: 'poll_update',
        pollId,
        results: results.map(result => ({
          ...result,
          percentage: totalVotes > 0 ? Math.round((result.voteCount / totalVotes) * 100 * 10) / 10 : 0,
        })),
        totalVotes,
      };

      const message = JSON.stringify(pollData);
      
      subscribers.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    } catch (error) {
      console.error('Error broadcasting poll results:', error);
    }
  }

  // Error handler middleware
  const handleError = (error: any, res: any) => {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.error('API Error:', error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  };

  // User routes
  app.get('/api/users', async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const usersResponse = allUsers.map((user: User) => {
        const { passwordHash, ...userResponse } = user;
        return userResponse;
      });
      res.json(usersResponse);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const user = await storage.createUser(userData);
      const { passwordHash, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Poll routes
  app.post('/api/polls', async (req, res) => {
    try {
      const pollData = insertPollSchema.parse(req.body);
      const userId = req.body.userId; // In real app, get from session/auth
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const poll = await storage.createPoll(pollData, userId);
      res.status(201).json(poll);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get('/api/polls', async (req, res) => {
    try {
      const polls = await storage.getAllPolls();
      res.json(polls);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get('/api/polls/:id', async (req, res) => {
    try {
      const poll = await storage.getPollWithOptions(req.params.id);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      res.json(poll);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.put('/api/polls/:id', async (req, res) => {
    try {
      const updates = req.body;
      const poll = await storage.updatePoll(req.params.id, updates);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      res.json(poll);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get('/api/polls/:id/results', async (req, res) => {
    try {
      const results = await storage.getPollResults(req.params.id);
      const totalVotes = results.reduce((sum, result) => sum + result.voteCount, 0);
      
      const resultsWithPercentage = results.map(result => ({
        ...result,
        percentage: totalVotes > 0 ? Math.round((result.voteCount / totalVotes) * 100 * 10) / 10 : 0,
      }));

      res.json({
        results: resultsWithPercentage,
        totalVotes,
      });
    } catch (error) {
      handleError(error, res);
    }
  });

  // Vote routes
  app.post('/api/votes', async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      
      // Check if user already voted in this poll
      const pollOption = await storage.getPoll(req.body.pollId);
      if (!pollOption) {
        return res.status(404).json({ message: "Poll not found" });
      }

      const existingVote = await storage.getUserVoteForPoll(voteData.userId, req.body.pollId);
      if (existingVote) {
        return res.status(400).json({ message: "User has already voted in this poll" });
      }

      const vote = await storage.createVote(voteData);
      
      // Broadcast updated results to WebSocket subscribers
      await broadcastPollResults(req.body.pollId);
      
      res.status(201).json(vote);
    } catch (error) {
      handleError(error, res);
    }
  });

  return httpServer;
}
