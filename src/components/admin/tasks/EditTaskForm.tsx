import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskCategory } from "@/types";

interface EditTaskFormProps {
  task: Task;
  categories: TaskCategory[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onClose: () => void;
}

const EditTaskForm = ({ task, categories, onUpdateTask, onClose }: EditTaskFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          defaultValue={task.title}
          onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          defaultValue={task.description}
          onChange={(e) => onUpdateTask(task.id, { description: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select
          value={task.category_id}
          onValueChange={(value) => onUpdateTask(task.id, { category_id: value })}
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
          defaultValue={task.points}
          onChange={(e) => onUpdateTask(task.id, { points: parseInt(e.target.value) })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="difficulty" className="text-right">
          Difficulty
        </Label>
        <Select
          value={task.difficulty}
          onValueChange={(value) => onUpdateTask(task.id, { difficulty: value as "Easy" | "Medium" | "Hard" })}
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
          value={task.verification_type}
          onValueChange={(value) => onUpdateTask(task.id, { verification_type: value as "Automatic" | "Manual" })}
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
        <Label htmlFor="redirect_url" className="text-right">
          Redirect URL
        </Label>
        <Input
          type="url"
          id="redirect_url"
          defaultValue={task.redirect_url || ''}
          onChange={(e) => onUpdateTask(task.id, { redirect_url: e.target.value })}
          className="col-span-3"
          placeholder="https://example.com/task"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="required_media" className="text-right">
          Require Screenshot
        </Label>
        <Switch
          id="required_media"
          checked={task.required_media}
          onCheckedChange={(checked) => onUpdateTask(task.id, { required_media: checked })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="active" className="text-right">
          Active
        </Label>
        <Switch
          id="active"
          checked={task.active}
          onCheckedChange={(checked) => onUpdateTask(task.id, { active: checked })}
        />
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default EditTaskForm;
