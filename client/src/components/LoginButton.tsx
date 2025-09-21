import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User, Vote, BarChart3, Users, Sparkles, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function LoginButton() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          {user.avatar && (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="hidden sm:inline">{user.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} className="bg-blue-600 hover:bg-blue-700">
      <LogIn className="w-4 h-4 mr-2" />
      Sign in with Google
    </Button>
  );
}

export function LoginCard() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Welcome! 🎉",
        description: "Successfully logged in to Polling App",
        duration: 4000,
      });
    }
  }, [isAuthenticated, toast]);

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4">
      {/* Enhanced animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />
        
        {/* Smaller floating elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-300/10 to-blue-500/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}} />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-300/10 to-pink-500/10 rounded-full blur-lg animate-bounce" style={{animationDelay: '3s', animationDuration: '4s'}} />
      </div>
      
      {/* Subtle moving stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-300/40 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-cyan-300/40 rounded-full animate-pulse" style={{animationDelay: '3s'}} />
      </div>
      
      {/* Premium glassmorphism card - Responsive and smaller */}
      <Card className="w-full max-w-sm sm:max-w-md relative backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl shadow-blue-500/10 rounded-2xl sm:rounded-3xl overflow-hidden group">
        {/* Dynamic border gradient */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/30 via-purple-500/30 to-cyan-500/30 p-[1px] group-hover:from-blue-400/50 group-hover:via-purple-500/50 group-hover:to-cyan-500/50 transition-all duration-700">
          <div className="h-full w-full rounded-3xl bg-slate-950/80 backdrop-blur-2xl" />
        </div>
        
        {/* Inner glow effect */}
        <div className="absolute inset-2 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative z-10">
          <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6">
            {/* Enhanced App Icon with glow effect - Smaller */}
            <div className="mx-auto mb-4 sm:mb-6 relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <Vote className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10" />
              </div>
              <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl sm:rounded-3xl blur-xl opacity-50 animate-pulse" />
            </div>
            
            <CardTitle className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Polling App
              </span>
              <div className="flex items-center justify-center mt-1 sm:mt-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse" />
              </div>
            </CardTitle>
            <CardDescription className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm mx-auto">
              Create engaging polls and gather insights from your community with our 
              <span className="text-blue-400 font-semibold bg-blue-400/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm">modern polling platform</span>
            </CardDescription>
          </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6">
          {/* Premium feature highlights - Responsive and smaller */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 py-4 sm:py-6">
            <div className="text-center group cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40">
                <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium group-hover:text-blue-400 transition-colors">Create Polls</p>
              <p className="text-xs text-slate-400 mt-0.5 sm:mt-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">Build engaging surveys</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium group-hover:text-purple-400 transition-colors">View Results</p>
              <p className="text-xs text-slate-400 mt-0.5 sm:mt-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">Real-time analytics</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 backdrop-blur-sm border border-cyan-400/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium group-hover:text-cyan-400 transition-colors">Share & Vote</p>
              <p className="text-xs text-slate-400 mt-0.5 sm:mt-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">Collaborate easily</p>
            </div>
          </div>
          
          {/* Enhanced Google Sign In Button with premium design */}
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
            
            <Button 
              onClick={handleLogin} 
              className="relative w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
              size="default"
            >
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
              
              <div className="flex items-center justify-center relative z-10 space-x-2 sm:space-x-3">
                {/* Google Logo with better styling */}
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                
                <span className="text-sm sm:text-base font-medium tracking-wide">Continue with Google</span>
              </div>
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/20 group-hover:via-purple-50/20 group-hover:to-pink-50/20 transition-all duration-300 rounded-2xl" />
            </Button>
          </div>
          
          {/* Premium trust indicators - Responsive */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 pt-3 sm:pt-4">
            <div className="flex items-center text-xs sm:text-sm text-slate-300 group cursor-pointer">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full mr-2 sm:mr-3 flex items-center justify-center border border-green-400/30 group-hover:scale-110 transition-all duration-300">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              </div>
              <div>
                <span className="group-hover:text-green-400 transition-colors font-medium">Secure & Private</span>
                <p className="text-xs text-slate-500 hidden sm:block">End-to-end encrypted</p>
              </div>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-slate-300 group cursor-pointer">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full mr-2 sm:mr-3 flex items-center justify-center border border-blue-400/30 group-hover:scale-110 transition-all duration-300">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <div>
                <span className="group-hover:text-blue-400 transition-colors font-medium">Lightning Fast</span>
                <p className="text-xs text-slate-500 hidden sm:block">Real-time updates</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            By signing in, you agree to our{' '}
            <span className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors">terms of service</span> and{' '}
            <span className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors">privacy policy</span>.
          </p>
          
        </CardContent>
        </div>
      </Card>
    </div>
  );
}
