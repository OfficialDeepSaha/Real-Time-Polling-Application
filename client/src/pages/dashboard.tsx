import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPolls } from "@/lib/api";
import { Link, useLocation } from "wouter";
import { Plus, MessageCircleQuestion, Vote, Eye, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const [, navigate] = useLocation();
  
  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['/api/polls'],
    queryFn: () => getPolls(),
  });

  const stats = {
    totalPolls: polls.length,
    totalVotes: polls.reduce((sum, poll) => sum + (poll._count?.votes || 0), 0),
    activePolls: polls.filter(poll => poll.isPublished).length,
    participants: new Set(polls.flatMap(poll => poll.creatorId)).size,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
            <p className="text-muted-foreground mt-2">Manage your polls and view real-time results</p>
          </div>
          <Button 
            onClick={() => navigate("/create-poll")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            data-testid="button-create-poll"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New MessageCircleQuestion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircleQuestion className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Polls</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-polls">
                    {stats.totalPolls}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Vote className="h-5 w-5 text-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-votes">
                    {stats.totalVotes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Polls</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-active-polls">
                    {stats.activePolls}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Participants</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-participants">
                    {stats.participants}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Polls */}
        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Recent Polls</h3>
            </div>
            
            {polls.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircleQuestion className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No polls yet</h4>
                <p className="text-muted-foreground mb-6">Create your first poll to get started</p>
                <Button 
                  onClick={() => navigate("/create-poll")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-create-first-poll"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create MessageCircleQuestion
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {polls.slice(0, 6).map((poll) => (
                  <Card 
                    key={poll.id} 
                    className="border border-border hover:shadow-md transition-shadow"
                    data-testid={`card-poll-${poll.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-foreground line-clamp-2" data-testid={`text-poll-question-${poll.id}`}>
                          {poll.question}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          poll.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {poll.isPublished ? 'Active' : 'Draft'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        <span data-testid={`text-poll-votes-${poll.id}`}>
                          {poll._count?.votes || 0} votes
                        </span> • 
                        <span data-testid={`text-poll-created-${poll.id}`}>
                          {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <Link 
                          href={`/poll/${poll.id}`}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                          data-testid={`link-view-poll-${poll.id}`}
                        >
                          View Results
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
