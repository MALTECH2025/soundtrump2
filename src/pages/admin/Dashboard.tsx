
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminStats from "@/components/admin/AdminStats";
import { getSystemStats } from "@/lib/api";
import { toast } from "@/lib/toast";

type SystemStats = {
  totalUsers: number;
  totalTasks: number;
  totalRewards: number;
  totalPoints: number;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalTasks: 0,
    totalRewards: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSystemStats();
        if (data) {
          setStats({
            totalUsers: data.totalUsers || 0,
            totalTasks: data.totalTasks || 0,
            totalRewards: data.totalRewards || 0,
            totalPoints: data.totalPoints || 0
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load system statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard" description="Overview of system statistics and performance.">
      <div className="flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AdminStats
            totalUsers={stats.totalUsers}
            totalTasks={stats.totalTasks}
            totalRewards={stats.totalRewards}
            totalPoints={stats.totalPoints}
            isLoading={loading}
          />
        </motion.div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage users</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Total users: {stats.totalUsers}</p>
              </CardContent>
              <CardFooter>
                <Button>Manage users</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Manage tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Total tasks: {stats.totalTasks}</p>
              </CardContent>
              <CardFooter>
                <Button>Manage tasks</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Rewards</CardTitle>
                <CardDescription>Manage rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Total rewards: {stats.totalRewards}</p>
              </CardContent>
              <CardFooter>
                <Button>Manage rewards</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Points</CardTitle>
                <CardDescription>Manage points</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Total points: {stats.totalPoints}</p>
              </CardContent>
              <CardFooter>
                <Button>Manage points</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
