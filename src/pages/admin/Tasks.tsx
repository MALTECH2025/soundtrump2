
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Trash2, Plus, Loader2 } from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const queryClient = useQueryClient();

  // Fetch tasks with better error handling
  const { isLoading: isTasksLoading, error: tasksError, data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
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
    staleTime: 300000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData as TaskCategory[]);
    }
  }, [categoriesData]);

  // Create task mutation with optimistic updates
  const createTaskMutation = useMutation({
    mutationFn: async (task: any) => {
      return await createTask(task as Task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Task created successfully!");
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

  if (isTasksLoading || isCategoriesLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (tasksError) return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: {(tasksError as Error).message}</div>
      </div>
    </AdminLayout>
  );

  if (categoriesError) return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: {(categoriesError as Error).message}</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Tasks & Rewards Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Manage tasks, review submissions, and create rewards for users.
              </p>
            </div>
            <Button
              onClick={handleCleanupExpiredTasks}
              disabled={cleanupMutation.isPending}
              variant="outline"
              size="sm"
              className="gap-2 w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" />
              {cleanupMutation.isPending ? "Cleaning..." : "Cleanup Expired"}
            </Button>
          </div>

          <Tabs defaultValue="submissions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="submissions" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                Submissions
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="rewards" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                Rewards
              </TabsTrigger>
              <TabsTrigger value="create" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">Create</span>
                <span className="sm:hidden">New</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Pending Task Submissions</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Review and approve user task submissions that require manual verification.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <TaskSubmissionsPanel />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Task Management</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Manage all available tasks for users.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <TaskList
                    tasks={tasks}
                    onUpdateTask={handleUpdateTask}
                    onOpenEditDialog={handleOpenEditTaskDialog}
                    onDeleteTask={handleDeleteTask}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Rewards Management</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Create and manage rewards that users can redeem with their ST.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <RewardsManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Create New Task</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Add a new task for users to complete and earn ST.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription className="text-sm">
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
