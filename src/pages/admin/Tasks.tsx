
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ListChecks, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  FileCog 
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import { Task } from '@/types';

const TasksManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['admin', 'tasks'],
    queryFn: fetchTasks
  });
  
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] });
      toast.success('Task deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to delete task');
      console.error(error);
    }
  });
  
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string, data: Partial<Task> }) => 
      updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tasks'] });
      toast.success('Task updated successfully');
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update task');
      console.error(error);
    }
  });
  
  const handleToggleActiveStatus = (task: Task) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      data: { active: !task.active }
    });
  };
  
  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTaskMutation.mutate(selectedTask.id);
    }
  };
  
  const filteredTasks = tasks.filter((task: Task) => {
    if (showActiveOnly && !task.active) return false;
    
    const searchTerms = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchTerms) ||
      task.description.toLowerCase().includes(searchTerms) ||
      (task.category?.name.toLowerCase().includes(searchTerms) || false)
    );
  });
  
  return (
    <AdminLayout title="Tasks Management" description="Manage tasks and challenges">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Tasks</CardTitle>
              <CardDescription>Manage tasks and challenges</CardDescription>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Button onClick={() => console.log('Create new task')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={showActiveOnly ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowActiveOnly(true)}
              >
                Active
              </Button>
              <Button 
                variant={!showActiveOnly ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowActiveOnly(false)}
              >
                All
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-sound-medium border-t-sound-light rounded-full animate-spin"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <p className="text-center py-4 text-muted-foreground">No tasks found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task: Task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {task.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{task.points}</TableCell>
                      <TableCell>
                        {task.category ? (
                          <Badge variant="outline">{task.category.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            task.difficulty === 'Easy' 
                              ? 'outline' 
                              : task.difficulty === 'Medium' 
                                ? 'default' 
                                : 'destructive'
                          }
                        >
                          {task.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.active ? 'success' : 'secondary'}>
                          {task.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleToggleActiveStatus(task)}
                          >
                            {task.active ? (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the task "{selectedTask?.title}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog - Just a placeholder, would need a full form */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <p>
            Task editor would go here with fields for title, description, points, etc.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TasksManagement;
