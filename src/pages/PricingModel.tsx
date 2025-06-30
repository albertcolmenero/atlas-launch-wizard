import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Trash2, X, ArrowRight, Calendar, Clock, RefreshCw, Settings2, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PricingModelAnalytics } from "@/components/pricing/PricingModelAnalytics";
import { PricingPlanFeatures } from "@/components/pricing/PricingPlanFeatures";
import { PricingPlanSettings } from "@/components/pricing/PricingPlanSettings";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define a TypeScript type for Plan and Feature
type FeatureType = {
  name: string;
  type: "boolean" | "limit";
  limit?: string;
  id?: string;
};

type PlanType = {
  name: string;
  price: string;
  planType: "free" | "paid" | "custom";
  features: FeatureType[];
  trialAvailable?: boolean;
  trialDays?: number;
  defaultOnCancel?: boolean;
  monthlyRevenue?: number;
  id?: string;
};

const PricingModel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("plans");
  
  // Load pricing model from localStorage or use default
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [sharedFeatures, setSharedFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  
  // Analytics mock data
  const [analytics, setAnalytics] = useState({
    customersPerPlan: [12, 45, 8],
    churnRate: [1.2, 3.5, 4.8],
    monthlyRevenue: [0, 3555, 12000],
    conversionRates: [
      { from: 0, to: 1, rate: 8.5 },
      { from: 1, to: 2, rate: 4.2 }
    ]
  });
  
  useEffect(() => {
    // Load pricing model from localStorage
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        
        if (parsedData.pricingModel && parsedData.pricingModel.plans) {
          setPlans(parsedData.pricingModel.plans.map((plan: PlanType, index: number) => ({
            ...plan,
            id: plan.id || `plan-${index}`,
            trialAvailable: plan.trialAvailable || false,
            trialDays: plan.trialDays || 14,
            defaultOnCancel: plan.defaultOnCancel || false,
            monthlyRevenue: plan.planType === 'paid' ? 
              parseInt(plan.price || '0') * (analytics.customersPerPlan[parsedData.pricingModel.plans.indexOf(plan)] || 0) : 0
          })));
          
          // Extract all feature names to create shared features list
          const allFeatureNames = new Set<string>();
          parsedData.pricingModel.plans.forEach((plan: PlanType) => {
            plan.features.forEach(feature => {
              allFeatureNames.add(feature.name);
            });
          });
          
          setSharedFeatures(Array.from(allFeatureNames));
        } else {
          // If no pricing model, create a default one
          initializeDefaultPricing();
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        initializeDefaultPricing();
      }
    } else {
      initializeDefaultPricing();
    }
  }, []);
  
  const initializeDefaultPricing = () => {
    const defaultPlans: PlanType[] = [
      {
        id: "basic-plan",
        name: "Basic plan",
        price: "10",
        planType: "paid",
        features: [
          { name: "Basic entitlement", type: "boolean", id: "basic-entitlement" },
          { name: "Pro entitlement", type: "boolean", id: "pro-entitlement" },
          { name: "Enterprise entitlement", type: "boolean", id: "enterprise-entitlement" },
        ],
        trialAvailable: false,
        defaultOnCancel: true,
        monthlyRevenue: 0
      },
      {
        id: "pro-plan",
        name: "Pro plan",
        price: "20",
        planType: "paid",
        features: [
          { name: "Basic entitlement", type: "boolean", id: "basic-entitlement" },
          { name: "Pro entitlement", type: "boolean", id: "pro-entitlement" },
          { name: "Enterprise entitlement", type: "boolean", id: "enterprise-entitlement" },
        ],
        trialAvailable: true,
        trialDays: 14,
        monthlyRevenue: 3555
      },
      {
        id: "enterprise-plan",
        name: "Enterprise plan",
        price: "30",
        planType: "paid",
        features: [
          { name: "Basic entitlement", type: "boolean", id: "basic-entitlement" },
          { name: "Pro entitlement", type: "boolean", id: "pro-entitlement" },
          { name: "Enterprise entitlement", type: "boolean", id: "enterprise-entitlement" },
        ],
        trialAvailable: false,
        monthlyRevenue: 12000
      }
    ];
    
    setPlans(defaultPlans);
    setSharedFeatures(["Basic entitlement", "Pro entitlement", "Enterprise entitlement"]);
  };

  const savePricingModel = () => {
    try {
      // Get existing user data
      const storedUserData = localStorage.getItem('userData');
      const userData = storedUserData ? JSON.parse(storedUserData) : {};
      
      // Update pricing model
      userData.pricingModel = {
        type: "manual",
        plans: plans
      };
      
      // Save back to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      toast({
        title: "Pricing model saved",
        description: "Your pricing model has been updated."
      });
    } catch (error) {
      console.error("Error saving pricing model:", error);
      toast({
        title: "Error saving pricing model",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const addNewPlan = () => {
    // Create a new plan with the shared features
    const newPlan: PlanType = {
      id: `plan-${plans.length + 1}`,
      name: `Plan ${plans.length + 1}`,
      price: "",
      planType: "paid",
      features: sharedFeatures.map(feature => {
        return { 
          name: feature, 
          type: "boolean",
          id: feature.toLowerCase().replace(/\s+/g, '-')
        };
      }),
      trialAvailable: false,
      trialDays: 14,
      monthlyRevenue: 0
    };
    
    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
  };
  
  const removePlan = (index: number) => {
    const updatedPlans = [...plans];
    updatedPlans.splice(index, 1);
    setPlans(updatedPlans);
  };
  
  const updatePlan = (index: number, field: string, value: any) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setPlans(updatedPlans);
  };
  
  const updatePlanType = (index: number, planType: "free" | "paid" | "custom") => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { 
      ...updatedPlans[index], 
      planType,
      // Reset price for free and custom plans
      price: planType === "free" ? "0" : planType === "custom" ? "" : updatedPlans[index].price
    };
    setPlans(updatedPlans);
  };
  
  const addFeatureToAllPlans = () => {
    if (!newFeature.trim()) return;
    
    // Add to shared features
    if (!sharedFeatures.includes(newFeature)) {
      setSharedFeatures([...sharedFeatures, newFeature]);
    }
    
    // Add to all plans
    const updatedPlans = plans.map(plan => {
      if (!plan.features.some(f => f.name === newFeature)) {
        return {
          ...plan,
          features: [...plan.features, { 
            name: newFeature, 
            type: "boolean" as const,
            id: newFeature.toLowerCase().replace(/\s+/g, '-')
          }]
        };
      }
      return plan;
    });
    
    setPlans(updatedPlans);
    setNewFeature("");
    
    toast({
      title: "Feature added",
      description: `${newFeature} has been added to all plans.`
    });
  };
  
  const removeFeature = (featureName: string) => {
    // Remove from all plans
    const updatedPlans = plans.map(plan => ({
      ...plan,
      features: plan.features.filter(f => f.name !== featureName)
    }));
    
    // Remove from shared features
    const updatedSharedFeatures = sharedFeatures.filter(f => f !== featureName);
    
    setPlans(updatedPlans);
    setSharedFeatures(updatedSharedFeatures);
    
    toast({
      title: "Feature removed",
      description: `${featureName} has been removed from all plans.`
    });
  };

  const toggleFeatureForPlan = (planIndex: number, featureName: string) => {
    const updatedPlans = [...plans];
    const plan = updatedPlans[planIndex];
    const featureIndex = plan.features.findIndex(f => f.name === featureName);
    
    if (featureIndex >= 0) {
      // Feature exists, toggle its type between boolean and disabled
      const currentFeature = plan.features[featureIndex];
      if (currentFeature.type === "boolean") {
        // Remove the feature (set to disabled/X)
        plan.features.splice(featureIndex, 1);
      }
    } else {
      // Feature doesn't exist, add it
      plan.features.push({
        name: featureName,
        type: "boolean",
        id: featureName.toLowerCase().replace(/\s+/g, '-')
      });
    }
    
    setPlans(updatedPlans);
  };

  const isPlanFeatureEnabled = (planIndex: number, featureName: string) => {
    const plan = plans[planIndex];
    return plan.features.some(f => f.name === featureName && f.type === "boolean");
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Pricing Model
            <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">📋</span>
            </div>
          </h1>
          <p className="text-gray-500">Configure and manage your subscription plans</p>
        </div>
        <Button variant="outline" className="text-gray-400">
          Publish changes to production
        </Button>
      </div>
      
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="features">Manage Features</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="mt-6">
            {/* Main Pricing Table */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Plan Headers */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div></div> {/* Empty cell for feature names column */}
                    {plans.map((plan, index) => (
                      <div key={plan.id} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <div className="space-y-2">
                                <Input
                                  placeholder="Plan name"
                                  value={plan.name}
                                  onChange={(e) => updatePlan(index, 'name', e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <span className="text-sm">$</span>
                                  <Input
                                    placeholder="Price"
                                    value={plan.price}
                                    onChange={(e) => updatePlan(index, 'price', e.target.value)}
                                  />
                                  <span className="text-sm text-gray-500">/ month</span>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removePlan(index)}
                                  className="w-full"
                                >
                                  Delete Plan
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{plan.name}</p>
                        <div className="text-xl font-bold text-purple-500">
                          ${plan.price} <span className="text-sm text-gray-500">/ month</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features Grid */}
                  <div className="space-y-4">
                    {sharedFeatures.map((feature, featureIndex) => (
                      <div key={feature} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{feature}</div>
                            <div className="text-sm text-gray-500">
                              ID: {feature.toLowerCase().replace(/\s+/g, '-')}
                            </div>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFeature(feature)}
                                className="w-full"
                              >
                                Remove Feature
                              </Button>
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        {plans.map((plan, planIndex) => (
                          <div key={`${plan.id}-${feature}`} className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleFeatureForPlan(planIndex, feature)}
                            >
                              {isPlanFeatureEnabled(planIndex, feature) ? (
                                <Check className="h-5 w-5 text-purple-500" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Add New Feature Button */}
                  <div className="flex justify-center pt-4 border-t">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add New Feature
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Add a new feature</h4>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Feature name"
                              value={newFeature}
                              onChange={(e) => setNewFeature(e.target.value)}
                              className="flex-grow"
                            />
                            <Button
                              onClick={addFeatureToAllPlans}
                              disabled={!newFeature.trim()}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Create New Plan Button */}
                <div className="flex justify-end mt-6">
                  <Button onClick={addNewPlan} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create new plan
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6">
              <Button onClick={savePricingModel} className="px-8">
                Save Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="mt-6">
            {/* Feature Management */}
            <Card>
              <CardHeader>
                <CardTitle>Manage Features</CardTitle>
                <CardDescription>Features will be available across all plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input 
                    placeholder="Add a new feature (e.g., API Access, Support)"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    onClick={addFeatureToAllPlans}
                    disabled={!newFeature.trim()}
                    className="flex-shrink-0"
                  >
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2">Current Features:</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature Name</TableHead>
                        <TableHead>Plans</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sharedFeatures.map((feature, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{feature}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {plans.filter(plan => plan.features.some(f => f.name === feature)).map((plan, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{plan.name}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFeature(feature)}
                              className="h-7 w-7 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {sharedFeatures.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                            No features added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <PricingModelAnalytics plans={plans} analytics={analytics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PricingModel;
