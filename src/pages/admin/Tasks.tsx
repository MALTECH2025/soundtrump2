
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";
import { 
  CheckCircle2, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Clock 
} from "lucide-react";
import { AnimatedTransition } from "@/components/ui/AnimatedTransition";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const TasksAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["admin-tasks"],
    queryFn: fetchTasks,
  });
  
  const filteredTasks = tasks?.filter((task: Task) => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AdminLayout>
      <AnimatedTransition>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Tasks Management</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading tasks...
                    </TableCell>
                  </TableRow>
                ) : filteredTasks?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No tasks found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks?.map((task: Task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {task.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.category?.name || "Uncategorized"}
                      </TableCell>
                      <TableCell>{task.points}</TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.active ? "default" : "outline"}>
                          {task.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AnimatedTransition>
    </AdminLayout>
  );
};

export default TasksAdmin;
