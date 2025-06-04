
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/lib/toast";
import { fetchRewards, createReward, updateReward, deleteReward } from "@/lib/api/rewards";
import { Plus, Edit, Trash2, Gift } from "lucide-react";

const RewardsManager = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points_cost: '',
    quantity: '',
    image_url: '',
    expires_at: ''
  });

  const queryClient = useQueryClient();

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['adminRewards'],
    queryFn: fetchRewards,
  });

  const createMutation = useMutation({
    mutationFn: createReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      setCreateDialogOpen(false);
      setNewReward({ name: '', description: '', points_cost: '', quantity: '', image_url: '', expires_at: '' });
      toast.success("Reward created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create reward");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateReward(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      setEditDialogOpen(false);
      toast.success("Reward updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update reward");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewards'] });
      toast.success("Reward deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete reward");
    }
  });

  const handleCreateReward = () => {
    const rewardData = {
      name: newReward.name,
      description: newReward.description,
      points_cost: parseInt(newReward.points_cost),
      quantity: newReward.quantity ? parseInt(newReward.quantity) : null,
      image_url: newReward.image_url || null,
      expires_at: newReward.expires_at || null
    };

    createMutation.mutate(rewardData);
  };

  const handleUpdateReward = (updates: any) => {
    if (!selectedReward) return;
    updateMutation.mutate({ id: selectedReward.id, updates });
  };

  const handleToggleActive = (reward: any) => {
    updateMutation.mutate({ 
      id: reward.id, 
      updates: { active: !reward.active }
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading rewards...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rewards Management</h2>
          <p className="text-muted-foreground">Create and manage rewards for users to redeem</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Reward</DialogTitle>
              <DialogDescription>
                Add a new reward for users to redeem with their ST.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Reward Name</Label>
                <Input
                  id="name"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  placeholder="Concert Pre-sale Access"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  placeholder="Early access to concert tickets..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="points_cost">ST Cost</Label>
                  <Input
                    id="points_cost"
                    type="number"
                    value={newReward.points_cost}
                    onChange={(e) => setNewReward({ ...newReward, points_cost: e.target.value })}
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="quantity">Quantity (optional)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newReward.quantity}
                    onChange={(e) => setNewReward({ ...newReward, quantity: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  value={newReward.image_url}
                  onChange={(e) => setNewReward({ ...newReward, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="expires_at">Expiry Date (optional)</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={newReward.expires_at}
                  onChange={(e) => setNewReward({ ...newReward, expires_at: e.target.value })}
                />
              </div>
              
              <Button 
                onClick={handleCreateReward} 
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Reward'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {rewards.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No rewards created yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first reward to get started
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Reward
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rewards.map((reward: any) => (
            <Card key={reward.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {reward.name}
                      {!reward.active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-sound-light">
                      {reward.points_cost} ST
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Quantity: {reward.quantity === null ? 'Unlimited' : reward.quantity}
                    </span>
                    {reward.expires_at && (
                      <span>
                        Expires: {new Date(reward.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${reward.id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`active-${reward.id}`}
                        checked={reward.active}
                        onCheckedChange={() => handleToggleActive(reward)}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReward(reward);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(reward.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsManager;
