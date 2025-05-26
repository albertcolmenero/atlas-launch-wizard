import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PlanType = {
  name: string;
  price: string;
  features: {
    name: string;
    type: "boolean" | "limit";
    limit?: string;
  }[];
};

type UserDataType = {
  email: string;
  password?: string;
  merchantId: string;
  pricingModel: {
    type: string;
    plans: PlanType[];
  } | null;
  sdkIntegrated: boolean;
  stripeConnected: boolean;
};

type CompletionStepProps = {
  userData: UserDataType;
};

const CompletionStep = ({ userData }: CompletionStepProps) => {
  const navigate = useNavigate();
  const plans = userData.pricingModel?.plans || [];
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold">You're Ready!</h2>
        <p className="text-gray-500 mt-2">Your app is monetized with Atlas</p>
      </div>
      
      <Card className="p-6 mb-8">
        <h3 className="font-semibold text-lg mb-4">Setup Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Account Created</h4>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-5 h-5 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Pricing Plans Created</h4>
              <p className="text-sm text-gray-500">{plans.length} pricing plans created</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-5 h-5 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">SDK Integration</h4>
              <p className="text-sm text-gray-500">Atlas SDK connected and verified</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-5 h-5 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Stripe Connected</h4>
              <p className="text-sm text-gray-500">Ready to accept payments</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Display the created pricing plans */}
      {plans.length > 0 && (
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Your Pricing Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <Card key={index} className="p-4 border shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold">{plan.name}</h4>
                <p className="text-2xl font-bold mt-1">${plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                
                <div className="mt-3 space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <Check className="h-2.5 w-2.5 text-green-600" />
                      </div>
                      <span className="text-sm">
                        {feature.type === "limit" 
                          ? `${feature.name}: ${feature.limit}` 
                          : feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
      
      <div className="space-y-4 text-center">
        <Button size="lg" className="w-full" onClick={() => navigate("/development-dashboard")}>
          Continue to Development Dashboard
        </Button>
        <div className="text-sm">
          <a href="#" className="text-primary hover:underline">
            Need help? Contact support
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;
