import { users, polls, pollOptions, votes, type User, type InsertUser, type Poll, type InsertPoll, type PollOption, type Vote, type InsertVote } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined>;

  // Poll operations
  getPoll(id: string): Promise<Poll | undefined>;
  getPollWithOptions(id: string): Promise<(Poll & { options: PollOption[]; creator: User }) | undefined>;
  getUserPolls(userId: string): Promise<Poll[]>;
  getAllPolls(): Promise<(Poll & { creator: User; _count: { votes: number } })[]>;
  createPoll(poll: InsertPoll, userId: string): Promise<Poll>;
  updatePoll(id: string, updates: Partial<Omit<Poll, 'id' | 'createdAt'>>): Promise<Poll | undefined>;

  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getUserVoteForPoll(userId: string, pollId: string): Promise<Vote | undefined>;
  getPollResults(pollId: string): Promise<{ optionId: string; text: string; voteCount: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.passwordHash, 10);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, passwordHash: hashedPassword })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> {
    if (updates.passwordHash) {
      updates.passwordHash = await bcrypt.hash(updates.passwordHash, 10);
    }
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getPoll(id: string): Promise<Poll | undefined> {
    const [poll] = await db.select().from(polls).where(eq(polls.id, id));
    return poll || undefined;
  }

  async getPollWithOptions(id: string): Promise<(Poll & { options: PollOption[]; creator: User }) | undefined> {
    const result = await db
      .select()
      .from(polls)
      .leftJoin(pollOptions, eq(polls.id, pollOptions.pollId))
      .leftJoin(users, eq(polls.creatorId, users.id))
      .where(eq(polls.id, id));

    if (!result.length || !result[0].polls) return undefined;

    const poll = result[0].polls;
    const creator = result[0].users!;
    const options = result
      .filter(r => r.poll_options)
      .map(r => r.poll_options!) as PollOption[];

    return { ...poll, options, creator };
  }

  async getUserPolls(userId: string): Promise<Poll[]> {
    return await db
      .select()
      .from(polls)
      .where(eq(polls.creatorId, userId))
      .orderBy(desc(polls.createdAt));
  }

  async getAllPolls(): Promise<(Poll & { creator: User; _count: { votes: number } })[]> {
    const result = await db
      .select({
        poll: polls,
        creator: users,
        voteCount: sql<number>`cast(count(${votes.id}) as int)`,
      })
      .from(polls)
      .leftJoin(users, eq(polls.creatorId, users.id))
      .leftJoin(pollOptions, eq(polls.id, pollOptions.pollId))
      .leftJoin(votes, eq(pollOptions.id, votes.pollOptionId))
      .where(eq(polls.isPublished, true))
      .groupBy(polls.id, users.id)
      .orderBy(desc(polls.createdAt));

    return result.map(r => ({
      ...r.poll,
      creator: r.creator!,
      _count: { votes: r.voteCount },
    }));
  }

  async createPoll(insertPoll: InsertPoll, userId: string): Promise<Poll> {
    const { options, ...pollData } = insertPoll;
    
    const [poll] = await db
      .insert(polls)
      .values({ ...pollData, creatorId: userId })
      .returning();

    // Insert poll options
    await db
      .insert(pollOptions)
      .values(options.map(option => ({ text: option.text, pollId: poll.id })));

    return poll;
  }

  async updatePoll(id: string, updates: Partial<Omit<Poll, 'id' | 'createdAt'>>): Promise<Poll | undefined> {
    const [poll] = await db
      .update(polls)
      .set({ ...updates, updatedAt: sql`now()` })
      .where(eq(polls.id, id))
      .returning();
    return poll || undefined;
  }

  async createVote(vote: InsertVote): Promise<Vote> {
    const [newVote] = await db
      .insert(votes)
      .values(vote)
      .returning();
    return newVote;
  }

  async getUserVoteForPoll(userId: string, pollId: string): Promise<Vote | undefined> {
    const [vote] = await db
      .select({ vote: votes })
      .from(votes)
      .leftJoin(pollOptions, eq(votes.pollOptionId, pollOptions.id))
      .where(sql`${votes.userId} = ${userId} AND ${pollOptions.pollId} = ${pollId}`);
    
    return vote?.vote || undefined;
  }

  async getPollResults(pollId: string): Promise<{ optionId: string; text: string; voteCount: number }[]> {
    const results = await db
      .select({
        optionId: pollOptions.id,
        text: pollOptions.text,
        voteCount: sql<number>`cast(count(${votes.id}) as int)`,
      })
      .from(pollOptions)
      .leftJoin(votes, eq(pollOptions.id, votes.pollOptionId))
      .where(eq(pollOptions.pollId, pollId))
      .groupBy(pollOptions.id, pollOptions.text);

    return results;
  }
}

export const storage = new DatabaseStorage();
