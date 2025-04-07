import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from '@/lib/toast';
import { Edit, Trash2, Plus, CheckCircle2, Settings } from 'lucide-react';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import { Task } from '@/types';

const TasksAdminPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [configureRewardsOpen, setConfigureRewardsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [globalReferralPoints, setGlobalReferralPoints] = useState<number>(10);
  const [globalInfluencerMultiplier, setGlobalInfluencerMultiplier] = useState<number>(2);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    points: 50,
    difficulty: 'Easy' as const,
    verification_type: 'Automatic' as const,
    category_id: '',
    estimated_time: '5 minutes',
    instructions: '',
    active: true
  });
  
  const queryClient = useQueryClient();
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const fetchedTasks = await fetchTasks();
      return fetchedTasks.map(task => ({
        ...task,
        difficulty: task.difficulty as "Easy" | "Medium" | "Hard",
        verification_type: task.verification_type as "Automatic" | "Manual"
      }));
    }
  });
  
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreateDialogOpen(false);
      resetNewTaskForm();
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: (task: Task) => updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditDialogOpen(false);
      setSelectedTask(null);
    }
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  });
  
  const resetNewTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      points: 50,
      difficulty: 'Easy',
      verification_type: 'Automatic',
      category_id: '',
      estimated_time: '5 minutes',
      instructions: '',
      active: true
    });
  };
  
  const handleCreateTask = async () => {
    try {
      if (!newTask.title || !newTask.description) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      await createTaskMutation.mutateAsync(newTask);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };
  
  const handleUpdateTask = async () => {
    try {
      if (!selectedTask || !selectedTask.title || !selectedTask.description) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const updatedTask = {
        ...selectedTask,
        difficulty: selectedTask.difficulty as "Easy" | "Medium" | "Hard",
        verification_type: selectedTask.verification_type as "Automatic" | "Manual"
      };
      
      await updateTaskMutation.mutateAsync(updatedTask);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };
  
  const handleDeleteTask = async () => {
    try {
      if (!selectedTask) return;
      
      await deleteTaskMutation.mutateAsync(selectedTask.id);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };
  
  const handleEditClick = (task: Task) => {
    setSelectedTask({ ...task });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };
  
  const saveReferralRewardSettings = async () => {
    try {
      toast.success('Reward settings updated successfully');
      setConfigureRewardsOpen(false);
    } catch (error) {
      console.error('Error updating reward settings:', error);
      toast.error('Failed to update reward settings');
    }
  };
  
  return (
    <AdminLayout title="Manage Tasks" description="Create, edit, and manage tasks">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setConfigureRewardsOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configure Rewards
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.points}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            task.difficulty === 'Easy'
                              ? 'bg-green-500'
                              : task.difficulty === 'Medium'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }
                        >
                          {task.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.active ? (
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-500 text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(task)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No tasks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Create a new task for users to complete.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-3">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Title</Label>
                <Input
                  className="col-span-3"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <Textarea
                  className="col-span-3"
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Points</Label>
                <Input
                  className="col-span-3"
                  type="number"
                  placeholder="50"
                  value={newTask.points}
                  onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Difficulty</Label>
                <Select
                  value={newTask.difficulty}
                  onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setNewTask({ ...newTask, difficulty: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Verification</Label>
                <Select
                  value={newTask.verification_type}
                  onValueChange={(value: 'Automatic' | 'Manual') => setNewTask({ ...newTask, verification_type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select verification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Est. Time</Label>
                <Input
                  className="col-span-3"
                  placeholder="5 minutes"
                  value={newTask.estimated_time}
                  onChange={(e) => setNewTask({ ...newTask, estimated_time: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Instructions</Label>
                <Textarea
                  className="col-span-3"
                  placeholder="Detailed instructions for completing the task"
                  value={newTask.instructions || ''}
                  onChange={(e) => setNewTask({ ...newTask, instructions: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask} disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </span>
                ) : (
                  'Create Task'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Update task details and settings.
              </DialogDescription>
            </DialogHeader>
            
            {selectedTask && (
              <div className="grid gap-4 py-3">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Title</Label>
                  <Input
                    className="col-span-3"
                    placeholder="Task title"
                    value={selectedTask.title}
                    onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Description</Label>
                  <Textarea
                    className="col-span-3"
                    placeholder="Task description"
                    value={selectedTask.description}
                    onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Points</Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    placeholder="50"
                    value={selectedTask.points}
                    onChange={(e) => setSelectedTask({ ...selectedTask, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Difficulty</Label>
                  <Select
                    value={selectedTask.difficulty}
                    onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setSelectedTask({ ...selectedTask, difficulty: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Verification</Label>
                  <Select
                    value={selectedTask.verification_type}
                    onValueChange={(value: 'Automatic' | 'Manual') => setSelectedTask({ ...selectedTask, verification_type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select verification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Est. Time</Label>
                  <Input
                    className="col-span-3"
                    placeholder="5 minutes"
                    value={selectedTask.estimated_time || ''}
                    onChange={(e) => setSelectedTask({ ...selectedTask, estimated_time: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Instructions</Label>
                  <Textarea
                    className="col-span-3"
                    placeholder="Detailed instructions for completing the task"
                    value={selectedTask.instructions || ''}
                    onChange={(e) => setSelectedTask({ ...selectedTask, instructions: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <Select
                    value={selectedTask.active ? 'active' : 'inactive'}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, active: value === 'active' })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} disabled={updateTaskMutation.isPending}>
                {updateTaskMutation.isPending ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating...
                  </span>
                ) : (
                  'Update Task'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the task "{selectedTask?.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Dialog open={configureRewardsOpen} onOpenChange={setConfigureRewardsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Configure Reward Settings</DialogTitle>
              <DialogDescription>
                Set global reward points for tasks and referrals.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-3">
              <div className="space-y-4">
                <h3 className="font-semibold">Referral Rewards</h3>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Referral Points</Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    value={globalReferralPoints}
                    onChange={(e) => setGlobalReferralPoints(parseInt(e.target.value) || 10)}
                    min={1}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Influencer Multiplier</Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    value={globalInfluencerMultiplier}
                    onChange={(e) => setGlobalInfluencerMultiplier(parseInt(e.target.value) || 2)}
                    min={1}
                    step={0.1}
                  />
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 mr-2 text-green-500" />
                    <div>
                      <p className="text-sm">Current Reward Structure</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Normal users: {globalReferralPoints} points per referral<br />
                        Influencers: {globalReferralPoints * globalInfluencerMultiplier} points per referral
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigureRewardsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveReferralRewardSettings}>
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default TasksAdminPage;
