
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Rocket, Sparkles, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const Index = () => {
  const [showWizard, setShowWizard] = useState(false);
  const navigate = useNavigate();

  if (!showWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column: Content */}
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                <Sparkles size={16} className="mr-2" />
                <span className="text-sm font-medium">Launching soon</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Welcome to <span className="text-primary">Atlas</span>
              </h1>
              
              <div className="space-y-4">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Turn your app into a business with powerful monetization tools.
                </p>
                
                <ul className="space-y-3">
                  {[
                    { icon: LayoutDashboard, text: "Create flexible pricing plans" },
                    { icon: Rocket, text: "Easy SDK integration" },
                    { icon: Sparkles, text: "Seamless checkout experience" }
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                        <feature.icon size={16} className="text-primary" />
                      </div>
                      <span className="text-gray-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={() => navigate("/signup")}
                  className="group h-12 px-6 text-lg"
                >
                  Get Started
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            
            {/* Right column: Cards */}
            <div className="relative">
              <div className="absolute top-4 -left-4 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000"></div>
              
              <div className="relative space-y-6">
                {/* Card 1 */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Rocket className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Quick Integration</h3>
                        <p className="text-gray-500">Add monetization in minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Card 2 */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow ml-8 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Smart Pricing</h3>
                        <p className="text-gray-500">Optimize revenue with flexible plans</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Card 3 */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Seamless Payments</h3>
                        <p className="text-gray-500">Integrated Stripe solutions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <OnboardingWizard />;
};

export default Index;
