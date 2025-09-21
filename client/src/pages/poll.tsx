import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPoll, getPollResults, createVote } from "@/lib/api";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Link2, Twitter, Facebook, ArrowLeft, BarChart3, Users, Clock, Activity, Share, Trophy, Zap } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function PollPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
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
      userId: user!.id,
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

  const shareOnTwitter = () => {
    const text = `Check out this poll: "${poll?.question}" - Cast your vote and see live results!`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=poll,voting,realtime`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  if (isPollLoading || isResultsLoading) {
    return (
      <div className="min-h-screen bg-background">
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="animate-pulse">
          <div className="h-32 sm:h-48 bg-muted rounded-xl mb-4 sm:mb-6"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 sm:h-14 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  }

  if (!poll || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Poll not found</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">The poll you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="w-full sm:w-auto">Go back to dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl px-4 py-2 font-medium" 
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>

        <Card className="bg-card border border-border overflow-hidden">
          {/* Enhanced Poll Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 p-4 sm:p-6 lg:p-8 text-white">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-xs sm:text-sm font-medium">
                    {isConnected ? 'Live Poll' : 'Offline'}
                  </span>
                </div>
                <div className="text-xs sm:text-sm opacity-90">
                  <span data-testid="text-total-votes">{results.totalVotes}</span> votes
                </div>
              </div>
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-300" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight text-center" data-testid="text-poll-question">
                {poll.question}
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-indigo-100">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    Created by <span data-testid="text-creator-name">{poll.creator?.name}</span> • 
                    <span className="ml-1" data-testid="text-created-time">
                      {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
                  <span className="text-xs sm:text-sm font-medium">Live Results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Interface */}
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {poll.options?.map((option, index) => {
                const result = results.results.find(r => r.optionId === option.id);
                const voteCount = result?.voteCount || 0;
                const percentage = result?.percentage || 0;
                const isWinning = voteCount > 0 && voteCount === Math.max(...results.results.map(r => r.voteCount));

                const gradientColors = [
                  'from-blue-500 to-blue-600',
                  'from-purple-500 to-purple-600', 
                  'from-green-500 to-green-600',
                  'from-orange-500 to-orange-600',
                  'from-pink-500 to-pink-600',
                  'from-indigo-500 to-indigo-600'
                ];

                return (
                  <div
                    key={option.id}
                    className={`group relative overflow-hidden bg-white rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                      hasVoted ? 'cursor-default' : 'cursor-pointer hover:border-indigo-300'
                    } ${
                      voteMutation.isPending ? 'opacity-50' : ''
                    } ${
                      isWinning && results.totalVotes > 0 ? 'border-yellow-400 shadow-lg' : 'border-gray-200'
                    }`}
                    onClick={() => !hasVoted && !voteMutation.isPending && voteMutation.mutate(option.id)}
                    data-testid={`option-${option.id}`}
                  >
                    {isWinning && results.totalVotes > 0 && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                          <Trophy className="h-3 w-3" />
                          <span>Leading</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg" data-testid={`text-option-text-${option.id}`}>
                            {option.text}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900" data-testid={`text-vote-count-${option.id}`}>
                            {voteCount}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            <span data-testid={`text-percentage-${option.id}`}>{percentage}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${gradientColors[index % gradientColors.length]} rounded-full transition-all duration-1000 ease-out relative`}
                            style={{ width: `${percentage}%` }}
                            data-testid={`progress-${option.id}`}
                          >
                            {percentage > 0 && (
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                        {percentage > 15 && (
                          <div className="absolute inset-y-0 left-2 sm:left-3 flex items-center">
                            <span className="text-white text-xs font-bold">{percentage}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasVoted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-green-500 rounded-full">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-green-800 font-bold text-sm sm:text-base lg:text-lg">🎉 Vote Recorded Successfully!</p>
                    <p className="text-green-600 text-xs sm:text-sm">Thank you for participating. Results update in real-time.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Real-time Updates Info */}
            <div className={`rounded-xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8 transition-all ${
              isConnected 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200'
            }`}>
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-bounce'
                }`}></div>
              </div>
              <div className="flex-1">
                <div className={`font-bold text-xs sm:text-sm ${
                  isConnected ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isConnected ? '🟢 Live Connection Active' : '🔴 Connection Lost'}
                </div>
                <span className={`text-xs sm:text-sm ${
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isConnected ? (
                    <>
                      <span className="hidden sm:inline">Results update automatically as votes come in.</span>
                      <span className="sm:hidden">Live updates active</span>
                      {lastUpdate && (
                        <span className="ml-1 hidden sm:inline" data-testid="text-last-update">
                          Last update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
                        </span>
                      )}
                    </>
                  ) : (
                    "Trying to reconnect... Please wait."
                  )}
                </span>
              </div>
              {isConnected && (
                <div className="flex-shrink-0">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 animate-pulse" />
                </div>
              )}
            </div>

            {/* Enhanced Share Poll */}
            <div className="pt-6 sm:pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-indigo-500 rounded-lg">
                      <Share className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-indigo-900">Share this poll</span>
                      <p className="text-xs sm:text-sm text-indigo-600">Help others participate in this poll</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyPollLink}
                      className="flex-1 sm:flex-none bg-white hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md text-xs sm:text-sm"
                      data-testid="button-copy-link"
                    >
                      <Link2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Copy Link</span>
                      <span className="sm:hidden">Copy</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareOnTwitter}
                      className="bg-blue-500 hover:bg-blue-600 text-white transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md p-2"
                      data-testid="button-share-twitter"
                      title="Share on Twitter"
                    >
                      <Twitter className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareOnFacebook}
                      className="bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md p-2"
                      data-testid="button-share-facebook"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
