
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

type PlanType = {
  name: string;
  price: string;
  planType: "free" | "paid" | "custom";
  features: {
    name: string;
    type: "boolean" | "limit";
    limit?: string;
  }[];
  trialAvailable?: boolean;
  trialDays?: number;
  defaultOnCancel?: boolean;
};

type AnalyticsProps = {
  plans: PlanType[];
  analytics: {
    customersPerPlan: number[];
    churnRate: number[];
    conversionRates: { from: number; to: number; rate: number }[];
  };
};

export const PricingModelAnalytics = ({ plans, analytics }: AnalyticsProps) => {
  // Prepare data for the charts
  const customersData = plans.map((plan, index) => ({
    name: plan.name,
    customers: analytics.customersPerPlan[index] || 0,
  }));
  
  // Color palette
  const colors = ["#9b87f5", "#7E69AB", "#6E59A5"];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Distribution</CardTitle>
          <CardDescription>Number of customers per plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customersData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} customers`, ""]} />
                <Bar dataKey="customers" fill="#9b87f5">
                  {customersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Plan</th>
                  <th className="text-right py-2 font-medium">Customers</th>
                  <th className="text-right py-2 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => {
                  const customers = analytics.customersPerPlan[index] || 0;
                  const totalCustomers = analytics.customersPerPlan.reduce((acc, curr) => acc + curr, 0);
                  const percentage = totalCustomers ? (customers / totalCustomers * 100).toFixed(1) : "0.0";
                  
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2">{plan.name}</td>
                      <td className="py-2 text-right">{customers}</td>
                      <td className="py-2 text-right">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Churn Rate</CardTitle>
            <CardDescription>Monthly customer churn per plan</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Coming Soon</Badge>
              <p className="text-gray-500 text-sm">Churn rate analytics will be available soon</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rates</CardTitle>
            <CardDescription>How customers move between plans</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">Coming Soon</Badge>
              <p className="text-gray-500 text-sm">Conversion analytics will be available soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Future metrics cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>MRR</CardTitle>
            <CardDescription>Monthly recurring revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[100px] flex items-center justify-center">
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>LTV</CardTitle>
            <CardDescription>Lifetime value per plan</CardDescription>
          </CardHeader>
          <CardContent className="h-[100px] flex items-center justify-center">
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Retention</CardTitle>
            <CardDescription>Customer retention metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[100px] flex items-center justify-center">
            <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
