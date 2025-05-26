
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductionGatedDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  // Mock user data
  const userData = {
    name: "John",
    merchantId: "mer_12345",
    pricingModel: {
      created: true
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "The installation instructions have been copied to your clipboard."
    });
  };

  const frameworks = [
    {
      id: "react",
      name: "React",
      subtitle: "Frontend",
      icon: "⚛️",
      selected: true
    },
    {
      id: "express",
      name: "Express",
      subtitle: "Backend",
      icon: "📦"
    },
    {
      id: "nextjs",
      name: "Next.js",
      subtitle: "Full Stack",
      icon: "▲"
    }
  ];

  const installationInstructions = `npm install @atlas/sdk

// Initialize Atlas in your app
import { Atlas } from '@atlas/sdk';

const atlas = new Atlas({
  merchantId: "${userData.merchantId}",
  apiKey: "your-api-key"
});`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Atlas!</h1>
        <p className="text-gray-600">
          You are just <span className="text-purple-600 font-semibold">3 steps away</span> from monetizing your application!
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6">
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
        <Card className="border-l-4 border-l-gray-300">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-gray-600 font-semibold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrate Stripe</h3>
                <p className="text-gray-600 mb-4">
                  Atlas doesn't process payments, so we need to set up Stripe to process them. You can create an account{" "}
                  <button className="text-purple-600 underline">here</button>. Once you are ready, or if you already 
                  have an account, click on this button to connect it!
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Connect your Stripe account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Connect the Atlas SDK */}
        <Card className="border-l-4 border-l-gray-300">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-gray-600 font-semibold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect the Atlas SDK</h3>
                <p className="text-gray-600 mb-4">
                  The Atlas SDK is a JavaScript library that allows you to integrate Atlas into your application.
                </p>
                
                {/* Framework Selection */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Select your framework</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {frameworks.map((framework) => (
                      <button
                        key={framework.id}
                        onClick={() => setSelectedFramework(framework.id)}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          framework.id === "react" 
                            ? "border-purple-500 bg-purple-50" 
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-2">{framework.icon}</div>
                        <div className="font-medium text-gray-900">{framework.name}</div>
                        <div className="text-sm text-gray-600">{framework.subtitle}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Installation Instructions */}
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Installation Instructions</h4>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div>
                        <p className="text-blue-800 font-medium">Using an agent?</p>
                        <p className="text-blue-700 text-sm">
                          Copy the installation instructions as a prompt for LLMs to implement Atlas in your application
                        </p>
                      </div>
                    </div>
                  </div>

                  <Card className="bg-gray-900 text-white">
                    <CardContent className="p-4 relative">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {installationInstructions}
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(installationInstructions)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductionGatedDashboard;
