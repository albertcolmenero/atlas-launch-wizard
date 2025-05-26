
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, ArrowUpRight } from "lucide-react";

const DevelopmentDashboard = () => {
  // Mock data - in a real app this would come from API
  const metrics = {
    mrr: 12450,
    arr: 149400,
    customers: 127,
    mrrGrowth: 12.5,
    arrGrowth: 18.3,
    customerGrowth: 8.2
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Development Dashboard</h1>
        <p className="text-gray-600">Monitor your Atlas integration and business metrics</p>
      </div>

      {/* What's Next Section */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            What's Next
          </CardTitle>
          <CardDescription>
            Recommended next steps to optimize your Atlas integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Customize Your Pricing Page</h4>
              <p className="text-blue-700 text-sm mb-3">
                Personalize your pricing page design to match your brand
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Customize Design
              </Button>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Add More Payment Methods</h4>
              <p className="text-green-700 text-sm mb-3">
                Enable additional payment options to increase conversion
              </p>
              <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                Configure Payments
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Widgets */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* MRR Widget */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.mrr)}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {formatPercentage(metrics.mrrGrowth)} from last month
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ARR Widget */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Annual Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.arr)}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {formatPercentage(metrics.arrGrowth)} from last year
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Widget */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.customers.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {formatPercentage(metrics.customerGrowth)} from last month
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>Your Atlas integration is active and processing payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentDashboard;
