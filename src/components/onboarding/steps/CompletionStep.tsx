
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

type CompletionStepProps = {
  userData: any;
};

const CompletionStep = ({ userData }: CompletionStepProps) => {
  const plan = userData.pricingModel?.plan || { name: "Basic Plan", price: "29" };
  
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold">You're Ready!</h2>
        <p className="text-gray-500 mt-2">Your app is monetized with Atlas</p>
      </div>
      
      <Card className="p-6 mb-8">
        <h3 className="font-semibold text-lg mb-4">Setup Summary</h3>
        
        <div className="space-y-4 text-left">
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
              <h4 className="font-medium">Pricing Plan Created</h4>
              <p className="text-sm text-gray-500">{plan.name} - ${plan.price}/month</p>
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
      
      <div className="space-y-4">
        <Button size="lg" className="w-full">
          Go to Dashboard
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
