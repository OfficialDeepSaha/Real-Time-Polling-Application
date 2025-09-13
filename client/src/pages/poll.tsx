import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPoll, getPollResults, createVote } from "@/lib/api";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Link2, Twitter, Facebook, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function PollPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hasVoted, setHasVoted] = useState(false);

  const { data: poll, isLoading: isPollLoading } = useQuery({
    queryKey: ['/api/polls', id],
    queryFn: () => getPoll(id!),
    enabled: !!id,
  });

  const { data: results, isLoading: isResultsLoading } = useQuery({
    queryKey: ['/api/polls', id, 'results'],
    queryFn: () => getPollResults(id!),
    enabled: !!id,
    refetchInterval: hasVoted ? false : 5000, // Stop auto-refresh after voting
  });

  const { isConnected, lastUpdate, pollResults } = useWebSocket(id);

  // Update results from WebSocket
  useEffect(() => {
    if (pollResults && pollResults.pollId === id) {
      queryClient.setQueryData(['/api/polls', id, 'results'], {
        results: pollResults.results,
        totalVotes: pollResults.totalVotes,
      });
    }
  }, [pollResults, id, queryClient]);

  const voteMutation = useMutation({
    mutationFn: (pollOptionId: string) => createVote({
      userId: "temp-user-id", // In real app, get from auth context
      pollOptionId,
      pollId: id!,
    }),
    onSuccess: () => {
      setHasVoted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/polls', id, 'results'] });
      toast({
        title: "Vote submitted!",
        description: "Your vote has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit vote",
        variant: "destructive",
      });
    },
  });

  const copyPollLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Poll link has been copied to clipboard.",
    });
  };

  if (isPollLoading || isResultsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-xl mb-8"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!poll || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Poll not found</h2>
            <p className="text-muted-foreground mb-4">The poll you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>Go back to dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="bg-card border border-border overflow-hidden">
          {/* Poll Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-sm font-medium">
                  {isConnected ? 'Live Poll' : 'Offline'}
                </span>
              </div>
              <div className="text-sm opacity-90">
                <span data-testid="text-total-votes">{results.totalVotes}</span> votes
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2" data-testid="text-poll-question">
              {poll.question}
            </h2>
            <p className="text-sm opacity-90">
              Created by <span data-testid="text-creator-name">{poll.creator?.name}</span> • 
              <span className="ml-1" data-testid="text-created-time">
                {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
              </span>
            </p>
          </div>

          {/* Voting Interface */}
          <CardContent className="p-8">
            <div className="space-y-4 mb-8">
              {poll.options?.map((option, index) => {
                const result = results.results.find(r => r.optionId === option.id);
                const voteCount = result?.voteCount || 0;
                const percentage = result?.percentage || 0;

                return (
                  <div
                    key={option.id}
                    className={`border border-border rounded-lg p-4 transition-all cursor-pointer hover:bg-secondary/50 ${
                      voteMutation.isPending ? 'opacity-50' : ''
                    }`}
                    onClick={() => !hasVoted && !voteMutation.isPending && voteMutation.mutate(option.id)}
                    data-testid={`option-${option.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-foreground" data-testid={`text-option-text-${option.id}`}>
                        {option.text}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        <span data-testid={`text-vote-count-${option.id}`}>{voteCount}</span> votes 
                        (<span data-testid={`text-percentage-${option.id}`}>{percentage}%</span>)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          index === 0 ? 'bg-primary' : 
                          index === 1 ? 'bg-accent' :
                          index === 2 ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                        data-testid={`progress-${option.id}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {hasVoted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm font-medium">✓ Your vote has been recorded!</p>
              </div>
            )}

            {/* Real-time Updates Info */}
            <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-3 mb-6">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isConnected ? (
                  <>
                    Results update automatically as votes come in. 
                    {lastUpdate && (
                      <span className="ml-1" data-testid="text-last-update">
                        Last update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
                      </span>
                    )}
                  </>
                ) : (
                  "Connection lost. Trying to reconnect..."
                )}
              </span>
            </div>

            {/* Share Poll */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Share this poll</span>
                <div className="flex space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPollLink}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-copy-link"
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-share-twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-share-facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
