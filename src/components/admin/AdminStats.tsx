
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ListChecks, Award, Coins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStatsProps {
  totalUsers: number;
  totalTasks: number;
  totalRewards: number;
  totalPoints: number;
  isLoading?: boolean;
}

const AdminStats = ({ 
  totalUsers, 
  totalTasks, 
  totalRewards, 
  totalPoints, 
  isLoading = false 
}: AdminStatsProps) => {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered users in the system"
    },
    {
      title: "Active Tasks",
      value: totalTasks,
      icon: ListChecks,
      description: "Total available tasks"
    },
    {
      title: "Rewards Claimed",
      value: totalRewards,
      icon: Award,
      description: "Rewards redeemed by users"
    },
    {
      title: "Total Points",
      value: totalPoints,
      icon: Coins,
      description: "Total points awarded in the system"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-1/2" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.description && (
                  <CardDescription>{stat.description}</CardDescription>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
