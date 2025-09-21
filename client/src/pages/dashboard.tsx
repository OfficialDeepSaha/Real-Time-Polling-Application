import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPolls } from "@/lib/api";
import { Link, useLocation } from "wouter";
import { Plus, MessageCircleQuestion, Vote, Eye, Users, TrendingUp, Activity, Clock } from "lucide-react";
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4 sm:p-6 lg:p-8 text-center mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight">Dashboard</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg font-medium px-2">Manage your polls and view real-time results</p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
                <span className="text-white text-xs sm:text-sm font-medium">Live Updates</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300" />
                <span className="text-white text-xs sm:text-sm font-medium">Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end items-center mb-6 sm:mb-8">
          <Button 
            onClick={() => navigate("/create-poll")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium w-full sm:w-auto"
            data-testid="button-create-poll"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create New Poll</span>
            <span className="sm:hidden">Create Poll</span>
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg">
                    <MessageCircleQuestion className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Polls</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mt-1" data-testid="text-total-polls">
                      {stats.totalPolls}
                    </p>
                  </div>
                </div>
                <div className="text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity hidden sm:block">
                  <MessageCircleQuestion className="h-8 w-8 lg:h-12 lg:w-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                    <Vote className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wide">Total Votes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900 mt-1" data-testid="text-total-votes">
                      {stats.totalVotes}
                    </p>
                  </div>
                </div>
                <div className="text-purple-500 opacity-20 group-hover:opacity-40 transition-opacity hidden sm:block">
                  <Vote className="h-8 w-8 lg:h-12 lg:w-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl shadow-lg">
                    <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide">Active Polls</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 mt-1" data-testid="text-active-polls">
                      {stats.activePolls}
                    </p>
                  </div>
                </div>
                <div className="text-green-500 opacity-20 group-hover:opacity-40 transition-opacity hidden sm:block">
                  <Activity className="h-8 w-8 lg:h-12 lg:w-12" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm font-semibold text-orange-700 uppercase tracking-wide">Participants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900 mt-1" data-testid="text-participants">
                      {stats.participants}
                    </p>
                  </div>
                </div>
                <div className="text-orange-500 opacity-20 group-hover:opacity-40 transition-opacity hidden sm:block">
                  <Users className="h-8 w-8 lg:h-12 lg:w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recent Polls */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md sm:rounded-lg">
                  <MessageCircleQuestion className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Polls</h3>
              </div>
              <Button 
                onClick={() => navigate("/create-poll")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create New Poll</span>
                <span className="sm:hidden">Create Poll</span>
              </Button>
            </div>
            
            {polls.length === 0 ? (
              <div className="text-center py-8 sm:py-12 lg:py-16">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full opacity-50"></div>
                  </div>
                  <MessageCircleQuestion className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500 mx-auto mb-4 sm:mb-6 relative z-10" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No polls yet</h4>
                <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-4">Create your first poll to get started with real-time polling</p>
                <Button 
                  onClick={() => navigate("/create-poll")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
                  data-testid="button-create-first-poll"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Create Your First Poll
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {polls.slice(0, 6).map((poll, index) => (
                  <Card 
                    key={poll.id} 
                    className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                    data-testid={`card-poll-${poll.id}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-4 sm:p-6 relative z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 space-y-2 sm:space-y-0">
                        <h4 className="font-bold text-gray-900 line-clamp-2 text-base sm:text-lg group-hover:text-purple-700 transition-colors pr-2" data-testid={`text-poll-question-${poll.id}`}>
                          {poll.question}
                        </h4>
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-sm flex-shrink-0 ${
                          poll.isPublished 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        }`}>
                          {poll.isPublished ? '🟢 Active' : '🟡 Draft'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                          <span className="font-medium" data-testid={`text-poll-votes-${poll.id}`}>
                            {poll._count?.votes || 0} votes
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
                          <span data-testid={`text-poll-created-${poll.id}`}>
                            {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 space-y-2 sm:space-y-0">
                        <Link 
                          href={`/poll/${poll.id}`}
                          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
                          data-testid={`link-view-poll-${poll.id}`}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>View Results</span>
                        </Link>
                        <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto">
                          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold bg-gray-100 px-2 py-1 rounded-md">Poll #{index + 1}</div>
                        </div>
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
