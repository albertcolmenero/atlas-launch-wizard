import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Check, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type PricingWizardStepProps = {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

type PlanType = {
  name: string;
  price: string;
  planType: "free" | "paid" | "custom";
  features: FeatureType[];
};

type FeatureType = {
  name: string;
  type: "boolean" | "limit";
  limit?: string;
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
      planType: "paid",
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
  
  // Recommended plans (expanded with more options)
  const recommendedPlans: PlanType[] = [
    {
      name: "Basic Plan",
      price: "0",
      planType: "free",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "5" },
        { name: "Projects", type: "limit", limit: "3" },
        { name: "Basic Support", type: "boolean" },
      ],
    },
    {
      name: "Pro Plan",
      price: "79",
      planType: "paid",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "20" },
        { name: "Projects", type: "limit", limit: "10" },
        { name: "Priority Support", type: "boolean" },
        { name: "API Access", type: "boolean" },
      ],
    },
    {
      name: "Enterprise Plan",
      price: "",
      planType: "custom",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "Unlimited" },
        { name: "Projects", type: "limit", limit: "Unlimited" },
        { name: "24/7 Support", type: "boolean" },
        { name: "API Access", type: "boolean" },
        { name: "Custom Integrations", type: "boolean" },
      ],
    }
  ];

  const handleRecommendationComplete = () => {
    updateUserData({
      pricingModel: {
        type: "recommended",
        plans: recommendedPlans,
      },
    });
    onNext();
  };

  const handleManualSave = () => {
    if (plans.length === 0 || !plans.every(plan => plan.name)) {
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
      planType: "paid",
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
          features: [...plan.features, { name: newFeature, type: "boolean" } as FeatureType]
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
      
      <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
        <Card className="p-6 border-2 border-primary hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 w-full md:w-64" 
              onClick={() => setView("recommend")}>
          <div className="mb-4 flex justify-center">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">AI Recommendation</h3>
          <p className="text-sm text-gray-500 text-center">Get AI-powered pricing suggestions based on your app type</p>
          <Button className="w-full mt-4">Get Recommendations</Button>
        </Card>
        
        <Card className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 w-full md:w-64" 
              onClick={() => setView("manual")}>
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Custom Plans</h3>
          <p className="text-sm text-gray-500 text-center">Create your own pricing tiers with custom features</p>
          <Button className="w-full mt-4" variant="outline">Create Manually</Button>
        </Card>
      </div>
    </div>
  );

  const renderRecommendView = () => {
    const renderStep = () => {
      switch (currentRecommendStep) {
        case 0:
          return (
            <>
              <h3 className="text-xl font-semibold mb-4">What type of app are you building?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { value: "saas", label: "SaaS Application", icon: "💼" },
                  { value: "content", label: "Content Platform", icon: "📱" },
                  { value: "ecommerce", label: "E-commerce", icon: "🛒" },
                  { value: "mobile", label: "Mobile App", icon: "📱" },
                  { value: "other", label: "Other", icon: "✨" }
                ].map(option => (
                  <Card 
                    key={option.value}
                    className={cn(
                      "p-4 cursor-pointer hover:border-primary transition-all",
                      appType === option.value ? "border-2 border-primary bg-primary/5" : ""
                    )}
                    onClick={() => setAppType(option.value)}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </Card>
                ))}
              </div>
              <Button className="mt-2" onClick={nextRecommendStep} disabled={!appType}>
                Continue
              </Button>
            </>
          );
        case 1:
          return (
            <>
              <h3 className="text-xl font-semibold mb-4">Who are your customers?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { value: "business", label: "Businesses (B2B)", icon: "🏢" },
                  { value: "consumer", label: "Consumers (B2C)", icon: "👤" },
                  { value: "developer", label: "Developers", icon: "👩‍💻" },
                  { value: "mixed", label: "Mixed audience", icon: "🌐" }
                ].map(option => (
                  <Card 
                    key={option.value}
                    className={cn(
                      "p-4 cursor-pointer hover:border-primary transition-all",
                      customerType === option.value ? "border-2 border-primary bg-primary/5" : ""
                    )}
                    onClick={() => setCustomerType(option.value)}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </Card>
                ))}
              </div>
              <Button className="mt-2" onClick={nextRecommendStep} disabled={!customerType}>
                Continue
              </Button>
            </>
          );
        case 2:
          return (
            <>
              <h3 className="text-xl font-semibold mb-4">What's your key value metric?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { value: "users", label: "Users", icon: "👥" },
                  { value: "projects", label: "Projects", icon: "📁" },
                  { value: "api", label: "API Calls", icon: "🔄" },
                  { value: "storage", label: "Storage", icon: "💾" },
                  { value: "other", label: "Other", icon: "✨" }
                ].map(option => (
                  <Card 
                    key={option.value}
                    className={cn(
                      "p-4 cursor-pointer hover:border-primary transition-all",
                      valueMetric === option.value ? "border-2 border-primary bg-primary/5" : ""
                    )}
                    onClick={() => setValueMetric(option.value)}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </Card>
                ))}
              </div>
              <Button className="mt-2" onClick={nextRecommendStep} disabled={!valueMetric}>
                Continue
              </Button>
            </>
          );
        case 3:
          return (
            <>
              <h3 className="text-xl font-semibold mb-6">Recommended Pricing Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedPlans.map((plan, idx) => (
                  <Card key={idx} className={cn(
                    "p-6 border relative overflow-hidden",
                    idx === 1 ? "border-primary shadow-md" : ""
                  )}>
                    {idx === 1 && (
                      <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
                        RECOMMENDED
                      </div>
                    )}
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-3xl font-bold mt-2">${plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <div className="mt-4 space-y-3">
                      {plan.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-center">
                          <Check size={18} className="text-green-500 mr-2 shrink-0" />
                          <span>
                            {feature.type === "limit" ? `${feature.name}: ${feature.limit}` : feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Button onClick={handleRecommendationComplete} className="px-6">Use This Structure</Button>
                <Button variant="outline" onClick={() => {
                  // Convert recommended plans to the current format
                  setPlans(recommendedPlans);
                  setView("manual");
                }}>
                  Customize Plans
                </Button>
              </div>
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

        <div className="max-w-2xl mx-auto">
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

      <div className="max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-6">Create Your Pricing Plans</h3>
        
        {/* Feature Management */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
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
              className="flex-shrink-0"
            >
              <Plus size={16} className="mr-1" /> Add Feature
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Features will be added to all plans. You can customize limits per plan below.
          </div>
        </div>
        
        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                <Label htmlFor={`plan-type-${planIndex}`}>Plan Type</Label>
                <Select 
                  value={plan.planType} 
                  onValueChange={(value: "free" | "paid" | "custom") => updatePlanType(planIndex, value)}
                >
                  <SelectTrigger id={`plan-type-${planIndex}`} className="mt-1">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="custom">Custom (Contact Sales)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {plan.planType === "paid" && (
                <div className="mb-4">
                  <Label htmlFor={`plan-price-${planIndex}`}>Price ($)</Label>
                  <Input
                    id={`plan-price-${planIndex}`}
                    type="number"
                    placeholder="e.g., 29"
                    value={plan.price}
                    onChange={(e) => updatePlan(planIndex, 'price', e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              
              <div>
                <Label className="mb-1 block">Features</Label>
                <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
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
                              type="text"
                              placeholder="Limit"
                              value={feature.limit}
                              onChange={(e) => updateFeature(planIndex, featureIndex, 'limit', e.target.value)}
                              className="h-7 text-xs w-[90px]"
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
            className="border-2 border-dashed rounded-lg flex items-center justify-center h-[350px] cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={addNewPlan}
          >
            <div className="text-center">
              <Plus size={32} className="mx-auto mb-2 text-gray-400" />
              <div className="text-sm font-medium">Add Plan</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="w-full md:w-auto" 
            onClick={handleManualSave} 
            disabled={!plans.length || !plans.every(p => p.name)}
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
    <div className="bg-white rounded-lg">
      {content}
    </div>
  );
};

export default PricingWizardStep;
