
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
import { Check, Plus, Trash2, X, ArrowRight, Calendar, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PricingModelAnalytics } from "@/components/pricing/PricingModelAnalytics";
import { PricingPlanFeatures } from "@/components/pricing/PricingPlanFeatures";
import { PricingPlanSettings } from "@/components/pricing/PricingPlanSettings";

// Define a TypeScript type for Plan and Feature
type FeatureType = {
  name: string;
  type: "boolean" | "limit";
  limit?: string;
};

type PlanType = {
  name: string;
  price: string;
  planType: "free" | "paid" | "custom";
  features: FeatureType[];
  trialAvailable?: boolean;
  trialDays?: number;
  defaultOnCancel?: boolean;
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
          setPlans(parsedData.pricingModel.plans.map((plan: PlanType) => ({
            ...plan,
            trialAvailable: plan.trialAvailable || false,
            trialDays: plan.trialDays || 14,
            defaultOnCancel: plan.defaultOnCancel || false
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
        name: "Basic",
        price: "0",
        planType: "free",
        features: [
          { name: "Core Features", type: "boolean" },
          { name: "Users", type: "limit", limit: "5" },
        ],
        trialAvailable: false,
        defaultOnCancel: true
      },
      {
        name: "Pro",
        price: "79",
        planType: "paid",
        features: [
          { name: "Core Features", type: "boolean" },
          { name: "Users", type: "limit", limit: "20" },
          { name: "API Access", type: "boolean" },
        ],
        trialAvailable: true,
        trialDays: 14
      },
      {
        name: "Enterprise",
        price: "",
        planType: "custom",
        features: [
          { name: "Core Features", type: "boolean" },
          { name: "Users", type: "limit", limit: "Unlimited" },
          { name: "API Access", type: "boolean" },
          { name: "Premium Support", type: "boolean" },
        ],
        trialAvailable: false
      }
    ];
    
    setPlans(defaultPlans);
    setSharedFeatures(["Core Features", "Users", "API Access", "Premium Support"]);
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
      name: `Plan ${plans.length + 1}`,
      price: "",
      planType: "paid",
      features: sharedFeatures.map(feature => {
        return { 
          name: feature, 
          type: feature === "Users" ? "limit" : "boolean", 
          limit: feature === "Users" ? "10" : undefined 
        };
      }),
      trialAvailable: false,
      trialDays: 14
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
          features: [...plan.features, { name: newFeature, type: "boolean" } as FeatureType]
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
  
  const updateFeature = (planIndex: number, featureIndex: number, field: string, value: any) => {
    const updatedPlans = [...plans];
    if (field === 'type') {
      // If changing from boolean to limit, add a default limit
      const updatedFeature = {
        ...updatedPlans[planIndex].features[featureIndex],
        [field]: value,
        limit: value === 'limit' ? '10' : undefined
      };
      updatedPlans[planIndex].features[featureIndex] = updatedFeature;
    } else {
      // Regular update for other fields
      updatedPlans[planIndex].features[featureIndex] = {
        ...updatedPlans[planIndex].features[featureIndex],
        [field]: value
      };
    }
    setPlans(updatedPlans);
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
  
  const setDefaultOnCancelPlan = (planIndex: number) => {
    // Make sure only one plan can be the default
    const updatedPlans = plans.map((plan, idx) => ({
      ...plan,
      defaultOnCancel: idx === planIndex
    }));
    
    setPlans(updatedPlans);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pricing Model</h1>
        <p className="text-gray-500">Configure and manage your subscription plans</p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="mt-6">
            {/* Feature Management */}
            <Card className="mb-6">
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
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium mb-2">Current Features:</h3>
                  <div className="flex flex-wrap gap-2">
                    {sharedFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 flex items-center gap-1">
                        {feature}
                        <button 
                          onClick={() => removeFeature(feature)} 
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    {sharedFeatures.length === 0 && (
                      <p className="text-sm text-gray-500">No features added yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {plans.map((plan, planIndex) => (
                <Card key={planIndex} className={`relative ${selectedPlanIndex === planIndex ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="absolute top-4 right-4 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500"
                        onClick={() => setSelectedPlanIndex(planIndex === selectedPlanIndex ? null : planIndex)}
                      >
                        <Settings size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => removePlan(planIndex)}
                        disabled={plans.length === 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Plan Name"
                      value={plan.name}
                      onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                      className="font-bold text-lg mb-2"
                    />
                    
                    <div className="flex gap-4 items-center mb-2">
                      <Select 
                        value={plan.planType} 
                        onValueChange={(value: "free" | "paid" | "custom") => updatePlanType(planIndex, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Plan Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {plan.planType === "paid" && (
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">$</span>
                          <Input
                            type="number"
                            placeholder="Price"
                            value={plan.price}
                            onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
                            className="w-20"
                          />
                        </div>
                      )}
                      
                      {plan.planType === "custom" && (
                        <Badge>Contact Sales</Badge>
                      )}
                    </div>
                    
                    {/* Trial Info */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <input 
                          type="checkbox"
                          id={`trial-${planIndex}`}
                          checked={plan.trialAvailable || false}
                          onChange={(e) => updatePlan(planIndex, 'trialAvailable', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`trial-${planIndex}`} className="text-sm">Trial</label>
                      </div>
                      
                      {plan.trialAvailable && (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={plan.trialDays || 14}
                            onChange={(e) => updatePlan(planIndex, 'trialDays', parseInt(e.target.value))}
                            className="w-16 h-7 text-sm"
                            min={1}
                          />
                          <span className="text-sm">days</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Default plan on cancel */}
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="radio"
                        id={`default-${planIndex}`}
                        checked={plan.defaultOnCancel || false}
                        onChange={() => setDefaultOnCancelPlan(planIndex)}
                        className="rounded border-gray-300"
                        name="default-plan"
                      />
                      <label htmlFor={`default-${planIndex}`} className="text-sm">Default plan on cancel</label>
                    </div>
                    
                    {/* Analytics Summary */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Customers: {analytics.customersPerPlan[planIndex] || 0}</span>
                        <div className="flex items-center">
                          <span className="flex items-center">
                            Churn: <Badge variant="outline" className="ml-1 text-xs bg-gray-50">Coming soon</Badge>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Features List */}
                    <h3 className="text-sm font-medium mb-2">Features:</h3>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                          <div className="flex-grow overflow-hidden">
                            <div className="text-sm font-medium truncate">{feature.name}</div>
                            
                            <div className="flex items-center mt-1 gap-2">
                              <Select 
                                value={feature.type} 
                                onValueChange={(value: "boolean" | "limit") => updateFeature(planIndex, featureIndex, 'type', value)}
                              >
                                <SelectTrigger className="h-7 text-xs px-2 w-[90px]">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="boolean">Included</SelectItem>
                                  <SelectItem value="limit">Limited</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              {feature.type === "limit" && (
                                <Input
                                  type="text"
                                  placeholder="Limit"
                                  value={feature.limit}
                                  onChange={(e) => updateFeature(planIndex, featureIndex, 'limit', e.target.value)}
                                  className="h-7 text-xs w-[90px]"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {plan.features.length === 0 && (
                        <p className="text-sm text-gray-500">No features added</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add Plan Card */}
              <div 
                className="border-2 border-dashed rounded-lg flex items-center justify-center h-[300px] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={addNewPlan}
              >
                <div className="text-center">
                  <Plus size={32} className="mx-auto mb-2 text-gray-400" />
                  <div className="text-sm font-medium">Add Plan</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button onClick={savePricingModel} className="px-8">
                Save Changes
              </Button>
            </div>
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
