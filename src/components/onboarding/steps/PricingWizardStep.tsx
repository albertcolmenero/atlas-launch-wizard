
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Check, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type PricingWizardStepProps = {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

type FeatureType = {
  name: string;
  type: "boolean" | "limit";
  limit?: string;
};

type PlanType = {
  name: string;
  price: string;
  features: FeatureType[];
};

const PricingWizardStep = ({ onNext, onBack, updateUserData, userData }: PricingWizardStepProps) => {
  const [view, setView] = useState<"choice" | "recommend" | "manual">("choice");
  const [currentRecommendStep, setCurrentRecommendStep] = useState(0);
  
  // Fields for recommendation flow
  const [appType, setAppType] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [valueMetric, setValueMetric] = useState("");
  
  // Fields for manual flow
  const [plans, setPlans] = useState<PlanType[]>([
    {
      name: "Basic",
      price: "29",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "5" },
      ],
    }
  ]);

  const [sharedFeatures, setSharedFeatures] = useState<string[]>([
    "Core Features", "Users", "Projects", "Support"
  ]);

  const [newFeature, setNewFeature] = useState("");
  
  // Recommended plan (mock)
  const recommendedPlan: PlanType = {
    name: "Basic Plan",
    price: "29",
    features: [
      { name: "Core Features", type: "boolean" },
      { name: "Users", type: "limit", limit: "100" },
      { name: "Projects", type: "boolean" },
      { name: "Basic Support", type: "boolean" },
      { name: "API Access", type: "boolean" },
    ],
  };

  const handleRecommendationComplete = () => {
    updateUserData({
      pricingModel: {
        type: "recommended",
        plans: [recommendedPlan],
      },
    });
    onNext();
  };

  const handleManualSave = () => {
    if (plans.length === 0 || !plans.every(plan => plan.name && plan.price)) {
      return; // Simple validation
    }
    
    updateUserData({
      pricingModel: {
        type: "manual",
        plans,
      },
    });
    onNext();
  };

  const nextRecommendStep = () => {
    if (currentRecommendStep < 3) {
      setCurrentRecommendStep(currentRecommendStep + 1);
    }
  };

  const addNewPlan = () => {
    // Create a new plan with the shared features
    const newPlan: PlanType = {
      name: `Plan ${plans.length + 1}`,
      price: "",
      features: sharedFeatures.map(feature => {
        return { 
          name: feature, 
          type: feature === "Users" || feature === "Projects" ? "limit" : "boolean", 
          limit: feature === "Users" || feature === "Projects" ? "10" : undefined 
        } as FeatureType;
      }),
    };
    
    setPlans([...plans, newPlan]);
  };

  const removePlan = (index: number) => {
    const updatedPlans = [...plans];
    updatedPlans.splice(index, 1);
    setPlans(updatedPlans);
  };

  const updatePlan = (index: number, field: string, value: string) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setPlans(updatedPlans);
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
          features: [...plan.features, { name: newFeature, type: "boolean" }]
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    setNewFeature("");
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...plans];
    const featureToRemove = updatedPlans[planIndex].features[featureIndex].name;

    // Remove from this specific plan
    updatedPlans[planIndex].features.splice(featureIndex, 1);
    setPlans(updatedPlans);
    
    // Check if this feature should be removed from shared features
    if (!plans.some(p => p.features.some(f => f.name === featureToRemove))) {
      setSharedFeatures(sharedFeatures.filter(f => f !== featureToRemove));
    }
  };

  const renderChoiceView = () => (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold mb-2">Set Up Your Pricing</h2>
      <p className="text-gray-500 mb-8">Choose how to monetize your app</p>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
        <Button className="px-6 py-8 text-lg" onClick={() => setView("recommend")}>
          Recommend a Pricing Model
        </Button>
        <Button className="px-6 py-8 text-lg" variant="outline" onClick={() => setView("manual")}>
          Create Plans Manually
        </Button>
      </div>
    </div>
  );

  const renderRecommendView = () => {
    const renderStep = () => {
      switch (currentRecommendStep) {
        // ... keep existing code (steps 0-2 for recommendation flow)
        case 0:
          return (
            <>
              <h3 className="text-xl font-semibold mb-4">What type of app are you building?</h3>
              <Select value={appType} onValueChange={setAppType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select app type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS Application</SelectItem>
                  <SelectItem value="content">Content Platform</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-6" onClick={nextRecommendStep} disabled={!appType}>
                Continue
              </Button>
            </>
          );
        case 1:
          return (
            <>
              <h3 className="text-xl font-semibold mb-4">Who are your customers?</h3>
              <Select value={customerType} onValueChange={setCustomerType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Businesses (B2B)</SelectItem>
                  <SelectItem value="consumer">Consumers (B2C)</SelectItem>
                  <SelectItem value="developer">Developers</SelectItem>
                  <SelectItem value="mixed">Mixed audience</SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-6" onClick={nextRecommendStep} disabled={!customerType}>
                Continue
              </Button>
            </>
          );
        case 2:
          return (
            <>
              <h3 className="text-xl font-semibold mb-4">What's your key value metric?</h3>
              <Select value={valueMetric} onValueChange={setValueMetric}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select value metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="api">API Calls</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-6" onClick={nextRecommendStep} disabled={!valueMetric}>
                Continue
              </Button>
            </>
          );
        case 3:
          return (
            <>
              <h3 className="text-xl font-semibold mb-4">Your Recommended Plan</h3>
              <Card className="p-6">
                <h4 className="text-lg font-bold">{recommendedPlan.name}</h4>
                <p className="text-2xl font-bold mt-2">${recommendedPlan.price}/month</p>
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Features:</h5>
                  <ul className="space-y-2">
                    {recommendedPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>
                          {feature.type === "limit" ? `${feature.name}: ${feature.limit}` : feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleRecommendationComplete}>Use This Plan</Button>
                  <Button variant="outline" onClick={() => {
                    // Convert recommended plan to the new format
                    setPlans([recommendedPlan]);
                    setView("manual");
                  }}>
                    Edit Plan
                  </Button>
                </div>
              </Card>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="py-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => {
            if (currentRecommendStep > 0) {
              setCurrentRecommendStep(currentRecommendStep - 1);
            } else {
              setView("choice");
            }
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-md mx-auto">
          {renderStep()}
        </div>
      </div>
    );
  };

  const renderManualView = () => (
    <div className="py-6">
      <Button variant="ghost" className="mb-6" onClick={() => setView("choice")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-6">Create Your Pricing Plans</h3>
        
        {/* Feature Management */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Manage Features</h4>
          <div className="flex gap-2">
            <Input 
              placeholder="Add a new feature (e.g., API Access, Support)"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={addFeatureToAllPlans}
              disabled={!newFeature.trim()}
            >
              <Plus size={16} className="mr-1" /> Add Feature
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Features will be added to all plans. You can customize limits per plan below.
          </div>
        </div>
        
        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {plans.map((plan, planIndex) => (
            <Card key={planIndex} className="p-4 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 text-gray-500 hover:text-red-500"
                onClick={() => removePlan(planIndex)}
                disabled={plans.length === 1}
              >
                <Trash2 size={16} />
              </Button>
              
              <div className="mb-4">
                <Label htmlFor={`plan-name-${planIndex}`}>Plan Name</Label>
                <Input
                  id={`plan-name-${planIndex}`}
                  placeholder="e.g., Basic, Pro, Enterprise"
                  value={plan.name}
                  onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor={`plan-price-${planIndex}`}>Base Price ($)</Label>
                <Input
                  id={`plan-price-${planIndex}`}
                  type="number"
                  placeholder="e.g., 29"
                  value={plan.price}
                  onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="mb-1 block">Features</Label>
                <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <div className="flex-grow overflow-hidden">
                        <div className="text-sm font-medium truncate">{feature.name}</div>
                        
                        <div className="flex items-center mt-1 gap-2">
                          <Select 
                            value={feature.type} 
                            onValueChange={(value: "boolean" | "limit") => updateFeature(planIndex, featureIndex, 'type', value)}
                          >
                            <SelectTrigger className="h-7 text-xs px-2 w-[90px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="boolean">Included</SelectItem>
                              <SelectItem value="limit">Limited</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {feature.type === "limit" && (
                            <Input
                              type="number"
                              placeholder="Limit"
                              value={feature.limit}
                              onChange={(e) => updateFeature(planIndex, featureIndex, 'limit', e.target.value)}
                              className="h-7 text-xs w-[70px]"
                            />
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 shrink-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeFeature(planIndex, featureIndex)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          
          {/* Add Plan Card */}
          <div 
            className="border-2 border-dashed rounded-lg flex items-center justify-center h-[300px] cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={addNewPlan}
          >
            <div className="text-center">
              <Plus size={24} className="mx-auto mb-2 text-gray-400" />
              <div className="text-sm font-medium">Add Plan</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="w-full md:w-auto" 
            onClick={handleManualSave} 
            disabled={!plans.length || !plans.every(p => p.name && p.price)}
          >
            Save Plans
          </Button>
        </div>
      </div>
    </div>
  );

  let content;
  switch (view) {
    case "choice":
      content = renderChoiceView();
      break;
    case "recommend":
      content = renderRecommendView();
      break;
    case "manual":
      content = renderManualView();
      break;
  }

  return (
    <div>
      {content}
    </div>
  );
};

export default PricingWizardStep;
