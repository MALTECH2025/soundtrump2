
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskCategory } from "@/types";
import { toast } from "@/lib/toast";
import { Upload, X } from "lucide-react";

interface CreateTaskFormProps {
  categories: TaskCategory[];
  onCreateTask: (task: Partial<Task> & { image?: File; duration?: number }) => void;
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
    redirect_url: '',
    required_media: false,
    instructions: '',
    estimated_time: '',
    duration: 24, // Default 24 hours
  });
  
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      onCreateTask({
        ...formData,
        image: taskImage || undefined,
      });
    } else {
      toast.error("Invalid difficulty value");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setTaskImage(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setTaskImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
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
          <Label htmlFor="instructions" className="text-right">
            Instructions
          </Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className="col-span-3"
            placeholder="Detailed instructions for completing this task..."
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="task-image" className="text-right">
            Task Image
          </Label>
          <div className="col-span-3">
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Task preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <Label htmlFor="task-image" className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-500">
                        Upload task image
                      </span>
                    </Label>
                    <Input
                      id="task-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            )}
          </div>
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
          <Label htmlFor="duration" className="text-right">
            Duration (hours)
          </Label>
          <Input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 24 })}
            className="col-span-3"
            min="1"
            max="168"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="estimated_time" className="text-right">
            Estimated Time
          </Label>
          <Input
            type="text"
            id="estimated_time"
            value={formData.estimated_time}
            onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
            className="col-span-3"
            placeholder="e.g., 30 minutes, 1 hour"
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
          <Label htmlFor="redirect_url" className="text-right">
            Redirect URL
          </Label>
          <Input
            type="url"
            id="redirect_url"
            value={formData.redirect_url}
            onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
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
            checked={formData.required_media}
            onCheckedChange={(checked) => setFormData({ ...formData, required_media: checked })}
          />
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
