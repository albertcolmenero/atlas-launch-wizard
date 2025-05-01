
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StripeConnectionFormProps {
  onConnectChange: (connected: boolean) => void;
}

const StripeConnectionForm: React.FC<StripeConnectionFormProps> = ({ 
  onConnectChange 
}) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  
  const handleConnectStripe = async () => {
    if (!apiKey) {
      setError("Please enter your Stripe API key");
      return;
    }

    setIsConnecting(true);
    setError("");
    
    try {
      // Simulate API call to connect Stripe
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would validate the API key with your backend
      // const response = await fetch('/api/stripe/connect', { 
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKey })
      // });
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || "Failed to connect to Stripe");
      // }
      
      onConnectChange(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to Stripe");
      onConnectChange(false);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="stripe-api-key">Stripe Secret API Key</Label>
        <div className="relative">
          <Input
            id="stripe-api-key"
            type={showApiKey ? "text" : "password"}
            placeholder="sk_test_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Find your API keys in the{" "}
          <a
            href="https://dashboard.stripe.com/apikeys"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Stripe Dashboard
          </a>
        </p>
      </div>

      <Button 
        onClick={handleConnectStripe} 
        disabled={isConnecting}
        className="w-full"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Connect Stripe
          </>
        )}
      </Button>
    </div>
  );
};

export default StripeConnectionForm;
