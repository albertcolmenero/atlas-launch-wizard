
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code, Copy, Palette, Check, Font } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface WidgetConfigurationProps {
  widget: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

const WidgetConfiguration: React.FC<WidgetConfigurationProps> = ({ widget }) => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      primaryColor: "#9b87f5",
      fontFamily: "Inter",
      borderRadius: 8,
      showLogo: true,
      customCss: "",
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = () => {
    const { primaryColor, fontFamily, borderRadius, showLogo } = form.getValues();
    
    if (widget.id === "pricing-page") {
      return `<div id="atlas-pricing-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.atlas.com/widgets/pricing.js';
    script.async = true;
    document.body.appendChild(script);
    
    window.atlasConfig = {
      apiKey: "your-api-key",
      primaryColor: "${primaryColor}",
      fontFamily: "${fontFamily}",
      borderRadius: ${borderRadius},
      showLogo: ${showLogo},
    };
  })();
</script>`;
    } else if (widget.id === "customer-portal") {
      return `<div id="atlas-customer-portal"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.atlas.com/widgets/customer-portal.js';
    script.async = true;
    document.body.appendChild(script);
    
    window.atlasConfig = {
      apiKey: "your-api-key",
      primaryColor: "${primaryColor}",
      fontFamily: "${fontFamily}",
      borderRadius: ${borderRadius},
      showLogo: ${showLogo},
    };
  })();
</script>`;
    }
  };

  const getAIPrompt = () => {
    const { primaryColor, fontFamily, borderRadius, showLogo } = form.getValues();
    
    if (widget.id === "pricing-page") {
      return `Add the Atlas Pricing Widget to my website with these settings:
- Primary color: ${primaryColor}
- Font family: ${fontFamily}
- Border radius: ${borderRadius}px
- ${showLogo ? 'Show Atlas logo' : 'Hide Atlas logo'}

Please set up all the necessary script tags and configuration.`;
    } else if (widget.id === "customer-portal") {
      return `Add the Atlas Customer Portal Widget to my website with these settings:
- Primary color: ${primaryColor}
- Font family: ${fontFamily}
- Border radius: ${borderRadius}px
- ${showLogo ? 'Show Atlas logo' : 'Hide Atlas logo'}

Please set up all the necessary script tags and configuration.`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>{widget.icon}</span> {widget.title}
        </h2>
        <p className="text-gray-500">{widget.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Style Configuration</CardTitle>
              <CardDescription>Customize how the widget looks on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="space-y-6">
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Palette className="h-4 w-4" /> Primary Color
                    </FormLabel>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded border" 
                        style={{ backgroundColor: form.watch("primaryColor") }}
                      />
                      <FormControl>
                        <Input 
                          type="color"
                          {...form.register("primaryColor")}
                          className="w-20 h-10"
                        />
                      </FormControl>
                      <Input 
                        type="text"
                        value={form.watch("primaryColor")}
                        onChange={(e) => form.setValue("primaryColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Font className="h-4 w-4" /> Font Family
                    </FormLabel>
                    <FormControl>
                      <select
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...form.register("fontFamily")}
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                      </select>
                    </FormControl>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Border Radius: {form.watch("borderRadius")}px</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[form.watch("borderRadius")]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(value) => form.setValue("borderRadius", value[0])}
                      />
                    </FormControl>
                  </FormItem>
                  
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Show Atlas Logo</FormLabel>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        {...form.register("showLogo")}
                        className="ml-auto h-5 w-5"
                      />
                    </FormControl>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Custom CSS (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=".atlas-widget { /* your custom styles */ }"
                        className="font-mono"
                        {...form.register("customCss")}
                      />
                    </FormControl>
                  </FormItem>
                </div>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Widget Preview</CardTitle>
              <CardDescription>This is how your widget will appear on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg flex items-center justify-center h-48 bg-muted/50">
                <div className="text-center">
                  <p>Preview will appear here</p>
                  <Badge className="mt-2">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Snippet</CardTitle>
              <CardDescription>Add this code to your website to display the widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[300px] text-sm">
                  <code className="text-xs md:text-sm">{getCodeSnippet()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(getCodeSnippet())}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Prompt</CardTitle>
              <CardDescription>Use this prompt with AI tools like Cursor, Lovable, or GitHub Copilot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[300px] whitespace-pre-wrap">
                  <code className="text-xs md:text-sm">{getAIPrompt()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(getAIPrompt())}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Learn more about integrating Atlas widgets</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Documentation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WidgetConfiguration;
