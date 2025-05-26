
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, ArrowUpRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductionDashboard = () => {
  const navigate = useNavigate();
  
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
      {/* Header with Production Mode Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              Production
            </Badge>
          </div>
          <p className="text-gray-600">Monitor your Atlas integration and business metrics</p>
        </div>
      </div>

      {/* Overview Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">What's Next</h2>
        
        {/* What's Next Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg font-semibold">What's Next 1: Feature flag your app</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                ☑️ → ✅
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button size="sm" variant="outline" className="border-gray-300">
                Configure
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg font-semibold">What's Next 2: Embed Customer Portal</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                ☑️ → ✅
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button size="sm" variant="outline" className="border-gray-300">
                Configure
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Mission 1: Get your first customer</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                ☑️ → ✅
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button size="sm" variant="outline" className="border-gray-300">
                Track
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Mission 2: Scale to $10K MRR</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                ☑️ → ✅
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button size="sm" variant="outline" className="border-gray-300">
                Optimize
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
    </div>
  );
};

export default ProductionDashboard;
