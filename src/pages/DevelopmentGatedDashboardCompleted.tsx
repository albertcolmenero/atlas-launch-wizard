
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const DevelopmentGatedDashboardCompleted = () => {
  const navigate = useNavigate();

  // Mock user data
  const userData = {
    name: "John",
    merchantId: "mer_12345",
    pricingModel: {
      created: true
    }
  };

  const handleContinue = () => {
    navigate('/development-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Congratulations Header */}
      

      {/* You're all set Card - moved to top */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-8">
        <CardContent className="p-8 text-center">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Congratulations, {userData.name}! You're all set!</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your Atlas integration is complete and ready for development. You can now access your 
            development dashboard to monitor your application, configure features, and prepare for production.
          </p>
          <Button 
            onClick={handleContinue}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>

      {/* Completed Steps Summary */}
      <div className="space-y-4">
        {/* Step 1: Create a pricing model */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Create a pricing model</h3>
                <p className="text-green-600 text-sm">
                  You have successfully created a <button className="text-purple-600 underline">pricing model</button>!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Integrate Stripe */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Stripe integration completed</h3>
                <p className="text-green-600 text-sm">
                  Payment processing is now connected and configured!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Step 3: Connect the Atlas SDK */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Atlas SDK connected</h3>
                <p className="text-green-600 text-sm">
                  Your application is successfully integrated with Atlas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Pricing Table rendered */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Pricing Table component embeded</h3>
                <p className="text-green-600 text-sm">
                  The pricing table component is already embeded into your app!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevelopmentGatedDashboardCompleted;
