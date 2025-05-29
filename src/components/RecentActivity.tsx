
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, TrendingDown, DollarSign, UserX } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'new_customer' | 'upgrade' | 'downgrade' | 'cancel' | 'payment';
  customer: string;
  description: string;
  amount?: number;
  timestamp: string;
}

const RecentActivity = () => {
  // Mock data - in a real app this would come from API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'payment',
      customer: 'Sarah Johnson',
      description: 'Monthly subscription payment',
      amount: 29,
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'new_customer',
      customer: 'Michael Chen',
      description: 'Signed up for Premium plan',
      amount: 49,
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      type: 'upgrade',
      customer: 'Emma Davis',
      description: 'Upgraded from Basic to Premium',
      amount: 20,
      timestamp: '3 hours ago'
    },
    {
      id: '4',
      type: 'payment',
      customer: 'Alex Rodriguez',
      description: 'Annual subscription payment',
      amount: 299,
      timestamp: '5 hours ago'
    },
    {
      id: '5',
      type: 'downgrade',
      customer: 'Lisa Wang',
      description: 'Downgraded from Premium to Basic',
      timestamp: '1 day ago'
    },
    {
      id: '6',
      type: 'cancel',
      customer: 'John Smith',
      description: 'Cancelled subscription',
      timestamp: '2 days ago'
    }
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'new_customer':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'upgrade':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'downgrade':
        return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'cancel':
        return <UserX className="h-4 w-4 text-red-600" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getActivityBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'new_customer':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">New Customer</Badge>;
      case 'upgrade':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Upgrade</Badge>;
      case 'downgrade':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Downgrade</Badge>;
      case 'cancel':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Cancel</Badge>;
      case 'payment':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">Payment</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.customer}
                  </p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {activity.timestamp}
                  </p>
                  {activity.amount && (
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(activity.amount)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
