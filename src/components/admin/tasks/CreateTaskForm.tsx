
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskCategory } from "@/types";
import { toast } from "@/lib/toast";
import { Upload, X, Loader2 } from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    if (!formData.category_id) {
      toast.error("Category is required");
      return;
    }

    if (formData.points <= 0) {
      toast.error("Points must be greater than 0");
      return;
    }

    // Set uploading state
    setIsUploading(true);
    
    try {
      await onCreateTask({
        ...formData,
        image: taskImage || undefined,
      });
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        category_id: '',
        points: 10,
        difficulty: 'Easy',
        active: true,
        verification_type: 'Automatic',
        redirect_url: '',
        required_media: false,
        instructions: '',
        estimated_time: '',
        duration: 24,
      });
      setTaskImage(null);
      removeImage();
    } catch (error) {
      console.error('Task creation error:', error);
    } finally {
      setIsUploading(false);
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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Information - Mobile Stacked */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select 
              value={formData.category_id} 
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger className="w-full">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what users need to do"
            rows={3}
            className="w-full resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions" className="text-sm font-medium">
            Detailed Instructions
          </Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Provide step-by-step instructions for completing this task"
            rows={4}
            className="w-full resize-none"
          />
        </div>
        
        {/* Task Image Upload - Mobile Optimized */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Task Image</Label>
          {previewUrl ? (
            <div className="relative inline-block w-full max-w-xs">
              <img 
                src={previewUrl} 
                alt="Task preview" 
                className="w-full h-32 sm:h-40 object-cover rounded-lg border"
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
              <div className="text-center">
                <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
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

        {/* Task Settings - Mobile Stacked */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="points" className="text-sm font-medium">
              Points Reward *
            </Label>
            <Input
              type="number"
              id="points"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              min="1"
              max="1000"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration (hours)
            </Label>
            <Input
              type="number"
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 24 })}
              min="1"
              max="168"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_time" className="text-sm font-medium">
              Estimated Time
            </Label>
            <Input
              type="text"
              id="estimated_time"
              value={formData.estimated_time}
              onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
              placeholder="e.g., 30 minutes"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty Level
            </Label>
            <Select 
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value as "Easy" | "Medium" | "Hard" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verification_type" className="text-sm font-medium">
              Verification Type
            </Label>
            <Select 
              value={formData.verification_type}
              onValueChange={(value) => setFormData({ ...formData, verification_type: value as "Automatic" | "Manual" })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select verification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="redirect_url" className="text-sm font-medium">
            Task URL (Optional)
          </Label>
          <Input
            type="url"
            id="redirect_url"
            value={formData.redirect_url}
            onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
            placeholder="https://example.com/task-link"
            className="w-full"
          />
        </div>

        {/* Toggle Settings - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="required_media" className="text-sm font-medium">
                Require Screenshot Submission
              </Label>
              <p className="text-xs text-gray-500">Users must upload a screenshot to complete this task</p>
            </div>
            <Switch
              id="required_media"
              checked={formData.required_media}
              onCheckedChange={(checked) => setFormData({ ...formData, required_media: checked })}
            />
          </div>
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="active" className="text-sm font-medium">
                Active Task
              </Label>
              <p className="text-xs text-gray-500">Make this task available to users immediately</p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>
        </div>

        {/* Form Actions - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto order-2 sm:order-1"
            disabled={isCreating || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isCreating || isUploading}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isCreating || isUploading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Creating Task...'}
              </>
            ) : (
              'Create Task'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;
