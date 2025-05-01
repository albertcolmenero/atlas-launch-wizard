
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CircleDollarSign, Settings, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const StripeConfigurationPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDisconnect = () => {
    // In a real app, this would call your backend to disconnect Stripe
    toast({
      title: "Stripe Disconnected",
      description: "Your Stripe account has been disconnected.",
    });
  };

  // Mock data for demonstration
  const webhookEvents = [
    { name: "checkout.session.completed", status: "active" },
    { name: "customer.subscription.updated", status: "active" },
    { name: "invoice.payment_succeeded", status: "active" },
    { name: "customer.subscription.deleted", status: "inactive" },
  ];

  const paymentMethods = [
    { name: "Credit Card", enabled: true },
    { name: "Apple Pay", enabled: true },
    { name: "Google Pay", enabled: false },
    { name: "ACH Direct Debit", enabled: false },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-green-100 bg-green-50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="h-6 w-6 text-[#635BFF]" />
              <div>
                <CardTitle>Stripe Connected</CardTitle>
                <CardDescription>Your Stripe integration is active and working properly.</CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500">Connected</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Account</p>
              <p className="text-sm text-muted-foreground">Atlas, Inc.</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Mode</p>
              <p className="text-sm text-muted-foreground">Test</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Connection Status</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" /> Healthy
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={() => window.open("https://dashboard.stripe.com", "_blank")}>
            Open Stripe Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage the payment methods available to your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.name}>
                      <TableCell>{method.name}</TableCell>
                      <TableCell>
                        {method.enabled ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="mr-1 h-3 w-3" /> Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                            <X className="mr-1 h-3 w-3" /> Disabled
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Test Credentials</CardTitle>
              <CardDescription>
                Use these test credentials to simulate payments in your test environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
                <div className="flex items-center justify-between space-x-4 px-4">
                  <h4 className="text-sm font-semibold">Test Card Numbers</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {isOpen ? "Hide" : "Show"}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="rounded-md border px-4 py-3">
                    <p className="font-mono text-sm">4242 4242 4242 4242</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use this for successful payments
                    </p>
                  </div>
                  <div className="rounded-md border px-4 py-3">
                    <p className="font-mono text-sm">4000 0000 0000 0002</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use this for declined payments
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>
                Manage the webhook events that are sent from Stripe to your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookEvents.map((event) => (
                    <TableRow key={event.name}>
                      <TableCell className="font-mono text-sm">{event.name}</TableCell>
                      <TableCell>
                        {event.status === "active" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                            <X className="mr-1 h-3 w-3" /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Configure Webhook Events
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Webhook URL</CardTitle>
              <CardDescription>
                Your webhook URL is where Stripe will send event notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-auto">
                https://api.yourdomain.com/webhooks/stripe
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure how payments are processed and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Automatic Tax Calculation</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically calculate and collect tax on payments
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5" checked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Invoice Generation</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically generate invoices for payments
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5" checked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Automatic Payment Recovery</p>
                  <p className="text-xs text-muted-foreground">
                    Attempt to recover failed payments automatically
                  </p>
                </div>
                <input type="checkbox" className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Destructive actions that cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" size="sm">
                Reset Stripe Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StripeConfigurationPanel;
