
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskCategory } from "@/types";
import { toast } from "@/lib/toast";

interface CreateTaskFormProps {
  categories: TaskCategory[];
  onCreateTask: (task: Partial<Task>) => void;
  isCreating: boolean;
  onCancel: () => void;
}

const CreateTaskForm = ({ categories, onCreateTask, isCreating, onCancel }: CreateTaskFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    points: 10,
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    active: true,
    verification_type: 'Automatic' as 'Automatic' | 'Manual',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    
    if (!formData.description) {
      toast.error("Description is required");
      return;
    }
    
    if (!formData.category_id) {
      toast.error("Category is required");
      return;
    }

    if (formData.difficulty && ['Easy', 'Medium', 'Hard'].includes(formData.difficulty)) {
      onCreateTask(formData);
    } else {
      toast.error("Invalid difficulty value");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Select 
            value={formData.category_id} 
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
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
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
            className="col-span-3"
            min="1"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="difficulty" className="text-right">
            Difficulty
          </Label>
          <Select 
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value as "Easy" | "Medium" | "Hard" })}
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
            value={formData.verification_type}
            onValueChange={(value) => setFormData({ ...formData, verification_type: value as "Automatic" | "Manual" })}
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
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
