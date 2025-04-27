import { useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Check } from "lucide-react";

// Mock pricing plans data
const initialPlans = [
  {
    id: 1,
    name: "Basic",
    price: "$9.99",
    description: "Perfect for small businesses",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3"
    ],
    popular: false
  },
  {
    id: 2,
    name: "Premium",
    price: "$19.99",
    description: "Great for growing businesses",
    features: [
      "Everything in Basic",
      "Feature 4",
      "Feature 5",
      "Feature 6"
    ],
    popular: true
  },
  {
    id: 3,
    name: "Enterprise",
    price: "$49.99",
    description: "For large organizations",
    features: [
      "Everything in Premium",
      "Feature 7",
      "Feature 8",
      "Feature 9",
      "Feature 10"
    ],
    popular: false
  }
];

const PricingManagement = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const handleNewPlan = () => {
    setSelectedPlan({
      id: Date.now(),
      name: "",
      price: "",
      description: "",
      features: [],
      popular: false
    });
    setIsEditDialogOpen(true);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan({...plan});
    setIsEditDialogOpen(true);
  };

  const handleDeletePlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeature.trim() !== "") {
      setSelectedPlan({
        ...selectedPlan,
        features: [...selectedPlan.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setSelectedPlan({
      ...selectedPlan,
      features: selectedPlan.features.filter((_: any, i: number) => i !== index)
    });
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (plans.find(p => p.id === selectedPlan.id)) {
      // Update existing plan
      setPlans(plans.map(p => p.id === selectedPlan.id ? selectedPlan : p));
    } else {
      // Add new plan
      setPlans([...plans, selectedPlan]);
    }
    
    toast({
      title: "Plan saved",
      description: `${selectedPlan.name} plan has been saved successfully.`,
    });
    
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    setPlans(plans.filter(p => p.id !== selectedPlan.id));
    
    toast({
      title: "Plan deleted",
      description: `${selectedPlan.name} plan has been removed successfully.`,
    });
    
    setIsDeleteDialogOpen(false);
  };

  const handleTogglePopular = (planId: number) => {
    setPlans(plans.map(p => ({
      ...p,
      popular: p.id === planId ? true : false
    })));
    
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      toast({
        title: "Popular plan updated",
        description: `${plan.name} is now marked as the popular plan.`,
      });
    }
  };

  return (
    <PageTransition>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pricing Management</h1>
        <Button onClick={handleNewPlan}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`overflow-hidden ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <div className="bg-primary text-primary-foreground py-1 px-3 text-xs text-center">
                Popular Choice
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2 text-2xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground"> /month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-primary mt-1" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col space-y-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditPlan(plan)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit Plan
                </Button>
                {!plan.popular && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTogglePopular(plan.id)}
                  >
                    Mark as Popular
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeletePlan(plan)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.name ? `Edit ${selectedPlan.name} Plan` : "Add New Plan"}</DialogTitle>
            <DialogDescription>
              {selectedPlan?.id 
                ? "Make changes to the pricing plan" 
                : "Create a new pricing plan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePlan}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input 
                  id="name" 
                  value={selectedPlan?.name || ""} 
                  onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  value={selectedPlan?.price || ""} 
                  onChange={(e) => setSelectedPlan({...selectedPlan, price: e.target.value})}
                  required
                  placeholder="$XX.XX"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={selectedPlan?.description || ""} 
                  onChange={(e) => setSelectedPlan({...selectedPlan, description: e.target.value})}
                  placeholder="Short description of this plan"
                />
              </div>
              <div className="grid gap-2">
                <Label>Features</Label>
                <ul className="space-y-2 mb-2">
                  {selectedPlan?.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                      <span className="text-sm">{feature}</span>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-2">
                  <Input 
                    value={newFeature} 
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddFeature}
                    disabled={!newFeature.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pricing Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedPlan?.name}" plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default PricingManagement;
