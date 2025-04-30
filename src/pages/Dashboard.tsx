
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

// Properly define the PlanType with strict typing
type PlanType = {
  name: string;
  price: string;
  features: {
    name: string;
    type: "boolean" | "limit";
    limit?: string;
  }[];
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock user data that would typically come from context/storage
  const [userData, setUserData] = useState({
    email: "user@example.com",
    merchantId: "mer_12345",
    pricingModel: {
      type: "manual",
      plans: [
        {
          name: "Basic",
          price: "29",
          features: [
            { name: "Core Features", type: "boolean" as const },
            { name: "Users", type: "limit" as const, limit: "5" },
          ],
        },
        {
          name: "Pro",
          price: "79",
          features: [
            { name: "Core Features", type: "boolean" as const },
            { name: "Users", type: "limit" as const, limit: "20" },
            { name: "API Access", type: "boolean" as const },
          ],
        }
      ]
    },
    sdkIntegrated: true,
    stripeConnected: false,
  });

  // Calculate onboarding progress
  const onboardingSteps = [
    { name: "Sign Up", completed: true },
    { name: "Create Pricing", completed: !!userData.pricingModel },
    { name: "SDK Integration", completed: userData.sdkIntegrated },
    { name: "Connect Stripe", completed: userData.stripeConnected },
  ];
  
  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Manage your subscription and pricing</p>
      </div>
      
      {/* Onboarding Status Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Onboarding Progress</h2>
          <span className="text-sm font-medium">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2 mb-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {onboardingSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
              }`}>
                {step.completed && <Check size={14} />}
                {!step.completed && <span className="text-xs">{index + 1}</span>}
              </div>
              <div className="flex-grow">
                <p className={`text-sm font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                  {step.name}
                </p>
              </div>
              {!step.completed && (
                <Button size="sm" variant="outline" className="text-xs">
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {progressPercentage < 100 && (
          <Button className="mt-6 w-full sm:w-auto" onClick={() => navigate("/")}>
            Continue Onboarding <ArrowRight size={16} className="ml-2" />
          </Button>
        )}
      </Card>
      
      {/* Pricing Model Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your Pricing Model</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {userData.pricingModel?.plans.map((plan: PlanType, index: number) => (
            <Card key={index} className="p-4 border">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-2xl font-bold mt-2">${plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
              
              <div className="mt-4 space-y-2">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2 shrink-0" />
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
        
        <div className="mt-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            Edit Pricing Model
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
