
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Copy, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type SdkIntegrationStepProps = {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

const SdkIntegrationStep = ({ onNext, onBack, updateUserData, userData }: SdkIntegrationStepProps) => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  
  const npmInstallCode = `npm install @atlas/sdk`;
  
  const rulesCode = `// atlas-rules.js
import { Atlas } from '@atlas/sdk';

// Initialize the SDK with your merchant ID
const atlas = new Atlas({
  merchantId: "${userData.merchantId || 'your_merchant_id'}",
});

// Define your pricing rules
atlas.setPricingRules({
  plans: {
    basic: {
      price: ${userData.pricingModel?.plan?.price || '29'},
      limits: {
        users: 100,
      },
    },
  },
});

export default atlas;`;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
  };

  const handleTestSdk = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, we would make an API call to verify SDK setup
      // const response = await fetch('/api/test-sdk', { 
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ merchantId: userData.merchantId })
      // });
      
      // For now, we'll just simulate success
      setTestResult("success");
      updateUserData({ sdkIntegrated: true });
    } catch (err) {
      console.error("SDK test error:", err);
      setTestResult("error");
    } finally {
      setIsTesting(false);
    }
  };

  const handleContinue = () => {
    onNext();
  };

  const handleSkip = () => {
    toast({
      title: "Step skipped",
      description: "You can always integrate the SDK later from your dashboard",
    });
    onNext();
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Integrate Atlas SDK</h2>
        <p className="text-gray-500 mt-2">Add monetization to your app</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Step 1: Install Atlas SDK</h3>
          <Card className="bg-gray-900 text-white p-4 relative">
            <pre className="font-mono text-sm overflow-x-auto">{npmInstallCode}</pre>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => handleCopyCode(npmInstallCode)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Step 2: Add Rules to Cursor</h3>
          <Card className="bg-gray-900 text-white p-4 relative">
            <pre className="font-mono text-sm overflow-x-auto">{rulesCode}</pre>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => handleCopyCode(rulesCode)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Step 3: Verify Integration</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <Button 
              onClick={handleTestSdk} 
              disabled={isTesting || testResult === "success"}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : testResult === "success" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verified
                </>
              ) : (
                "Test SDK"
              )}
            </Button>
            
            {testResult === "success" ? (
              <Button onClick={handleContinue}>Continue</Button>
            ) : (
              <Button variant="outline" onClick={handleSkip}>Skip for now</Button>
            )}
          </div>

          {testResult === "success" && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your Atlas SDK is correctly integrated and ready to use.
              </AlertDescription>
            </Alert>
          )}

          {testResult === "error" && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Integration Error</AlertTitle>
              <AlertDescription className="text-red-700">
                We couldn't verify your SDK integration. Please check your implementation and try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SdkIntegrationStep;
