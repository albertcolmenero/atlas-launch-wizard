
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CircleDollarSign,
  CreditCard,
  Link,
  Check,
  X,
  Settings
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import StripeConnectionForm from "../components/integrations/StripeConnectionForm";
import StripeConfigurationPanel from "../components/integrations/StripeConfigurationPanel";

const Integrations = () => {
  const [activeTab, setActiveTab] = useState("stripe");
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = (connected: boolean) => {
    setIsStripeConnected(connected);
    if (connected) {
      toast({
        title: "Stripe Connected",
        description: "Your Stripe account has been successfully connected.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-gray-500 mb-6">Connect third-party services to enhance your Atlas experience.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="upcoming" disabled className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            More Coming Soon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe" className="space-y-6">
          {!isStripeConnected ? (
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-3">
                  <CircleDollarSign className="h-6 w-6 text-[#635BFF]" />
                  <CardTitle>Connect Stripe</CardTitle>
                </div>
                <CardDescription>
                  Integrate with Stripe to accept payments, manage subscriptions, and handle billing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StripeConnectionForm onConnectChange={handleConnect} />
              </CardContent>
            </Card>
          ) : (
            <StripeConfigurationPanel />
          )}
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>More Integrations Coming Soon</CardTitle>
              <CardDescription>
                We're working hard to bring more integrations to Atlas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We're currently developing integrations with payment processors, 
                marketing tools, analytics platforms, and more. Stay tuned for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
