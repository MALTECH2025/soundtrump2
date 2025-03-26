
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2, Plus, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '@/lib/api';
import { Task } from '@/types';

const AdminTasks = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>(null);
  const [filter, setFilter] = useState('all');
  
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['admin', 'tasks'],
    queryFn: fetchTasks
  });
  
  const filteredTasks = tasks.filter((task: any) => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.active;
    if (filter === 'inactive') return !task.active;
    return true;
  });
  
  const handleAddTask = () => {
    setIsEditing(false);
    setCurrentTask({
      title: '',
      description: '',
      points: 10,
      difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
      verification_type: 'Automatic' as 'Automatic' | 'Manual',
      active: true
    });
    setShowDialog(true);
  };
  
  const handleEditTask = (task: Task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setShowDialog(true);
  };
  
  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        refetch();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateTask(currentTask.id, currentTask);
        toast.success('Task updated successfully');
      } else {
        await createTask(currentTask as any);
        toast.success('Task created successfully');
      }
      
      setShowDialog(false);
      refetch();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };
  
  return (
    <AdminLayout title="Task Management" description="Manage the tasks for your users to complete">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-muted-foreground">Manage all tasks in the system</p>
        </div>
        
        <div className="flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="active">Active Tasks</SelectItem>
              <SelectItem value="inactive">Inactive Tasks</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-8 text-center">Loading tasks...</div>
        ) : filteredTasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task: any) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description.substring(0, 50)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>{task.points}</TableCell>
                  <TableCell>
                    <Badge variant={
                      task.difficulty === 'Easy' ? 'outline' : 
                      task.difficulty === 'Medium' ? 'secondary' : 
                      'destructive'
                    }>
                      {task.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.verification_type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={task.active ? 'outline' : 'destructive'}>
                      {task.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTask(task as Task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-semibold">No tasks found</h3>
            <p className="text-muted-foreground">
              {filter !== 'all' ? 'Try changing the filter or ' : ''}
              create a new task to get started.
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the task details below.'
                : 'Fill in the task details to create a new task for users to complete.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={currentTask?.title || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentTask?.description || ''}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={currentTask?.points || 10}
                    onChange={(e) => setCurrentTask({ ...currentTask, points: parseInt(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={currentTask?.difficulty || 'Easy'}
                    onValueChange={(value) => setCurrentTask({ 
                      ...currentTask, 
                      difficulty: value as 'Easy' | 'Medium' | 'Hard' 
                    })}
                  >
                    <SelectTrigger id="difficulty">
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
                  <Label htmlFor="verification">Verification</Label>
                  <Select
                    value={currentTask?.verification_type || 'Automatic'}
                    onValueChange={(value) => setCurrentTask({ 
                      ...currentTask, 
                      verification_type: value as 'Automatic' | 'Manual' 
                    })}
                  >
                    <SelectTrigger id="verification">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={currentTask?.active ?? true}
                  onChange={(e) => setCurrentTask({ ...currentTask, active: e.target.checked })}
                  className="rounded border-gray-300 focus:ring-indigo-500 h-4 w-4 text-indigo-600"
                />
                <Label htmlFor="active" className="text-sm">Active (available to users)</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTasks;
