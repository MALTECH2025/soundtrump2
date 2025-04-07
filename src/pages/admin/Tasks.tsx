import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchTaskCategories
} from '@/lib/api';
import { Task as TaskType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from '@/lib/toast';
import { Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

const TaskCard = ({ task, onEdit, onDelete }: { task: TaskType, onEdit: () => void, onDelete: () => void }) => {
  return (
    <TableRow key={task.id}>
      <TableCell className="font-medium">{task.title}</TableCell>
      <TableCell>{task.description}</TableCell>
      <TableCell>{task.points}</TableCell>
      <TableCell>{task.difficulty}</TableCell>
      <TableCell>{task.verification_type}</TableCell>
      <TableCell>{task.active ? <Badge>Active</Badge> : 'Inactive'}</TableCell>
      <TableCell className="flex gap-2">
        <Button size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-2" />Edit</Button>
        <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
      </TableCell>
    </TableRow>
  );
};

const AdminTasks = () => {
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskData, setTaskData] = useState<Partial<TaskType>>({
    title: '',
    description: '',
    points: 10,
    difficulty: 'Easy',
    verification_type: 'Automatic',
    active: true,
  });
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const { data: taskCategories = [] } = useQuery({
    queryKey: ['taskCategories'],
    queryFn: fetchTaskCategories,
  });

  const createTaskMutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created successfully!');
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  const updateTaskMutation = useMutation(
    (updates: { taskId: string, updates: Partial<TaskType> }) => updateTask(updates.taskId, updates.updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
        toast.success('Task updated successfully!');
        setOpen(false);
        resetForm();
      },
      onError: (error: any) => {
        toast.error(`Failed to update task: ${error.message}`);
      },
    }
  );

  const deleteTaskMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isEditMode) {
      updateTaskMutation.mutate({ taskId: taskData.id as string, updates: taskData });
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  const handleEditTask = (task: TaskType) => {
    setIsEditMode(true);
    setTaskData(task);
    setOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setTaskData({
      title: '',
      description: '',
      points: 10,
      difficulty: 'Easy',
      verification_type: 'Automatic',
      active: true,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Task' : 'Create Task'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Edit the task details.' : 'Create a new task.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  type="number"
                  id="points"
                  value={taskData.points}
                  onChange={(e) => setTaskData({ ...taskData, points: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={taskData.difficulty}
                  onValueChange={(value) => setTaskData({ ...taskData, difficulty: value as "Easy" | "Medium" | "Hard" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="verification_type">Verification Type</Label>
                <Select
                  value={taskData.verification_type}
                  onValueChange={(value) => setTaskData({ ...taskData, verification_type: value as "Automatic" | "Manual" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select verification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={taskData.active}
                  onCheckedChange={(checked) => setTaskData({ ...taskData, active: checked })}
                />
              </div>
              <DialogFooter>
                <Button type="submit">{isEditMode ? 'Update Task' : 'Create Task'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Verification Type</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={{ ...task, difficulty: task.difficulty as "Easy" | "Medium" | "Hard" }}
                  onEdit={() => handleEditTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
