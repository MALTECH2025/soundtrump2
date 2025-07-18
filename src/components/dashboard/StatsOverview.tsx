
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Target, Users, Gift } from 'lucide-react';

interface StatsOverviewProps {
  userStats: {
    totalPoints: number;
    tasksCompleted: number;
    referrals: number;
    rewardsRedeemed: number;
    tier: string;
    rank?: number;
  };
  isLoading?: boolean;
}

const StatsOverview = ({ userStats, isLoading = false }: StatsOverviewProps) => {
  const stats = [
    {
      icon: Trophy,
      label: 'Total ST Coins',
      value: userStats.totalPoints.toLocaleString(),
      change: `${userStats.totalPoints} ST`,
      color: 'text-yellow-600'
    },
    {
      icon: Target,
      label: 'Tasks Completed',
      value: userStats.tasksCompleted,
      change: userStats.tasksCompleted > 0 ? `+${userStats.tasksCompleted}` : '0',
      color: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Referrals',
      value: userStats.referrals,
      change: userStats.referrals > 0 ? `+${userStats.referrals}` : '0',
      color: 'text-blue-600'
    },
    {
      icon: Gift,
      label: 'Rewards Claimed',
      value: userStats.rewardsRedeemed,
      change: userStats.rewardsRedeemed > 0 ? `+${userStats.rewardsRedeemed}` : '0',
      color: 'text-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              {stat.label === 'Total ST Coins' && userStats.rank && (
                <p className="text-xs text-muted-foreground mt-1">
                  Rank #{userStats.rank}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;
