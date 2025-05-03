
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskCategory } from "@/types";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onOpenEditDialog: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList = ({ tasks, onUpdateTask, onOpenEditDialog, onDeleteTask }: TaskListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.category?.name}</TableCell>
            <TableCell>{task.points}</TableCell>
            <TableCell>
              <Select
                value={task.difficulty}
                onValueChange={(value) => onUpdateTask(task.id, { difficulty: value as "Easy" | "Medium" | "Hard" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={task.difficulty} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Switch
                checked={task.active}
                onCheckedChange={(checked) => onUpdateTask(task.id, { active: checked })}
              />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => onOpenEditDialog(task)} className="mr-2">
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteTask(task.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskList;
