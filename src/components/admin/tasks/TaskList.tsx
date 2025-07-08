
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Edit, Trash2, Clock, Award } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onOpenEditDialog: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList = ({ tasks, onUpdateTask, onOpenEditDialog, onDeleteTask }: TaskListProps) => {
  const isMobile = useIsMobile();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base line-clamp-2">{task.title}</CardTitle>
                <Switch
                  checked={task.active}
                  onCheckedChange={(checked) => onUpdateTask(task.id, { active: checked })}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {task.category?.name || 'No Category'}
                </Badge>
                <Badge variant={task.difficulty === 'Easy' ? 'default' : task.difficulty === 'Medium' ? 'secondary' : 'destructive'} className="text-xs">
                  {task.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>{task.points} ST</span>
                  </div>
                  {task.expires_at && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(task.expires_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Select
                    value={task.difficulty}
                    onValueChange={(value) => onUpdateTask(task.id, { difficulty: value as "Easy" | "Medium" | "Hard" })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onOpenEditDialog(task)} 
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDeleteTask(task.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium max-w-xs">
                <div className="truncate" title={task.title}>
                  {task.title}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {task.category?.name || 'No Category'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  {task.points}
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={task.difficulty}
                  onValueChange={(value) => onUpdateTask(task.id, { difficulty: value as "Easy" | "Medium" | "Hard" })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={task.active}
                    onCheckedChange={(checked) => onUpdateTask(task.id, { active: checked })}
                  />
                  <span className="text-xs text-muted-foreground">
                    {task.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {task.expires_at ? (
                  <div className="text-xs text-muted-foreground">
                    {new Date(task.expires_at).toLocaleDateString()}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No expiry</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onOpenEditDialog(task)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
