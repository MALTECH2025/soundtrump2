
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItem {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
}

interface AdminStatsProps {
  stats: StatItem[];
  isLoading?: boolean;
}

const AdminStats = ({ stats, isLoading = false }: AdminStatsProps) => {
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
