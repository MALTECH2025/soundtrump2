
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Database, Award, CheckCircle, 
  BarChart, Settings 
} from "lucide-react";
import { toast } from "@/lib/toast";
import { fetchLeaderboard } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedTransition } from "@/components/ui/AnimatedTransition";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminStats from "@/components/admin/AdminStats";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => fetchLeaderboard(10),
  });

  const totalUsers = leaderboardData?.length || 0;
  const totalPoints = leaderboardData?.reduce((sum, user) => sum + user.points, 0) || 0;
  const premiumUsers = leaderboardData?.filter(user => user.tier === "Premium").length || 0;
  const influencers = leaderboardData?.filter(user => user.status === "Influencer").length || 0;

  return (
    <AdminLayout>
      <AnimatedTransition>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <AdminStats 
                stats={[
                  { title: "Total Users", value: totalUsers, icon: Users },
                  { title: "Total Points", value: totalPoints, icon: Award },
                  { title: "Premium Users", value: premiumUsers, icon: CheckCircle },
                  { title: "Influencers", value: influencers, icon: BarChart }
                ]}
                isLoading={isLeaderboardLoading}
              />
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      View the latest user activity
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Task Completions</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      View task completion statistics
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Settings</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Configure system settings
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                  <CardDescription>
                    View user growth and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground">Analytics charts will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>
                    Manage your admin preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">Settings controls will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedTransition>
    </AdminLayout>
  );
};

export default AdminDashboard;
