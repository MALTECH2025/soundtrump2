
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, UserX, Shield, Users } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { fetchLeaderboard, updateUserRole } from '@/lib/api';
import { UserProfile } from '@/types';

const UserRow = ({ user, onRoleChange }: { user: UserProfile, onRoleChange: (userId: string, role: string) => void }) => {
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
  const queryClient = useQueryClient();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => fetchLeaderboard(100), // Fetch up to 100 users
  });
  
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: string }) => 
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
  
  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };
  
  const filteredUsers = users.filter((user: UserProfile) => {
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
            <CardDescription>Manage user accounts and permissions</CardDescription>
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
                  <TableHead>Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-sound-medium border-t-sound-light rounded-full animate-spin"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <p className="text-center py-4 text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user: UserProfile) => (
                    <UserRow key={user.id} user={user} onRoleChange={handleRoleChange} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UsersManagement;
