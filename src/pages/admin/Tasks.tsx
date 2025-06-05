import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/lib/toast";
import { fetchTasks, fetchTaskCategories, createTask, updateTask, deleteTask, cleanupExpiredTasks } from "@/lib/api/tasks";
import { Task, TaskCategory } from "@/types";
import AdminLayout from "@/components/admin/AdminLayout";
import TaskList from "@/components/admin/tasks/TaskList";
import CreateTaskForm from "@/components/admin/tasks/CreateTaskForm";
import EditTaskForm from "@/components/admin/tasks/EditTaskForm";
import TaskSubmissionsPanel from "@/components/admin/tasks/TaskSubmissionsPanel";
import RewardsManager from "@/components/admin/rewards/RewardsManager";
import { Trash2 } from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const queryClient = useQueryClient();

  // Fetch tasks
  const { isLoading: isTasksLoading, error: tasksError, data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData as Task[]);
    }
  }, [tasksData]);

  // Fetch task categories
  const { isLoading: isCategoriesLoading, error: categoriesError, data: categoriesData } = useQuery({
    queryKey: ['taskCategories'],
    queryFn: fetchTaskCategories,
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData as TaskCategory[]);
    }
  }, [categoriesData]);

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (task: any) => {
      return await createTask(task as Task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskDialogOpen(false);
      toast.success("Task created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating task:", error);
      toast.error(error.message || "Failed to create task");
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) => {
      return await updateTask({ taskId, updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditTaskDialogOpen(false);
      toast.success("Task updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating task:", error);
      toast.error(error.message || "Failed to update task");
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting task:", error);
      toast.error(error.message || "Failed to delete task");
    }
  });

  // Cleanup expired tasks mutation
  const cleanupMutation = useMutation({
    mutationFn: cleanupExpiredTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Expired tasks cleaned up successfully");
    },
    onError: (error: any) => {
      console.error("Error cleaning up tasks:", error);
      toast.error(error.message || "Failed to clean up expired tasks");
    }
  });

  // Event handlers
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTaskMutation.mutate({ taskId, updates });
  };

  const handleCreateTask = (task: Partial<Task>) => {
    createTaskMutation.mutate(task);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleOpenEditTaskDialog = (task: Task) => {
    setSelectedTask(task);
    setEditTaskDialogOpen(true);
  };

  const handleCleanupExpiredTasks = () => {
    cleanupMutation.mutate();
  };

  if (isTasksLoading || isCategoriesLoading) return <div>Loading...</div>;
  if (tasksError) return <div>Error: {(tasksError as Error).message}</div>;
  if (categoriesError) return <div>Error: {(categoriesError as Error).message}</div>;

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
              <h1 className="text-3xl font-bold tracking-tight">Tasks & Rewards Management</h1>
              <p className="text-muted-foreground">
                Manage tasks, review submissions, and create rewards for users.
              </p>
            </div>
            <Button
              onClick={handleCleanupExpiredTasks}
              disabled={cleanupMutation.isPending}
              variant="outline"
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {cleanupMutation.isPending ? "Cleaning..." : "Cleanup Expired Tasks"}
            </Button>
          </div>

          <Tabs defaultValue="submissions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="submissions">Pending Submissions</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="create">Create Task</TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Task Submissions</CardTitle>
                  <CardDescription>
                    Review and approve user task submissions that require manual verification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskSubmissionsPanel />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>
                    Manage all available tasks for users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList
                    tasks={tasks}
                    onUpdateTask={handleUpdateTask}
                    onOpenEditDialog={handleOpenEditTaskDialog}
                    onDeleteTask={handleDeleteTask}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards Management</CardTitle>
                  <CardDescription>
                    Create and manage rewards that users can redeem with their ST.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RewardsManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Task</CardTitle>
                  <CardDescription>
                    Add a new task for users to complete and earn ST.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateTaskForm
                    categories={categories}
                    onCreateTask={handleCreateTask}
                    isCreating={createTaskMutation.isPending}
                    onCancel={() => {}}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
          {selectedTask && (
            <EditTaskForm
              task={selectedTask}
              categories={categories}
              onUpdateTask={handleUpdateTask}
              onClose={() => setEditTaskDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Tasks;
