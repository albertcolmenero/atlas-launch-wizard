
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import ProductGoalsStep from "./steps/ProductGoalsStep";
import CompetitorTrackingPage from "./steps/CompetitorTrackingPage";
import WTPInterviewPage from "./steps/WTPInterviewPage";
import VanWestendorpPage from "./steps/VanWestendorpPage";
import MonetizationAuditPage from "./steps/MonetizationAuditPage";
import PricingWizardStep from "./steps/PricingWizardStep";
import SdkIntegrationStep from "./steps/SdkIntegrationStep";
import PricingPageSetupStep from "./steps/PricingPageSetupStep";
import StripeSetupStep from "./steps/StripeSetupStep";
import CompletionStep from "./steps/CompletionStep";
import { useNavigate } from "react-router-dom";

const STEPS = [
  "Choose Goals",
  "Setup Features",
  "Configure Integration",
  "Complete",
];

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    merchantId: "",
    selectedGoals: [],
    goalDetails: [],
    selectedGoal: null,
    pricingModel: null,
    sdkIntegrated: false,
    stripeConnected: false,
  });

  // Load user data from localStorage (created during signup)
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(prevData => ({
        ...prevData,
        ...parsedData
      }));
    } else {
      // If no user data, redirect to sign up
      navigate('/');
    }
  }, [navigate]);

  const progressPercentage = ((currentStep) / (STEPS.length - 1)) * 100;

  // Map actual step numbers to progress indicator indices
  const getProgressIndex = (step: number): number => {
    if (step === 0) return 0; // Choose Goals
    if (step === 1) return 1; // Setup Features
    if (step >= 2 && step <= 4) return 2; // Configure Integration
    if (step >= 5) return 3; // Complete
    return 0;
  };

  const handleNext = (selectedGoalParam?: string) => {
    if (selectedGoalParam) {
      setSelectedGoal(selectedGoalParam);
    }
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
    setUserData((prev) => {
      const updated = { ...prev, ...data };
      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProductGoalsStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 1:
        // Show coming soon page based on selected goal
        if (selectedGoal === "competitor-tracking") {
          return <CompetitorTrackingPage onBack={() => setCurrentStep(0)} onContinue={handleNext} />;
        } else if (selectedGoal === "wtp-interview") {
          return <WTPInterviewPage onBack={() => setCurrentStep(0)} onContinue={handleNext} />;
        } else if (selectedGoal === "price-sensitivity") {
          return <VanWestendorpPage onBack={() => setCurrentStep(0)} onContinue={handleNext} />;
        } else if (selectedGoal === "monetization-audit") {
          return <MonetizationAuditPage onBack={() => setCurrentStep(0)} onContinue={handleNext} />;
        } else if (selectedGoal) {
          // For existing options, go directly to pricing wizard with appropriate initial view
          const initialView = selectedGoal === "import-pricing" ? "import" :
                             selectedGoal === "ai-recommendations" ? "recommend" :
                             selectedGoal === "custom-pricing" ? "manual" : "choice";
          return <PricingWizardStep
            onNext={handleNext}
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
            initialView={initialView}
          />;
        } else {
          // No goal selected yet, this shouldn't happen but handle gracefully
          return <div className="text-center py-10">Loading...</div>;
        }
      case 2:
        return <PricingWizardStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 3:
        return <SdkIntegrationStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 4:
        return <PricingPageSetupStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 5:
        return <StripeSetupStep onNext={handleNext} onBack={handleBack} updateUserData={updateUserData} userData={userData} />;
      case 6:
        return <CompletionStep userData={userData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/3 to-pink-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Progress Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {getProgressIndex(currentStep) + 1}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {STEPS[getProgressIndex(currentStep)]}
                </h2>
                <p className="text-sm text-gray-600">
                  Step {getProgressIndex(currentStep) + 1} of {STEPS.length}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            {/* Progress indicators */}
            <div className="flex justify-between mt-2">
              {STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= getProgressIndex(currentStep)
                      ? 'bg-primary shadow-md scale-110'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Content Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
          {/* Subtle inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-primary/5 pointer-events-none"></div>

          <div className="relative z-10">
            {renderStep()}
          </div>
        </div>

        {/* Footer with branding */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Atlas Launch Wizard • Making product launches effortless
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
