
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building } from "lucide-react";

type OrganizationSetupStepProps = {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

const OrganizationSetupStep = ({ onNext, onBack, updateUserData, userData }: OrganizationSetupStepProps) => {
  const [orgName, setOrgName] = useState(userData.organizationName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgName.trim()) {
      setError("Please enter an organization name");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    // Update user data with organization name
    updateUserData({ organizationName: orgName });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onNext();
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Create Your Organization</h2>
        <p className="text-gray-500 mt-2">Set up your company or team</p>
      </div>

      <Card className="p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Building className="h-4 w-4" />
                </div>
                <Input
                  id="org-name"
                  className="pl-10"
                  placeholder="Acme Inc."
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This will be displayed in your billing and invoices
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Continue"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OrganizationSetupStep;
