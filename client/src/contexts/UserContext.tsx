import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, type User } from '@/lib/api';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage and rehydrate
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      getUser(savedUserId)
        .then((user) => {
          setCurrentUser(user);
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn('Failed to rehydrate user:', error);
          // Clear invalid user ID from localStorage
          localStorage.removeItem('currentUserId');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Save user ID to localStorage when currentUser changes
    if (currentUser) {
      localStorage.setItem('currentUserId', currentUser.id);
    } else {
      localStorage.removeItem('currentUserId');
    }
  }, [currentUser]);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}