
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/lib/toast";
import { fetchTasks, fetchTaskCategories, createTask, updateTask, deleteTask } from "@/lib/api";
import { Task, TaskCategory } from "@/types";
import AdminLayout from "@/components/admin/AdminLayout";
import TaskList from "@/components/admin/tasks/TaskList";
import CreateTaskForm from "@/components/admin/tasks/CreateTaskForm";
import EditTaskForm from "@/components/admin/tasks/EditTaskForm";

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
                <CreateTaskForm
                  categories={categories}
                  onCreateTask={handleCreateTask}
                  isCreating={createTaskMutation.isPending}
                  onCancel={() => setNewTaskDialogOpen(false)}
                />
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
              <TaskList
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onOpenEditDialog={handleOpenEditTaskDialog}
                onDeleteTask={handleDeleteTask}
              />
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
