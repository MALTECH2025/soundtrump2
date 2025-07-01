
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

const StatsOverview = ({ userStats }: StatsOverviewProps) => {
  const stats = [
    {
      icon: Trophy,
      label: 'Total ST Coins',
      value: userStats.totalPoints.toLocaleString(),
      change: '+12%',
      color: 'text-yellow-600'
    },
    {
      icon: Target,
      label: 'Tasks Completed',
      value: userStats.tasksCompleted,
      change: '+3',
      color: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Referrals',
      value: userStats.referrals,
      change: '+1',
      color: 'text-blue-600'
    },
    {
      icon: Gift,
      label: 'Rewards Claimed',
      value: userStats.rewardsRedeemed,
      change: 'New',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
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
