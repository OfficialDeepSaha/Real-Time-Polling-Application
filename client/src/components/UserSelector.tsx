import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { getUsers, createUser, type User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LogIn } from 'lucide-react';

interface UserSelectorProps {
  open: boolean;
  onClose: () => void;
}

export function UserSelector({ open, onClose }: UserSelectorProps) {
  const { setCurrentUser } = useUser();
  const { toast } = useToast();
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    passwordHash: 'defaultpassword123' // For demo purposes
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/users'],
    queryFn: getUsers,
    enabled: open
  });

  const handleSelectUser = () => {
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      setCurrentUser(user);
      toast({
        title: "Logged in",
        description: `Welcome back, ${user.name}!`
      });
      onClose();
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.name || !newUserData.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = await createUser(newUserData);
      setCurrentUser(user);
      toast({
        title: "Account created",
        description: `Welcome, ${user.name}!`
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user account",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose User</DialogTitle>
          <DialogDescription>
            Select an existing user or create a new one to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={mode === 'select' ? 'default' : 'outline'}
              onClick={() => setMode('select')}
              className="flex-1"
              data-testid="button-select-mode"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Select User
            </Button>
            <Button
              variant={mode === 'create' ? 'default' : 'outline'}
              onClick={() => setMode('create')}
              className="flex-1"
              data-testid="button-create-mode"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>

          {mode === 'select' && (
            <div className="space-y-4">
              {isLoadingUsers ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="user-select">Select a user</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger data-testid="select-user">
                        <SelectValue placeholder="Choose a user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSelectUser}
                    disabled={!selectedUserId}
                    className="w-full"
                    data-testid="button-login"
                  >
                    Login as Selected User
                  </Button>
                </>
              )}
            </div>
          )}

          {mode === 'create' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  data-testid="input-new-user-name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  data-testid="input-new-user-email"
                />
              </div>
              <Button
                onClick={handleCreateUser}
                disabled={!newUserData.name || !newUserData.email}
                className="w-full"
                data-testid="button-create-user"
              >
                Create Account
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}