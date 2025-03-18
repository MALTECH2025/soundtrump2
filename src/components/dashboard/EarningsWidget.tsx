
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, TrendingUp, Wallet, Clock } from 'lucide-react';
import { motion, MotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

// Sample earnings data
const dailyData = [
  { name: 'Mon', earnings: 42 },
  { name: 'Tue', earnings: 63 },
  { name: 'Wed', earnings: 28 },
  { name: 'Thu', earnings: 80 },
  { name: 'Fri', earnings: 52 },
  { name: 'Sat', earnings: 73 },
  { name: 'Sun', earnings: 90 },
];

const weeklyData = [
  { name: 'Week 1', earnings: 190 },
  { name: 'Week 2', earnings: 230 },
  { name: 'Week 3', earnings: 310 },
  { name: 'Week 4', earnings: 280 },
];

const monthlyData = [
  { name: 'Jan', earnings: 850 },
  { name: 'Feb', earnings: 1220 },
  { name: 'Mar', earnings: 980 },
  { name: 'Apr', earnings: 1380 },
  { name: 'May', earnings: 1650 },
  { name: 'Jun', earnings: 1420 },
];

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 shadow-lg border border-border p-2 text-xs rounded-md backdrop-blur-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sound-light font-bold">{payload[0].value} ST Coins</p>
      </div>
    );
  }
  return null;
};

// Animated counter component
const Counter = ({ to }: { to: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 1.5,
      onUpdate: (value) => setCount(Math.floor(value)),
      ease: 'easeOut',
    });
    
    return () => controls.stop();
  }, [to]);
  
  return <span>{count}</span>;
};

interface EarningsWidgetProps {
  totalEarnings: number;
  pendingEarnings: number;
  percentageIncrease: number;
}

const EarningsWidget = ({ 
  totalEarnings = 3750, 
  pendingEarnings = 150, 
  percentageIncrease = 12 
}: EarningsWidgetProps) => {
  return (
    <Card className="border overflow-hidden">
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Earnings Overview</CardTitle>
          <div className="flex items-center text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>+{percentageIncrease}%</span>
          </div>
        </div>
        <CardDescription>Your ST Coin earnings activity</CardDescription>
      </CardHeader>
      
      <CardContent className="p-5 pt-3">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-md bg-sound-dark/5 border border-border">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Wallet className="w-3 h-3 mr-1" />
              <span>Total Balance</span>
            </div>
            <div className="text-xl font-semibold">
              <Counter to={totalEarnings} /> <span className="text-xs">ST Coins</span>
            </div>
          </div>
          
          <div className="p-3 rounded-md bg-sound-dark/5 border border-border">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Clock className="w-3 h-3 mr-1" />
              <span>Pending</span>
            </div>
            <div className="text-xl font-semibold">
              <Counter to={pendingEarnings} /> <span className="text-xs">ST Coins</span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-muted/50">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <div className="h-48 w-full">
            <TabsContent value="daily" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3AC6FF"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3AC6FF", strokeWidth: 2, stroke: "#3AC6FF" }}
                    activeDot={{ r: 5, fill: "#0060E6", strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="weekly" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3AC6FF"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3AC6FF", strokeWidth: 2, stroke: "#3AC6FF" }}
                    activeDot={{ r: 5, fill: "#0060E6", strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="monthly" className="m-0 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3AC6FF"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3AC6FF", strokeWidth: 2, stroke: "#3AC6FF" }}
                    activeDot={{ r: 5, fill: "#0060E6", strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EarningsWidget;
