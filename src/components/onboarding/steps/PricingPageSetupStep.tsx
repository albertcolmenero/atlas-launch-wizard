
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type PricingPageSetupStepProps = {
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

const PricingPageSetupStep = ({ onNext, onBack, updateUserData, userData }: PricingPageSetupStepProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Get plans from userData or use a default plan
  const plans = userData.pricingModel?.plans || [
    {
      name: "Basic Plan",
      price: "29",
      features: [
        { name: "Users", type: "limit", limit: "100" },
        { name: "Projects", type: "boolean" },
        { name: "Basic Support", type: "boolean" }
      ],
    }
  ];
  
  const embedCode = `// Import the Atlas Pricing Page component
import { AtlasPricingPage } from '@atlas/react-components';

// Add this to your app's pricing page
function YourPricingPage() {
  return (
    <AtlasPricingPage
      merchantId="${userData.merchantId || 'your_merchant_id'}"
      onSubscribe={(plan) => {
        console.log('User subscribed to:', plan);
        // Handle subscription flow
      }}
    />
  );
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
  };

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would make an API call to save pricing page configuration
      // const response = await fetch('/api/pricing-page', { 
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ merchantId: userData.merchantId })
      // });
      
      onNext();
    } catch (error) {
      console.error("Error saving pricing page:", error);
      toast({
        title: "Error",
        description: "Failed to save pricing page configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFeaturesList = (features: FeatureType[]) => {
    return (
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <span>
              {feature.type === "limit" ? `${feature.name}: ${feature.limit}` : feature.name}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Set Up Your Pricing Page</h2>
        <p className="text-gray-500 mt-2">Embed this in your app</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="grid grid-cols-1 gap-4">
            {plans.map((plan, index) => (
              <Card key={index} className="p-6 overflow-hidden border-2 border-primary">
                <div className="text-center p-6 bg-gradient-to-b from-primary/10 to-transparent rounded-t-lg">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  
                  <div className="mt-6 text-left">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                    {renderFeaturesList(plan.features)}
                  </div>
                  
                  <Button className="w-full mt-6">Subscribe</Button>
                </div>
                
                <div className="mt-4 p-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Subscription
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Code Snippet</h3>
          <Card className="bg-gray-900 text-white p-4 relative">
            <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={handleCopyCode}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Card>
          
          <Button 
            className="w-full mt-6" 
            onClick={handleSaveAndContinue}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPageSetupStep;
