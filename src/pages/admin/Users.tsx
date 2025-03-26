
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/lib/api";
import { 
  CheckCircle2, 
  CircleUser, 
  Pencil, 
  Shield, 
  Star, 
  UserPlus 
} from "lucide-react";
import { AnimatedTransition } from "@/components/ui/AnimatedTransition";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { UserProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const UsersAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchLeaderboard(100), // Get a larger list of users for admin
  });
  
  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const makeAdmin = async (userId: string) => {
    // We'll implement this in the API file later
    console.log("Make admin:", userId);
  };

  return (
    <AdminLayout>
      <AnimatedTransition>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
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
                  <TableHead>Status</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user: UserProfile) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.username || "User"} 
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <CircleUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{user.username || "Anonymous"}</div>
                            <div className="text-sm text-muted-foreground">{user.full_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Influencer" ? "default" : "outline"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.points}</TableCell>
                      <TableCell>
                        <Badge variant={user.tier === "Premium" ? "default" : "outline"}>
                          {user.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.role === "admin" ? (
                          <Badge className="bg-red-500">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {user.role !== "admin" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => makeAdmin(user.id)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AnimatedTransition>
    </AdminLayout>
  );
};

export default UsersAdmin;
