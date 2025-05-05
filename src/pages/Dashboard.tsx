
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
      
      {/* 2. Pricing Model Display */}
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
      
      {/* 3. Business Health Metrics */}
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
