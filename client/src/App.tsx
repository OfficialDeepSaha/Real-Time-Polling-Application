import * as React from "react";
import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { UserSelector } from "@/components/UserSelector";
import Dashboard from "@/pages/dashboard";
import CreatePoll from "@/pages/create-poll";
import PollPage from "@/pages/poll";
import NotFound from "@/pages/not-found";

// Navigation Header Component
function NavigationHeader() {
  const { currentUser, logout } = useUser();
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">RealTime Polls</h1>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <a href="/" className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium">Dashboard</a>
                <a href="/create-poll" className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium">Create Poll</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* WebSocket Status Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Connected</span>
              </div>
              <div className="relative">
                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Welcome, {currentUser.name}</span>
                    <button 
                      onClick={logout}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md hover:bg-secondary/80 transition-colors text-sm"
                      data-testid="button-logout"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowUserSelector(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    data-testid="button-select-user"
                  >
                    Select User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <UserSelector open={showUserSelector} onClose={() => setShowUserSelector(false)} />
    </>
  );
}

function Router() {
  return (
    <>
      <NavigationHeader />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/create-poll" component={CreatePoll} />
        <Route path="/poll/:id" component={PollPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
