
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import SignUpStep from "./steps/SignUpStep";
import PricingWizardStep from "./steps/PricingWizardStep";
import SdkIntegrationStep from "./steps/SdkIntegrationStep";
import PricingPageSetupStep from "./steps/PricingPageSetupStep";
import StripeSetupStep from "./steps/StripeSetupStep";
import CompletionStep from "./steps/CompletionStep";

const STEPS = [
  "Sign Up",
  "Create Pricing",
  "SDK Integration",
  "Pricing Page",
  "Connect Stripe",
  "Complete",
];

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    merchantId: "",
    pricingModel: null,
    sdkIntegrated: false,
    stripeConnected: false,
  });

  const progressPercentage = ((currentStep) / (STEPS.length - 1)) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next step
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when moving to previous step
      window.scrollTo(0, 0);
    }
  };

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <SignUpStep onNext={handleNext} updateUserData={updateUserData} userData={userData} />;
      case 1:
        return <PricingWizardStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 2:
        return <SdkIntegrationStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 3:
        return <PricingPageSetupStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 4:
        return <StripeSetupStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 5:
        return <CompletionStep userData={userData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium">
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
            </h2>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
