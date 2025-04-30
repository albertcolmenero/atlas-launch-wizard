
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

type PricingWizardStepProps = {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

type PlanType = {
  name: string;
  price: string;
  features: string;
};

const PricingWizardStep = ({ onNext, onBack, updateUserData, userData }: PricingWizardStepProps) => {
  const [view, setView] = useState<"choice" | "recommend" | "manual">("choice");
  const [currentRecommendStep, setCurrentRecommendStep] = useState(0);
  
  // Fields for recommendation flow
  const [appType, setAppType] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [valueMetric, setValueMetric] = useState("");
  
  // Fields for manual flow
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planFeatures, setPlanFeatures] = useState("");
  
  // Recommended plan (mock)
  const recommendedPlan: PlanType = {
    name: "Basic Plan",
    price: "29",
    features: "100 Users\nUnlimited Projects\nBasic Support\nAPI Access",
  };

  const handleRecommendationComplete = () => {
    updateUserData({
      pricingModel: {
        type: "recommended",
        plan: recommendedPlan,
      },
    });
    onNext();
  };

  const handleManualSave = () => {
    if (!planName || !planPrice) {
      return; // Simple validation
    }
    
    const plan: PlanType = {
      name: planName,
      price: planPrice,
      features: planFeatures,
    };
    
    updateUserData({
      pricingModel: {
        type: "manual",
        plan,
      },
    });
    onNext();
  };

  const nextRecommendStep = () => {
    if (currentRecommendStep < 3) {
      setCurrentRecommendStep(currentRecommendStep + 1);
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
                  <ul className="space-y-2 list-disc pl-5">
                    {recommendedPlan.features.split("\n").map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleRecommendationComplete}>Use This Plan</Button>
                  <Button variant="outline" onClick={() => {
                    setPlanName(recommendedPlan.name);
                    setPlanPrice(recommendedPlan.price);
                    setPlanFeatures(recommendedPlan.features);
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

      <div className="max-w-xl mx-auto">
        <h3 className="text-xl font-semibold mb-6">Create Your Plan</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              placeholder="e.g. Basic, Pro, Enterprise"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="basePrice">Base Price ($)</Label>
            <Input
              id="basePrice"
              type="number"
              placeholder="e.g. 29"
              value={planPrice}
              onChange={(e) => setPlanPrice(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea
              id="features"
              placeholder="e.g. 100 Users&#10;Unlimited Projects&#10;Basic Support"
              className="h-32"
              value={planFeatures}
              onChange={(e) => setPlanFeatures(e.target.value)}
            />
          </div>
          
          <Button className="w-full" onClick={handleManualSave} disabled={!planName || !planPrice}>
            Save Plan
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
