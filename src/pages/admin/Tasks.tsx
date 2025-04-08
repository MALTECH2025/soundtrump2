import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTasks, 
  fetchTaskCategories, 
  createTask, 
  updateTask, 
  deleteTask 
} from "@/lib/api";
import { Task, TaskCategory } from "@/types";
import AdminLayout from "@/components/admin/AdminLayout";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    category_id: '',
    points: 10,
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    active: true,
    verification_type: 'Automatic' as 'Automatic' | 'Manual',
    required_media: false,
  });

  const queryClient = useQueryClient();

  const { isLoading: isTasksLoading, error: tasksError, data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData as Task[]);
    }
  }, [tasksData]);

  const { isLoading: isCategoriesLoading, error: categoriesError, data: categoriesData } = useQuery({
    queryKey: ['taskCategories'],
    queryFn: fetchTaskCategories,
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData as TaskCategory[]);
    }
  }, [categoriesData]);

  const createTaskMutation = useMutation({
    mutationFn: async (task: any) => {
      return await createTask(task as Task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskDialogOpen(false);
      resetNewTaskForm();
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating task:", error);
      toast.error(error.message || "Failed to create task");
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      return await updateTask({ taskId, updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditTaskDialogOpen(false);
      toast.success("Task updated successfully");
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task deleted successfully");
    }
  });

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({ taskId, updates });
  };

  const handleCreateTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newTaskForm.title) {
      toast.error("Title is required");
      return;
    }
    
    if (!newTaskForm.description) {
      toast.error("Description is required");
      return;
    }
    
    if (!newTaskForm.category_id) {
      toast.error("Category is required");
      return;
    }

    if (newTaskForm.difficulty && ['Easy', 'Medium', 'Hard'].includes(newTaskForm.difficulty)) {
      console.log("Creating task with data:", newTaskForm);
      createTaskMutation.mutate(newTaskForm);
    } else {
      toast.error("Invalid difficulty value");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleOpenEditTaskDialog = (task: Task) => {
    setSelectedTask(task);
    setEditTaskDialogOpen(true);
  };

  const resetNewTaskForm = () => {
    setNewTaskForm({
      title: '',
      description: '',
      category_id: '',
      points: 10,
      difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
      active: true,
      verification_type: 'Automatic' as 'Automatic' | 'Manual',
      required_media: false,
    });
  };

  if (isTasksLoading || isCategoriesLoading) return <div>Loading...</div>;
  if (tasksError) return <div>Error: {tasksError.message}</div>;
  if (categoriesError) return <div>Error: {categoriesError.message}</div>;

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground">
                Manage and create tasks for users to complete.
              </p>
            </div>
            <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Task</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task for users to complete.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTask}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        type="text"
                        id="title"
                        value={newTaskForm.title}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newTaskForm.description}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select 
                        value={newTaskForm.category_id} 
                        onValueChange={(value) => setNewTaskForm({ ...newTaskForm, category_id: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="points" className="text-right">
                        Points
                      </Label>
                      <Input
                        type="number"
                        id="points"
                        value={newTaskForm.points}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, points: parseInt(e.target.value) })}
                        className="col-span-3"
                        min="1"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="difficulty" className="text-right">
                        Difficulty
                      </Label>
                      <Select 
                        value={newTaskForm.difficulty}
                        onValueChange={(value) => setNewTaskForm({ ...newTaskForm, difficulty: value as "Easy" | "Medium" | "Hard" })}
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
                      <Label htmlFor="verification_type" className="text-right">
                        Verification Type
                      </Label>
                      <Select 
                        value={newTaskForm.verification_type}
                        onValueChange={(value) => setNewTaskForm({ ...newTaskForm, verification_type: value as "Automatic" | "Manual" })}
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
                      <Label htmlFor="active" className="text-right">
                        Active
                      </Label>
                      <Switch
                        id="active"
                        checked={newTaskForm.active}
                        onCheckedChange={(checked) => setNewTaskForm({ ...newTaskForm, active: checked })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="required_media" className="text-right">
                        Required Media
                      </Label>
                      <Switch
                        id="required_media"
                        checked={newTaskForm.required_media}
                        onCheckedChange={(checked) => setNewTaskForm({ ...newTaskForm, required_media: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setNewTaskDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createTaskMutation.isPending}
                    >
                      {createTaskMutation.isPending ? 'Creating...' : 'Create'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
              <CardDescription>
                A list of all available tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                          onValueChange={(value) => handleUpdateTask(task.id, { difficulty: value as "Easy" | "Medium" | "Hard" })}
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
                          onCheckedChange={(checked) => handleUpdateTask(task.id, { active: checked })}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEditTaskDialog(task)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Dialog open={editTaskDialogOpen} onOpenChange={setEditTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Edit the details of the selected task.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedTask && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    defaultValue={selectedTask.title}
                    onChange={(e) => handleUpdateTask(selectedTask.id, { title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    defaultValue={selectedTask.description}
                    onChange={(e) => handleUpdateTask(selectedTask.id, { description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={selectedTask.category_id}
                    onValueChange={(value) => handleUpdateTask(selectedTask.id, { category_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="points" className="text-right">
                    Points
                  </Label>
                  <Input
                    type="number"
                    id="points"
                    defaultValue={selectedTask.points}
                    onChange={(e) => handleUpdateTask(selectedTask.id, { points: parseInt(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="difficulty" className="text-right">
                    Difficulty
                  </Label>
                  <Select
                    value={selectedTask.difficulty}
                    onValueChange={(value) => handleUpdateTask(selectedTask.id, { difficulty: value as "Easy" | "Medium" | "Hard" })}
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
                  <Label htmlFor="verification_type" className="text-right">
                    Verification Type
                  </Label>
                  <Select
                    value={selectedTask.verification_type}
                    onValueChange={(value) => handleUpdateTask(selectedTask.id, { verification_type: value as "Automatic" | "Manual" })}
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
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <Switch
                    id="active"
                    checked={selectedTask.active}
                    onCheckedChange={(checked) => handleUpdateTask(selectedTask.id, { active: checked })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="required_media" className="text-right">
                    Required Media
                  </Label>
                  <Switch
                    id="required_media"
                    checked={selectedTask.required_media}
                    onCheckedChange={(checked) => handleUpdateTask(selectedTask.id, { required_media: checked })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setEditTaskDialogOpen(false)}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Tasks;
