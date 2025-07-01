
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Filter } from 'lucide-react';

interface TaskFiltersProps {
  selectedDifficulty: string;
  selectedPoints: string;
  selectedStatus: string;
  onDifficultyChange: (value: string) => void;
  onPointsChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

const TaskFilters = ({
  selectedDifficulty,
  selectedPoints,
  selectedStatus,
  onDifficultyChange,
  onPointsChange,
  onStatusChange,
  onReset
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg mb-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
      </div>
      
      <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPoints} onValueChange={onPointsChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Points" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Points</SelectItem>
          <SelectItem value="low">1-50 ST</SelectItem>
          <SelectItem value="medium">51-150 ST</SelectItem>
          <SelectItem value="high">150+ ST</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 ml-auto">
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          12 new tasks today
        </Badge>
        
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters;
