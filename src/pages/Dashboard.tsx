
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Bell
} from "lucide-react";

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
    sdkIntegrated: true,
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

  // Calculate onboarding progress
  const onboardingSteps = [
    { name: "Sign Up", completed: true, actionRoute: "/signup" },
    { name: "Create Pricing", completed: !!userData.pricingModel, actionRoute: "/pricing-model" },
    { name: "SDK Integration", completed: userData.sdkIntegrated, actionRoute: "/integrations" },
    { name: "Connect Stripe", completed: userData.stripeConnected, actionRoute: "/integrations" },
  ];
  
  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100;

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 1. Personalized Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userData.name}</h1>
          <p className="text-gray-500">
            Your account is {Math.round(progressPercentage)}% complete. 
            {progressPercentage < 100 ? " Complete all steps to fully launch your platform." : " You're all set up!"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/widgets")}>
            Customize Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/settings")}>
            View Settings
          </Button>
        </div>
      </div>
      
      {/* 2. Guided Onboarding Path */}
      <Card className="p-6">
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
                <Button size="sm" variant="outline" onClick={() => navigate(step.actionRoute)}>
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {progressPercentage < 100 && (
          <Button className="mt-6 w-full sm:w-auto" onClick={() => navigate(onboardingSteps.find(step => !step.completed)?.actionRoute || "/")}>
            Continue Onboarding <ArrowRight size={16} className="ml-2" />
          </Button>
        )}
      </Card>
      
      {/* 3. Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`p-4 ${!userData.pricingModel ? "border-blue-300 bg-blue-50" : ""}`}>
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-medium">Pricing Model</h3>
              <p className="text-sm text-gray-500 mb-2">
                {userData.pricingModel ? 
                  `${userData.pricingModel.plans.length} plans configured` : 
                  "Create your pricing plans"}
              </p>
              <Button 
                size="sm" 
                variant={userData.pricingModel ? "outline" : "default"} 
                onClick={() => navigate("/pricing-model")}
              >
                {userData.pricingModel ? "Manage Plans" : "Create Plans"}
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className={`p-4 ${!userData.sdkIntegrated ? "border-purple-300 bg-purple-50" : ""}`}>
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-purple-100 text-purple-600 mr-3">
              <Code size={20} />
            </div>
            <div>
              <h3 className="font-medium">SDK Integration</h3>
              <p className="text-sm text-gray-500 mb-2">
                {userData.sdkIntegrated ? 
                  "SDK successfully integrated" : 
                  "Connect your app with our SDK"}
              </p>
              <Button 
                size="sm" 
                variant={userData.sdkIntegrated ? "outline" : "default"} 
                onClick={() => navigate("/integrations")}
              >
                {userData.sdkIntegrated ? "View Integration" : "Integrate SDK"}
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className={`p-4 ${!userData.stripeConnected ? "border-green-300 bg-green-50" : ""}`}>
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="font-medium">Stripe Connection</h3>
              <p className="text-sm text-gray-500 mb-2">
                {userData.stripeConnected ? 
                  "Payment processing ready" : 
                  "Connect Stripe to accept payments"}
              </p>
              <Button 
                size="sm" 
                variant={userData.stripeConnected ? "outline" : "default"} 
                onClick={() => navigate("/integrations")}
              >
                {userData.stripeConnected ? "Payment Settings" : "Connect Stripe"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
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
      
      {/* 5-7. Tabbed Interface for Recent Activity, Learning Resources, and Support */}
      <Card>
        <Tabs defaultValue="activity">
          <div className="px-6 pt-6">
            <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-flex">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Bell size={16} />
                <span>Recent Activity</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Support</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Recent Activity Feed */}
          <TabsContent value="activity" className="p-0">
            <CardContent className="pt-6">
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
          </TabsContent>
          
          {/* Learning Resources */}
          <TabsContent value="resources" className="p-0">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start pb-4 border-b border-gray-100">
                  <div className="p-2 rounded-full bg-amber-100 mr-3">
                    <FileText size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Getting Started Guide</p>
                    <p className="text-xs text-gray-500 mb-2">Learn the basics of setting up your platform</p>
                    <Button size="sm" variant="outline">Read Guide</Button>
                  </div>
                </div>
                
                <div className="flex items-start pb-4 border-b border-gray-100">
                  <div className="p-2 rounded-full bg-purple-100 mr-3">
                    <Code size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">SDK Integration Tutorial</p>
                    <p className="text-xs text-gray-500 mb-2">Step-by-step guide to integrating our SDK</p>
                    <Button size="sm" variant="outline">Watch Tutorial</Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <CreditCard size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Stripe Connection Guide</p>
                    <p className="text-xs text-gray-500 mb-2">How to set up payment processing</p>
                    <Button size="sm" variant="outline">View Guide</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" className="w-full">
                View All Resources
              </Button>
            </CardFooter>
          </TabsContent>
          
          {/* Support Access */}
          <TabsContent value="support" className="p-0">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start pb-4 border-b border-gray-100">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <MessageSquare size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Chat Support</p>
                    <p className="text-xs text-gray-500 mb-2">Get immediate help from our team</p>
                    <Button size="sm">Start Chat</Button>
                  </div>
                </div>
                
                <div className="flex items-start pb-4 border-b border-gray-100">
                  <div className="p-2 rounded-full bg-amber-100 mr-3">
                    <Calendar size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Schedule a Call</p>
                    <p className="text-xs text-gray-500 mb-2">Book a time with our support team</p>
                    <Button size="sm" variant="outline">Book Call</Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-100 mr-3">
                    <Users size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Community Forum</p>
                    <p className="text-xs text-gray-500 mb-2">Connect with other users</p>
                    <Button size="sm" variant="outline">Visit Forum</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" className="w-full">
                View Help Center
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Dashboard;
