
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type FeatureType = {
  name: string;
  type: "boolean" | "limit";
  limit?: string;
};

type PricingPlanFeaturesProps = {
  planIndex: number;
  features: FeatureType[];
  updateFeature: (planIndex: number, featureIndex: number, field: string, value: any) => void;
  sharedFeatures?: string[];
  addFeatureToPlans?: (feature: string) => void;
  removeFeatureFromPlan?: (planIndex: number, featureIndex: number) => void;
  moveFeatureUp?: (planIndex: number, featureIndex: number) => void;
  moveFeatureDown?: (planIndex: number, featureIndex: number) => void;
  addFeatureToPlan?: (planIndex: number, featureName: string) => void;
};

export const PricingPlanFeatures = ({ 
  planIndex, 
  features, 
  updateFeature,
  sharedFeatures,
  addFeatureToPlans,
  removeFeatureFromPlan,
  moveFeatureUp,
  moveFeatureDown,
  addFeatureToPlan
}: PricingPlanFeaturesProps) => {
  const [newFeature, setNewFeature] = useState("");
  
  return (
    <div className="space-y-3">
      {/* Feature addition form for individual plans */}
      {sharedFeatures && addFeatureToPlans && (
        <div className="flex items-center gap-2 mb-4">
          <Select disabled={!sharedFeatures.length}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Add feature to plan" />
            </SelectTrigger>
            <SelectContent>
              {sharedFeatures
                .filter(feature => !features.some(f => f.name === feature))
                .map((feature, idx) => (
                  <SelectItem key={idx} value={feature}>{feature}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (newFeature) {
                addFeatureToPlans(newFeature);
                setNewFeature("");
              }
            }}
            disabled={!newFeature}
          >
            <Plus size={16} />
          </Button>
        </div>
      )}
      
      {/* Features list */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
            {/* Feature control buttons */}
            {moveFeatureUp && moveFeatureDown && (
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-gray-400"
                  onClick={() => moveFeatureUp(planIndex, featureIndex)}
                  disabled={featureIndex === 0}
                >
                  <ArrowUp size={12} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 text-gray-400"
                  onClick={() => moveFeatureDown(planIndex, featureIndex)}
                  disabled={featureIndex === features.length - 1}
                >
                  <ArrowDown size={12} />
                </Button>
              </div>
            )}
            
            <div className="flex-grow overflow-hidden">
              <div className="text-sm font-medium truncate flex justify-between items-center">
                {feature.name}
                
                {/* Remove feature button */}
                {removeFeatureFromPlan && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 text-gray-400 hover:text-red-500"
                    onClick={() => removeFeatureFromPlan(planIndex, featureIndex)}
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
              
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
    </div>
  );
};
