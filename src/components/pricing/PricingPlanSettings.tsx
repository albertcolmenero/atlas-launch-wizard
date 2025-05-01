
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

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

type PricingPlanSettingsProps = {
  plan: PlanType;
  planIndex: number;
  updatePlan: (index: number, field: string, value: any) => void;
  setDefaultOnCancelPlan: (planIndex: number) => void;
};

export const PricingPlanSettings = ({ 
  plan, 
  planIndex, 
  updatePlan, 
  setDefaultOnCancelPlan 
}: PricingPlanSettingsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`trial-toggle-${planIndex}`}>Trial Period</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Offer a trial for this plan</span>
              <Switch
                id={`trial-toggle-${planIndex}`}
                checked={plan.trialAvailable || false}
                onCheckedChange={(checked) => updatePlan(planIndex, 'trialAvailable', checked)}
              />
            </div>
          </div>
          
          {plan.trialAvailable && (
            <div className="space-y-2">
              <Label htmlFor={`trial-days-${planIndex}`}>Trial Duration</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`trial-days-${planIndex}`}
                  type="number"
                  value={plan.trialDays || 14}
                  onChange={(e) => updatePlan(planIndex, 'trialDays', parseInt(e.target.value))}
                  className="w-24"
                  min={1}
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2 pt-2 border-t">
            <Label>Default Plan</Label>
            <div className="flex items-center justify-between">
              <span className="text-sm">Make this the default plan when users cancel</span>
              <Switch
                id={`default-${planIndex}`}
                checked={plan.defaultOnCancel || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setDefaultOnCancelPlan(planIndex);
                  }
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Users will be automatically moved to this plan when they cancel their subscription
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
