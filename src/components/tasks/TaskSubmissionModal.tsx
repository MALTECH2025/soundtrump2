
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, ExternalLink } from "lucide-react";
import { toast } from "@/lib/toast";
import { submitTask } from "@/lib/api/tasks";
import { Task, UserTask } from "@/types";

interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  userTask: UserTask;
  onSuccess: () => void;
}

const TaskSubmissionModal = ({ isOpen, onClose, task, userTask, onSuccess }: TaskSubmissionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task.required_media && !screenshot) {
      toast.error("Screenshot is required for this task");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitTask(userTask.id, {
        screenshot: screenshot || undefined,
        notes: notes || undefined
      });
      
      toast.success("Task submitted for review!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setScreenshot(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Task</DialogTitle>
          <DialogDescription>
            Complete the task and submit your proof for admin review.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {task.redirect_url && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <Label className="text-sm font-medium">Task Instructions:</Label>
              <p className="text-sm text-gray-600 mb-2">{task.instructions || task.description}</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => window.open(task.redirect_url, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Task
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {task.verification_type === "Manual" && (
              <div>
                <Label htmlFor="screenshot">
                  Screenshot {task.required_media ? "(Required)" : "(Optional)"}
                </Label>
                <div className="mt-1">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {screenshot && (
                    <p className="text-sm text-green-600 mt-1">
                      <Upload className="w-4 h-4 inline mr-1" />
                      {screenshot.name}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information about your task completion..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Task"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskSubmissionModal;
