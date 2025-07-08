
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Gift, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Play,
      label: 'Start Tasks',
      description: 'Complete tasks to earn ST coins',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/tasks')
    },
    {
      icon: Gift,
      label: 'Claim Rewards',
      description: 'Redeem your ST coins for rewards',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/rewards')
    },
    {
      icon: Users,
      label: 'Invite Friends',
      description: 'Earn bonus ST coins for referrals',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/referrals')
    },
    {
      icon: Zap,
      label: 'Start Mining',
      description: 'Mine ST coins passively',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => {
        console.log('Starting mining...');
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className={`h-auto p-3 md:p-4 flex flex-col items-center gap-2 text-white ${action.color} border-none w-full min-h-[80px] md:min-h-[100px]`}
                onClick={action.onClick}
              >
                <action.icon className="h-4 w-4 md:h-6 md:w-6" />
                <div className="text-center">
                  <div className="font-medium text-xs md:text-sm">{action.label}</div>
                  <div className="text-xs opacity-90 hidden md:block">{action.description}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
