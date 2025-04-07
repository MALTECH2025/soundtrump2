
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, UserX, Shield, Users, Crown, Award } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { fetchLeaderboard, updateUserRole, updateUserStatus, updateUserTier } from '@/lib/api';
import { UserProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const UserRow = ({ 
  user, 
  onRoleChange,
  onStatusChange,
  onTierChange 
}: { 
  user: UserProfile, 
  onRoleChange: (userId: string, role: "user" | "admin") => void,
  onStatusChange: (userId: string, status: "Normal" | "Influencer") => void,
  onTierChange: (userId: string, tier: "Free" | "Premium") => void
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.avatar_url || ''} alt={user.username || 'User'} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.full_name || user.username || 'Anonymous'}</div>
            <div className="text-sm text-muted-foreground">{user.id.substring(0, 8)}...</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
          {user.role || 'user'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.tier === 'Premium' ? 'default' : 'outline'}>
          {user.tier}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.status === 'Influencer' ? 'default' : 'outline'}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>{user.points.toLocaleString()}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}>
              {user.role === 'admin' ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  <span>Remove Admin</span>
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Make Admin</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onTierChange(user.id, user.tier === 'Premium' ? 'Free' : 'Premium')}>
              <Crown className="mr-2 h-4 w-4" />
              <span>{user.tier === 'Premium' ? 'Downgrade to Free' : 'Upgrade to Premium'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(user.id, user.status === 'Influencer' ? 'Normal' : 'Influencer')}>
              <Award className="mr-2 h-4 w-4" />
              <span>{user.status === 'Influencer' ? 'Remove Influencer Status' : 'Make Influencer'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCheck className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const UsersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteUserDialog, setDeleteUserDialog] = useState({ open: false, userId: '' });
  const queryClient = useQueryClient();
  
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => fetchLeaderboard(100), // Fetch up to 100 users
  });

  // Set up real-time listener for changes to profiles
  useEffect(() => {
    const profilesChannel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, [refetch]);
  
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: "user" | "admin" }) => 
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update user role');
      console.error(error);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string, status: "Normal" | "Influencer" }) => 
      updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update user status');
      console.error(error);
    }
  });

  const updateTierMutation = useMutation({
    mutationFn: ({ userId, tier }: { userId: string, tier: "Free" | "Premium" }) => 
      updateUserTier(userId, tier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User tier updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update user tier');
      console.error(error);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted successfully');
      setDeleteUserDialog({ open: false, userId: '' });
    },
    onError: (error) => {
      toast.error('Failed to delete user. You may not have sufficient permissions.');
      console.error(error);
      setDeleteUserDialog({ open: false, userId: '' });
    }
  });
  
  const handleRoleChange = (userId: string, role: "user" | "admin") => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleStatusChange = (userId: string, status: "Normal" | "Influencer") => {
    updateStatusMutation.mutate({ userId, status });
  };

  const handleTierChange = (userId: string, tier: "Free" | "Premium") => {
    updateTierMutation.mutate({ userId, tier });
  };

  const handleDeleteUser = () => {
    if (deleteUserDialog.userId) {
      deleteUserMutation.mutate(deleteUserDialog.userId);
    }
  };
  
  const filteredUsers = (users as UserProfile[]).filter((user: UserProfile) => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      (user.username?.toLowerCase().includes(searchTerms) || false) ||
      (user.full_name?.toLowerCase().includes(searchTerms) || false) ||
      user.id.toLowerCase().includes(searchTerms)
    );
  });
  
  return (
    <AdminLayout title="Users Management" description="Manage user accounts and permissions">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Users</CardTitle>
            <CardDescription>Manage user accounts, roles, tiers and permissions</CardDescription>
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-sound-medium border-t-sound-light rounded-full animate-spin"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <p className="text-center py-4 text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: UserProfile) => (
                    <UserRow 
                      key={user.id} 
                      user={user} 
                      onRoleChange={handleRoleChange} 
                      onStatusChange={handleStatusChange}
                      onTierChange={handleTierChange}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteUserDialog.open} onOpenChange={(open) => !open && setDeleteUserDialog({ open, userId: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UsersManagement;
