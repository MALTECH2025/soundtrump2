
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Calendar, User } from "lucide-react";
import { toast } from "@/lib/toast";
import { fetchPendingSubmissions, reviewTaskSubmission, getScreenshotUrl } from "@/lib/api/tasks";

const TaskSubmissionsPanel = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['pendingSubmissions'],
    queryFn: fetchPendingSubmissions,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ submissionId, decision, notes }: { submissionId: string; decision: 'approve' | 'reject'; notes?: string }) => {
      return reviewTaskSubmission(submissionId, decision, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSubmissions'] });
      setReviewDialogOpen(false);
      setAdminNotes("");
      toast.success("Submission reviewed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to review submission");
    }
  });

  const handleReview = (decision: 'approve' | 'reject') => {
    if (!selectedSubmission) return;
    
    reviewMutation.mutate({
      submissionId: selectedSubmission.id,
      decision,
      notes: adminNotes
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Task Submissions</h2>
        <p className="text-muted-foreground">Review and approve user task submissions</p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No pending submissions to review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission: any) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.user_task?.task?.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4" />
                      {submission.user_task?.user?.full_name || submission.user_task?.user?.username || 'Anonymous'}
                      <Calendar className="w-4 h-4 ml-2" />
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {submission.user_task?.task?.points} points
                    </Badge>
                    <Badge variant="secondary">
                      {submission.user_task?.task?.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submission.submission_notes && (
                    <div>
                      <Label className="text-sm font-medium">User Notes:</Label>
                      <p className="text-sm text-gray-600 mt-1">{submission.submission_notes}</p>
                    </div>
                  )}
                  
                  {submission.screenshot_url && (
                    <div>
                      <Label className="text-sm font-medium">Screenshot:</Label>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedImage(getScreenshotUrl(submission.screenshot_url) || '');
                            setImageDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Screenshot
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReviewDialogOpen(true);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setReviewDialogOpen(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              Add notes and approve or reject this task submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add feedback or reasons for your decision..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleReview('approve')}
                disabled={reviewMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReview('reject')}
                disabled={reviewMutation.isPending}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Screenshot Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={selectedImage} 
              alt="Task screenshot" 
              className="max-w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskSubmissionsPanel;
