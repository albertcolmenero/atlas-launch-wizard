
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useState } from "react";

const Index = () => {
  const [showWizard, setShowWizard] = useState(false);

  if (!showWizard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Welcome to Atlas</h1>
            <p className="text-gray-500 mt-2">Turn your app into a business</p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => setShowWizard(true)}
          >
            Start Onboarding
          </Button>
        </Card>
      </div>
    );
  }

  return <OnboardingWizard />;
};

export default Index;
