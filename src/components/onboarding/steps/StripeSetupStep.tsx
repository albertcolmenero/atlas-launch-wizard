
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, ArrowLeft, Check, AlertTriangle, Loader2 } from "lucide-react";

type StripeSetupStepProps = {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

const StripeSetupStep = ({ onNext, onBack, updateUserData, userData }: StripeSetupStepProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState("");

  const handleConnectStripe = async () => {
    if (!apiKey) {
      setError("Please enter your Stripe API key");
      return;
    }

    setError("");
    setIsConnecting(true);
    setConnectionResult(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would make an API call to validate and store the Stripe API key
      // const response = await fetch('/api/stripe/connect', { 
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKey })
      // });
      
      // For now, we'll just simulate success
      setConnectionResult("success");
      updateUserData({ stripeConnected: true });
      
      // Wait a moment before proceeding
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (err) {
      console.error("Stripe connection error:", err);
      setConnectionResult("error");
      setError("Failed to connect to Stripe. Please check your API key and try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Connect Stripe</h2>
        <p className="text-gray-500 mt-2">Enable payments for your app</p>
      </div>

      <Card className="p-6">
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Connection Error</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        
        {connectionResult === "success" && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Connected!</AlertTitle>
            <AlertDescription className="text-green-700">
              Stripe has been connected successfully. You're ready to accept payments!
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="stripe-api-key">
              Stripe Secret API Key
            </Label>
            <div className="relative">
              <Input
                id="stripe-api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="sk_test_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Find your API keys in the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="text-primary hover:underline">Stripe Dashboard</a>
            </p>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleConnectStripe} 
            disabled={isConnecting || connectionResult === "success"}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : connectionResult === "success" ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Connected
              </>
            ) : (
              "Connect Stripe"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StripeSetupStep;
