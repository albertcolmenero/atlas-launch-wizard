
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Settings } from "lucide-react";
import WidgetConfiguration from "../components/widgets/WidgetConfiguration";

const WIDGETS = [
  {
    id: "pricing-page",
    title: "Pricing Page Widget",
    description: "Embed your Atlas pricing page into any website or application.",
    icon: "💰",
  },
  {
    id: "customer-portal",
    title: "Customer Portal Widget",
    description: "Allow your customers to manage their subscriptions and billing details.",
    icon: "👥",
  }
];

const Widgets = () => {
  const [selectedWidget, setSelectedWidget] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Widgets</h1>
        <p className="text-gray-500 mb-6">Integrate Atlas into your apps with these ready-to-use widgets.</p>
      </div>

      {selectedWidget ? (
        <div className="space-y-6">
          <Button 
            variant="outline"
            onClick={() => setSelectedWidget(null)}
            className="mb-4"
          >
            ← Back to widgets
          </Button>
          <WidgetConfiguration 
            widget={WIDGETS.find(w => w.id === selectedWidget)} 
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {WIDGETS.map((widget) => (
            <Card key={widget.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{widget.icon}</span>
                  <CardTitle>{widget.title}</CardTitle>
                </div>
                <CardDescription>{widget.description}</CardDescription>
              </CardHeader>
              <CardFooter className="bg-muted/50 p-4">
                <Button onClick={() => setSelectedWidget(widget.id)} className="w-full">
                  Configure Widget
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Widgets;
