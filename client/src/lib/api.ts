import { apiRequest } from "./queryClient";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Poll {
  id: string;
  question: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator?: User;
  options?: PollOption[];
  _count?: { votes: number };
}

export interface PollOption {
  id: string;
  text: string;
  pollId: string;
  voteCount?: number;
  percentage?: number;
}

export interface Vote {
  id: string;
  userId: string;
  pollOptionId: string;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface CreatePollData {
  question: string;
  isPublished: boolean;
  options: Array<{ text: string }>;
  userId: string;
}

export interface CreateVoteData {
  userId: string;
  pollOptionId: string;
  pollId: string;
}

export interface PollResults {
  results: Array<{
    optionId: string;
    text: string;
    voteCount: number;
    percentage: number;
  }>;
  totalVotes: number;
}

// User API
export async function createUser(userData: CreateUserData): Promise<User> {
  const response = await apiRequest('POST', '/api/users', userData);
  return response.json();
}

export async function getUsers(): Promise<User[]> {
  const response = await apiRequest('GET', '/api/users');
  return response.json();
}

export async function getUser(id: string): Promise<User> {
  const response = await apiRequest('GET', `/api/users/${id}`);
  return response.json();
}

export async function updateUser(id: string, updates: Partial<CreateUserData>): Promise<User> {
  const response = await apiRequest('PUT', `/api/users/${id}`, updates);
  return response.json();
}

// Poll API
export async function createPoll(pollData: CreatePollData): Promise<Poll> {
  const response = await apiRequest('POST', '/api/polls', pollData);
  return response.json();
}

export async function getPolls(): Promise<Poll[]> {
  const response = await apiRequest('GET', '/api/polls');
  return response.json();
}

export async function getPoll(id: string): Promise<Poll> {
  const response = await apiRequest('GET', `/api/polls/${id}`);
  return response.json();
}

export async function updatePoll(id: string, updates: Partial<Poll>): Promise<Poll> {
  const response = await apiRequest('PUT', `/api/polls/${id}`, updates);
  return response.json();
}

export async function getPollResults(id: string): Promise<PollResults> {
  const response = await apiRequest('GET', `/api/polls/${id}/results`);
  return response.json();
}

// Vote API
export async function createVote(voteData: CreateVoteData): Promise<Vote> {
  const response = await apiRequest('POST', '/api/votes', voteData);
  return response.json();
}
