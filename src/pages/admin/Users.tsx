
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/components/admin/AdminLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MoreVertical, Shield, Crown, Award, Users } from 'lucide-react';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';
import { updateUserRole, updateUserStatus, updateUserTier } from '@/lib/api';
import { UserProfile } from '@/types';

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  
  const queryClient = useQueryClient();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    }
  });
  
  const updateUserRoleMutation = useMutation({
    mutationFn: ({userId, role}: {userId: string, role: 'user' | 'admin'}) => 
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  const updateUserStatusMutation = useMutation({
    mutationFn: ({userId, status}: {userId: string, status: 'Normal' | 'Influencer'}) => 
      updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  const updateUserTierMutation = useMutation({
    mutationFn: ({userId, tier}: {userId: string, tier: 'Free' | 'Premium'}) => 
      updateUserTier(userId, tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  const updateUserPointsMutation = useMutation({
    mutationFn: async ({userId, points}: {userId: string, points: number}) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ points })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditUserOpen(false);
    }
  });
  
  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setUserPoints(user.points || 0);
    setIsEditUserOpen(true);
  };
  
  const handleUpdateUserPoints = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUserPointsMutation.mutateAsync({
        userId: selectedUser.id,
        points: userPoints
      });
      
      toast.success(`Updated points for ${selectedUser.username || selectedUser.full_name || 'user'}`);
    } catch (error) {
      console.error('Error updating user points:', error);
      toast.error('Failed to update user points');
    }
  };
  
  const handleMakeAdmin = async (user: UserProfile) => {
    try {
      await updateUserRoleMutation.mutateAsync({
        userId: user.id,
        role: 'admin'
      });
      
      toast.success(`${user.username || user.full_name || 'User'} is now an admin`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };
  
  const handleRemoveAdmin = async (user: UserProfile) => {
    try {
      await updateUserRoleMutation.mutateAsync({
        userId: user.id,
        role: 'user'
      });
      
      toast.success(`${user.username || user.full_name || 'User'} is no longer an admin`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };
  
  const handleMakeInfluencer = async (user: UserProfile) => {
    try {
      await updateUserStatusMutation.mutateAsync({
        userId: user.id,
        status: 'Influencer'
      });
      
      toast.success(`${user.username || user.full_name || 'User'} is now an influencer`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };
  
  const handleRemoveInfluencer = async (user: UserProfile) => {
    try {
      await updateUserStatusMutation.mutateAsync({
        userId: user.id,
        status: 'Normal'
      });
      
      toast.success(`${user.username || user.full_name || 'User'} is no longer an influencer`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };
  
  const handleMakePremium = async (user: UserProfile) => {
    try {
      await updateUserTierMutation.mutateAsync({
        userId: user.id,
        tier: 'Premium'
      });
      
      toast.success(`${user.username || user.full_name || 'User'} is now a premium user`);
    } catch (error) {
      console.error('Error updating user tier:', error);
      toast.error('Failed to update user tier');
    }
  };
  
  const handleRemovePremium = async (user: UserProfile) => {
    try {
      await updateUserTierMutation.mutateAsync({
        userId: user.id,
        tier: 'Free'
      });
      
      toast.success(`${user.username || user.full_name || 'User'} is now a free user`);
    } catch (error) {
      console.error('Error updating user tier:', error);
      toast.error('Failed to update user tier');
    }
  };
  
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const username = (user.username || '').toLowerCase();
    const fullName = (user.full_name || '').toLowerCase();
    
    return username.includes(query) || fullName.includes(query);
  });
  
  return (
    <AdminLayout title="Manage Users" description="View and manage users">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback className="bg-sound-light text-white">
                              {user.initials || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.full_name || user.username || 'Unknown User'}
                            </div>
                            {user.username && user.username !== user.full_name && (
                              <div className="text-xs text-muted-foreground">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.points || 0}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? (
                          <Badge className="bg-red-500">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.status === 'Influencer' ? (
                          <Badge className="bg-purple-500">Influencer</Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.tier === 'Premium' ? (
                          <Badge className="bg-sound-light">Premium</Badge>
                        ) : (
                          <Badge variant="outline">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Award className="h-4 w-4 mr-2" />
                              Edit Points
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => user.role === 'admin' ? handleRemoveAdmin(user) : handleMakeAdmin(user)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              {user.role === 'admin' ? 'Remove Admin Role' : 'Make Admin'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => user.status === 'Influencer' ? handleRemoveInfluencer(user) : handleMakeInfluencer(user)}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              {user.status === 'Influencer' ? 'Remove Influencer Status' : 'Make Influencer'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => user.tier === 'Premium' ? handleRemovePremium(user) : handleMakePremium(user)}
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              {user.tier === 'Premium' ? 'Change to Free Tier' : 'Change to Premium Tier'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Edit User Points Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User Points</DialogTitle>
              <DialogDescription>
                Adjust points for {selectedUser?.username || selectedUser?.full_name || 'this user'}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="points" className="text-right">
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  className="col-span-3"
                  value={userPoints}
                  onChange={(e) => setUserPoints(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUserPoints} disabled={updateUserPointsMutation.isPending}>
                {updateUserPointsMutation.isPending ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
