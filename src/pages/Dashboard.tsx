
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { 
  Check, 
  ArrowRight, 
  Users, 
  CreditCard, 
  Code, 
  TrendingUp,
  FileText,
  MessageSquare,
  Calendar,
  Bell,
  Play,
  Copy,
  Sparkles
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  // Mock user data that would typically come from context/storage
  const [userData, setUserData] = useState({
    name: "John",
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
    sdkIntegrated: false,
    stripeConnected: false,
    metrics: {
      mrr: 2450,
      mrrGrowth: 18,
      totalCustomers: 42,
      newCustomers: 8,
      trialConversion: 64,
      planDistribution: {
        Basic: 28,
        Pro: 14,
        Enterprise: 0,
      }
    },
    recentActivity: [
      { type: "signup", name: "Sarah Johnson", plan: "Pro", date: "2025-04-30T14:30:00Z" },
      { type: "payment", name: "TechCorp Ltd", amount: 790, date: "2025-04-29T09:15:00Z" },
      { type: "upgrade", name: "Mike Peterson", fromPlan: "Basic", toPlan: "Pro", date: "2025-04-28T16:45:00Z" }
    ]
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Onboarding steps to display
  const onboardingSteps = [
    { 
      name: "Create Pricing", 
      completed: true,
      description: "Set up your pricing tiers and features",
      helpVideo: "/videos/pricing-setup.mp4",
      codeSnippet: "// Your pricing is already set up!",
      docLink: "/docs/pricing"
    },
    { 
      name: "SDK Integration", 
      completed: false,
      description: "Add the Atlas SDK to your application",
      helpVideo: "/videos/sdk-integration.mp4",
      codeSnippet: "npm install @atlas/sdk\n\n// In your app\nimport { Atlas } from '@atlas/sdk';\n\nconst atlas = new Atlas({\n  merchantId: \"" + userData.merchantId + "\",\n});",
      docLink: "/docs/sdk"
    },
    { 
      name: "Pricing Page", 
      completed: false,
      description: "Embed the pricing page in your app",
      helpVideo: "/videos/pricing-page.mp4",
      codeSnippet: "import { AtlasPricingPage } from '@atlas/react';\n\nfunction YourPricingPage() {\n  return <AtlasPricingPage merchantId=\"" + userData.merchantId + "\" />;\n}",
      docLink: "/docs/pricing-page"
    },
    { 
      name: "Connect Stripe", 
      completed: false,
      description: "Link your Stripe account to process payments",
      helpVideo: "/videos/stripe-connect.mp4",
      codeSnippet: "// No code needed, just connect your Stripe account\n// in the integrations section",
      docLink: "/docs/stripe"
    }
  ];

  // Calculate onboarding progress
  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const totalSteps = onboardingSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const allStepsCompleted = completedSteps === totalSteps;

  // Handle code copying
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "The code snippet has been copied to your clipboard."
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 1. Personalized Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userData.name}</h1>
          <p className="text-gray-500">
            Here's an overview of your platform's performance.
          </p>
        </div>
        
        <div>
          <Button variant="outline" onClick={() => window.open("https://docs.example.com", "_blank")}>
            <FileText className="mr-2 h-4 w-4" />
            Dev Documentation
          </Button>
        </div>
      </div>
      
      {/* 2. Enhanced Onboarding Status with Guided Experience */}
      <Card className={`p-6 ${allStepsCompleted ? 'bg-green-50 border-green-200' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Onboarding Status</h2>
              {allStepsCompleted && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <Check size={12} className="mr-1" />
                  Complete
                </span>
              )}
            </div>
            <p className={`${allStepsCompleted ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
              {allStepsCompleted 
                ? "🎉 All steps completed! Your app is fully set up and ready to monetize."
                : `${completedSteps} of ${totalSteps} steps completed${completedSteps > 0 ? ` - ${totalSteps - completedSteps} steps left to start monetizing!` : ""}`}
            </p>
          </div>
          
          {!allStepsCompleted && (
            <Button 
              variant="default"
              size="sm"
              className="mt-2 md:mt-0"
              onClick={() => navigate("/onboarding")}
            >
              Continue Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Progress value={progressPercentage} className={`h-2 mb-4 ${allStepsCompleted ? 'bg-green-100' : ''}`} />
        
        {/* Onboarding Steps with Help Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {onboardingSteps.map((step, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all hover:shadow-md ${
                step.completed 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${
                    step.completed ? "bg-green-100" : "bg-gray-200"
                  }`}>
                    {step.completed ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <span className="text-xs font-semibold w-4 h-4 flex items-center justify-center text-gray-500">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{step.name}</p>
                    <p className="text-xs text-gray-500">
                      {step.completed ? "Completed" : step.description}
                    </p>
                  </div>
                </div>

                {!step.completed && (
                  <>
                    <div className="mt-4 border-t pt-3">
                      <Tabs defaultValue="code">
                        <TabsList className="mb-2">
                          <TabsTrigger value="code" className="text-xs">
                            <Code className="h-3 w-3 mr-1" />
                            Code
                          </TabsTrigger>
                          <TabsTrigger value="help" className="text-xs">
                            <Play className="h-3 w-3 mr-1" />
                            Help
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="code">
                          <div className="relative bg-gray-900 rounded-md p-2">
                            <pre className="text-xs text-gray-200 whitespace-pre-wrap max-h-24 overflow-y-auto">
                              {step.codeSnippet}
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-white"
                              onClick={() => handleCopyCode(step.codeSnippet)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TabsContent>
                        <TabsContent value="help">
                          <div className="text-xs flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 w-full justify-start text-xs"
                              onClick={() => navigate("/onboarding")}
                            >
                              <Play className="h-3 w-3 mr-1.5" />
                              Watch quick tutorial
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 w-full justify-start text-xs"
                              onClick={() => window.open(step.docLink, "_blank")}
                            >
                              <FileText className="h-3 w-3 mr-1.5" />
                              View documentation
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 w-full justify-start text-xs bg-primary/5"
                            >
                              <MessageSquare className="h-3 w-3 mr-1.5" />
                              Chat with support
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-6 px-0 text-primary text-xs font-medium"
                        onClick={() => navigate("/onboarding")}
                      >
                        Complete this step
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Limited Access Warning */}
        {!allStepsCompleted && (
          <Alert className="mt-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Limited dashboard access</AlertTitle>
            <AlertDescription className="text-amber-700">
              Complete all steps to unlock full features. You can explore the dashboard in preview mode.
            </AlertDescription>
          </Alert>
        )}

        {/* Celebration Banner */}
        {allStepsCompleted && (
          <div className="mt-4 bg-gradient-to-r from-green-100 via-cyan-100 to-blue-100 p-4 rounded-lg border border-green-200 text-center">
            <div className="flex justify-center mb-2">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-green-800">You're ready to monetize!</h3>
            <p className="text-green-700 mb-3">Your Atlas integration is complete. You can now start managing subscriptions and generating revenue.</p>
            <div className="flex justify-center gap-2">
              <Button 
                size="sm"
                onClick={() => navigate("/customers")}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Customers
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate("/integrations")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Stripe Dashboard
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* 3. Pricing Model Display */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Your Pricing Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.pricingModel.plans.map((plan, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-md ${index === 1 ? "bg-primary/5 border border-primary/20" : "bg-gray-50"}`}
            >
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <div className="my-2">
                <span className="text-xl font-bold">${plan.price}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              
              <div className="space-y-2 mt-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">
                      {feature.type === "limit" 
                        ? `${feature.name}: ${feature.limit}` 
                        : feature.name
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* 4. Business Health Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Revenue Overview</CardTitle>
            <CardDescription>Your monthly recurring revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <h4 className="text-2xl font-bold">${userData.metrics.mrr}</h4>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
                  userData.metrics.mrrGrowth >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <TrendingUp size={14} className="mr-1" />
                  {userData.metrics.mrrGrowth}% this month
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Plan Distribution</p>
                <div className="space-y-2">
                  {Object.entries(userData.metrics.planDistribution).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${
                          plan === "Basic" ? "bg-blue-500" : 
                          plan === "Pro" ? "bg-purple-500" : "bg-green-500"
                        } mr-2`}></div>
                        <span className="text-sm">{plan}</span>
                      </div>
                      <span className="text-sm font-medium">{count} customers</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Customer Overview</CardTitle>
            <CardDescription>Your customer growth and conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <h4 className="text-2xl font-bold">{userData.metrics.totalCustomers}</h4>
                <div className="text-sm text-green-600">
                  +{userData.metrics.newCustomers} this month
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Trial Conversion</p>
                <h4 className="text-2xl font-bold">{userData.metrics.trialConversion}%</h4>
                <div className="text-sm text-gray-500">
                  Of trial users convert
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 5. Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          <CardDescription>Latest events on your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`p-2 rounded-full mr-3 ${
                  activity.type === "signup" ? "bg-green-100" :
                  activity.type === "payment" ? "bg-blue-100" : "bg-purple-100"
                }`}>
                  {activity.type === "signup" && <Users size={16} className="text-green-600" />}
                  {activity.type === "payment" && <CreditCard size={16} className="text-blue-600" />}
                  {activity.type === "upgrade" && <TrendingUp size={16} className="text-purple-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {activity.type === "signup" && `${activity.name} signed up for ${activity.plan}`}
                    {activity.type === "payment" && `${activity.name} made a payment of $${activity.amount}`}
                    {activity.type === "upgrade" && `${activity.name} upgraded from ${activity.fromPlan} to ${activity.toPlan}`}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <Button variant="ghost" className="w-full" onClick={() => navigate("/customers")}>
            View All Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
