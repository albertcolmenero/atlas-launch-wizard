
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type FeatureType = {
  name: string;
  type: "boolean" | "limit";
  limit?: string;
};

type PricingPlanFeaturesProps = {
  planIndex: number;
  features: FeatureType[];
  updateFeature: (planIndex: number, featureIndex: number, field: string, value: any) => void;
};

export const PricingPlanFeatures = ({ 
  planIndex, 
  features, 
  updateFeature 
}: PricingPlanFeaturesProps) => {
  return (
    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
      {features.map((feature, featureIndex) => (
        <div key={featureIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
          <div className="flex-grow overflow-hidden">
            <div className="text-sm font-medium truncate">{feature.name}</div>
            
            <div className="flex items-center mt-1 gap-2">
              <Select 
                value={feature.type} 
                onValueChange={(value: "boolean" | "limit") => updateFeature(planIndex, featureIndex, 'type', value)}
              >
                <SelectTrigger className="h-7 text-xs px-2 w-[90px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boolean">Included</SelectItem>
                  <SelectItem value="limit">Limited</SelectItem>
                </SelectContent>
              </Select>
              
              {feature.type === "limit" && (
                <Input
                  type="text"
                  placeholder="Limit"
                  value={feature.limit}
                  onChange={(e) => updateFeature(planIndex, featureIndex, 'limit', e.target.value)}
                  className="h-7 text-xs w-[90px]"
                />
              )}
            </div>
          </div>
        </div>
      ))}
      {features.length === 0 && (
        <p className="text-sm text-gray-500">No features added</p>
      )}
    </div>
  );
};
