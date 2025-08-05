
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Check, X, Sparkles, FileText, Upload, Globe, ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";

type PricingWizardStepProps = {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

type PlanType = {
  name: string;
  price: string;
  planType: "free" | "paid" | "custom";
  features: FeatureType[];
};

type FeatureType = {
  name: string;
  type: "boolean" | "limit";
  limit?: string;
};

// Input options for AI recommendations
type InputMethod = "url" | "document" | "text" | null;
type AIRecommendStep = "input" | "processing" | "pricing-check" | "feedback" | "context" | "recommendations";

const PricingWizardStep = ({ onNext, onBack, updateUserData, userData }: PricingWizardStepProps) => {
  // Basic view management
  const [view, setView] = useState<"choice" | "recommend" | "manual" | "import">("choice");
  
  // Import pricing state
  const [importUrl, setImportUrl] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importText, setImportText] = useState("");
  const [importStep, setImportStep] = useState<"input" | "processing" | "verification">("input");
  const [extractedPlans, setExtractedPlans] = useState<PlanType[]>([]);
  const [selectedImportMethod, setSelectedImportMethod] = useState<"url" | "pdf" | "image" | "text" | null>(null);
  
  // Original fields for recommendation flow
  const [currentRecommendStep, setCurrentRecommendStep] = useState(0);
  const [appType, setAppType] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [valueMetric, setValueMetric] = useState("");
  
  // New AI recommendation flow
  const [aiRecommendStep, setAiRecommendStep] = useState<AIRecommendStep>("input");
  const [selectedInputMethod, setSelectedInputMethod] = useState<InputMethod>(null);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [hasPricingPage, setHasPricingPage] = useState<boolean | null>(null);
  const [hasPricingIssues, setHasPricingIssues] = useState<boolean | null>(null);
  const [feedbackContext, setFeedbackContext] = useState("");
  const [selectedFeedbackTags, setSelectedFeedbackTags] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Manual pricing plan fields
  const [plans, setPlans] = useState<PlanType[]>([
    {
      name: "Basic",
      price: "29",
      planType: "paid",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "5" },
      ],
    }
  ]);

  const [sharedFeatures, setSharedFeatures] = useState<string[]>([
    "Core Features", "Users", "Projects", "Support"
  ]);

  const [newFeature, setNewFeature] = useState("");
  
  // Recommended plans (expanded with more options)
  const recommendedPlans: PlanType[] = [
    {
      name: "Basic Plan",
      price: "0",
      planType: "free",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "5" },
        { name: "Projects", type: "limit", limit: "3" },
        { name: "Basic Support", type: "boolean" },
      ],
    },
    {
      name: "Pro Plan",
      price: "79",
      planType: "paid",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "20" },
        { name: "Projects", type: "limit", limit: "10" },
        { name: "Priority Support", type: "boolean" },
        { name: "API Access", type: "boolean" },
      ],
    },
    {
      name: "Enterprise Plan",
      price: "",
      planType: "custom",
      features: [
        { name: "Core Features", type: "boolean" },
        { name: "Users", type: "limit", limit: "Unlimited" },
        { name: "Projects", type: "limit", limit: "Unlimited" },
        { name: "24/7 Support", type: "boolean" },
        { name: "API Access", type: "boolean" },
        { name: "Custom Integrations", type: "boolean" },
      ],
    }
  ];

  // AI-generated pricing models based on user input
  const [aiGeneratedPlans, setAiGeneratedPlans] = useState<{
    modelName: string;
    description: string;
    plans: PlanType[];
  }[]>([]);

  // Faux feedback tags for quick selection
  const feedbackTags = [
    "Too expensive", 
    "Too complex", 
    "Not competitive", 
    "Missing features", 
    "Need free tier",
    "Wrong value metric"
  ];

  // File upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
  };

  // Toggle feedback tags
  const toggleFeedbackTag = (tag: string) => {
    setSelectedFeedbackTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Process the input and move to the next AI recommendation step
  const processInput = () => {
    if (!selectedInputMethod) {
      toast({
        title: "Input required",
        description: "Please select an input method and provide the necessary information.",
        variant: "destructive",
      });
      return;
    }

    // Validate the selected input method
    if (
      (selectedInputMethod === "url" && !urlInput) ||
      (selectedInputMethod === "text" && !textInput) ||
      (selectedInputMethod === "document" && !uploadedFile)
    ) {
      toast({
        title: "Input required",
        description: "Please complete your selected input method.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAiRecommendStep("processing");

    // Simulate processing with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setProcessingProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate some AI plan options
        setAiGeneratedPlans([
          {
            modelName: "SaaS Standard",
            description: "A classic good-better-best model with a free tier to drive adoption",
            plans: [
              {
                name: "Free",
                price: "0",
                planType: "free",
                features: [
                  { name: "Core Features", type: "boolean" },
                  { name: "Users", type: "limit", limit: "2" },
                  { name: "Projects", type: "limit", limit: "1" },
                  { name: "Community Support", type: "boolean" },
                ],
              },
              {
                name: "Growth",
                price: "49",
                planType: "paid",
                features: [
                  { name: "Core Features", type: "boolean" },
                  { name: "Users", type: "limit", limit: "10" },
                  { name: "Projects", type: "limit", limit: "15" },
                  { name: "Priority Support", type: "boolean" },
                  { name: "API Access", type: "boolean" },
                ],
              },
              {
                name: "Scale",
                price: "99",
                planType: "paid",
                features: [
                  { name: "Core Features", type: "boolean" },
                  { name: "Users", type: "limit", limit: "30" },
                  { name: "Projects", type: "limit", limit: "Unlimited" },
                  { name: "Priority Support", type: "boolean" },
                  { name: "API Access", type: "boolean" },
                  { name: "Advanced Analytics", type: "boolean" },
                ],
              }
            ],
          },
          {
            modelName: "Developer Focus",
            description: "Optimized for technical users with usage-based pricing",
            plans: [
              {
                name: "Developer",
                price: "0",
                planType: "free",
                features: [
                  { name: "Core API", type: "boolean" },
                  { name: "API Calls", type: "limit", limit: "1,000/mo" },
                  { name: "Projects", type: "limit", limit: "1" },
                  { name: "Documentation", type: "boolean" },
                ],
              },
              {
                name: "Team",
                price: "79",
                planType: "paid",
                features: [
                  { name: "Full API Access", type: "boolean" },
                  { name: "API Calls", type: "limit", limit: "50,000/mo" },
                  { name: "Projects", type: "limit", limit: "10" },
                  { name: "Email Support", type: "boolean" },
                  { name: "Custom Domains", type: "boolean" },
                ],
              },
              {
                name: "Business",
                price: "249",
                planType: "paid",
                features: [
                  { name: "Full API Access", type: "boolean" },
                  { name: "API Calls", type: "limit", limit: "500,000/mo" },
                  { name: "Projects", type: "limit", limit: "Unlimited" },
                  { name: "Priority Support", type: "boolean" },
                  { name: "Custom Domains", type: "boolean" },
                  { name: "SSO/SAML", type: "boolean" },
                ],
              }
            ],
          },
        ]);
        
        setIsProcessing(false);
        setAiRecommendStep("pricing-check");
      }
    }, 500);
  };

  // Import file handling
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImportFile(file);
  };

  // Process import data
  const processImport = async () => {
    if (!selectedImportMethod) {
      toast({
        title: "Method required",
        description: "Please select an import method.",
        variant: "destructive",
      });
      return;
    }

    // Validate input based on method
    if (
      (selectedImportMethod === "url" && !importUrl) ||
      (selectedImportMethod === "text" && !importText) ||
      ((selectedImportMethod === "pdf" || selectedImportMethod === "image") && !importFile)
    ) {
      toast({
        title: "Input required",
        description: "Please provide the required input for your selected method.",
        variant: "destructive",
      });
      return;
    }

    setImportStep("processing");
    setIsProcessing(true);

    try {
      let extractedData: any = null;

      if (selectedImportMethod === "url") {
        const result = await FirecrawlService.extractPricingFromUrl(importUrl);
        if (!result.success) {
          throw new Error(result.error || "Failed to extract pricing from URL");
        }
        extractedData = result.data;
      } else if (selectedImportMethod === "text") {
        // For text input, we'll simulate parsing
        extractedData = { content: importText };
      } else if (selectedImportMethod === "pdf" || selectedImportMethod === "image") {
        // For files, we'll simulate processing
        extractedData = { fileName: importFile?.name };
      }

      // Simulate AI processing and extraction
      setTimeout(() => {
        // Mock extracted pricing plans
        const mockExtractedPlans: PlanType[] = [
          {
            name: "Starter",
            price: "0",
            planType: "free",
            features: [
              { name: "Basic Features", type: "boolean" },
              { name: "Users", type: "limit", limit: "3" },
              { name: "Projects", type: "limit", limit: "1" },
            ],
          },
          {
            name: "Professional",
            price: "29",
            planType: "paid",
            features: [
              { name: "All Features", type: "boolean" },
              { name: "Users", type: "limit", limit: "10" },
              { name: "Projects", type: "limit", limit: "5" },
              { name: "Priority Support", type: "boolean" },
            ],
          },
          {
            name: "Enterprise",
            price: "",
            planType: "custom",
            features: [
              { name: "All Features", type: "boolean" },
              { name: "Users", type: "limit", limit: "Unlimited" },
              { name: "Projects", type: "limit", limit: "Unlimited" },
              { name: "Dedicated Support", type: "boolean" },
              { name: "Custom Integration", type: "boolean" },
            ],
          },
        ];

        setExtractedPlans(mockExtractedPlans);
        setImportStep("verification");
        setIsProcessing(false);
        
        toast({
          title: "Pricing extracted successfully",
          description: "Please review and verify the extracted pricing plans.",
        });
      }, 2000);

    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to process import",
        variant: "destructive",
      });
      setImportStep("input");
      setIsProcessing(false);
    }
  };

  // Complete import process
  const handleImportComplete = () => {
    updateUserData({
      pricingModel: {
        type: "imported",
        plans: extractedPlans,
      },
    });
    onNext();
  };

  // Functions for original implementation
  const handleRecommendationComplete = () => {
    updateUserData({
      pricingModel: {
        type: "recommended",
        plans: recommendedPlans,
      },
    });
    onNext();
  };

  const handleAIRecommendationComplete = (selectedModel: number) => {
    updateUserData({
      pricingModel: {
        type: "ai-recommended",
        plans: aiGeneratedPlans[selectedModel].plans,
      },
    });
    onNext();
  };

  const handleManualSave = () => {
    if (plans.length === 0 || !plans.every(plan => plan.name)) {
      return; // Simple validation
    }
    
    updateUserData({
      pricingModel: {
        type: "manual",
        plans,
      },
    });
    onNext();
  };

  const nextRecommendStep = () => {
    if (currentRecommendStep < 3) {
      setCurrentRecommendStep(currentRecommendStep + 1);
    }
  };

  const addNewPlan = () => {
    // Create a new plan with the shared features
    const newPlan: PlanType = {
      name: `Plan ${plans.length + 1}`,
      price: "",
      planType: "paid",
      features: sharedFeatures.map(feature => {
        return { 
          name: feature, 
          type: feature === "Users" || feature === "Projects" ? "limit" : "boolean", 
          limit: feature === "Users" || feature === "Projects" ? "10" : undefined 
        } as FeatureType;
      }),
    };
    
    setPlans([...plans, newPlan]);
  };

  const removePlan = (index: number) => {
    const updatedPlans = [...plans];
    updatedPlans.splice(index, 1);
    setPlans(updatedPlans);
  };

  const updatePlan = (index: number, field: string, value: string) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setPlans(updatedPlans);
  };

  const updatePlanType = (index: number, planType: "free" | "paid" | "custom") => {
    const updatedPlans = [...plans];
    updatedPlans[index] = { 
      ...updatedPlans[index], 
      planType,
      // Reset price for free and custom plans
      price: planType === "free" ? "0" : planType === "custom" ? "" : updatedPlans[index].price
    };
    setPlans(updatedPlans);
  };

  const updateFeature = (planIndex: number, featureIndex: number, field: string, value: any) => {
    const updatedPlans = [...plans];
    if (field === 'type') {
      // If changing from boolean to limit, add a default limit
      const updatedFeature = {
        ...updatedPlans[planIndex].features[featureIndex],
        [field]: value,
        limit: value === 'limit' ? '10' : undefined
      };
      updatedPlans[planIndex].features[featureIndex] = updatedFeature;
    } else {
      // Regular update for other fields
      updatedPlans[planIndex].features[featureIndex] = {
        ...updatedPlans[planIndex].features[featureIndex],
        [field]: value
      };
    }
    setPlans(updatedPlans);
  };

  const addFeatureToAllPlans = () => {
    if (!newFeature.trim()) return;

    // Add to shared features
    if (!sharedFeatures.includes(newFeature)) {
      setSharedFeatures([...sharedFeatures, newFeature]);
    }

    // Add to all plans
    const updatedPlans = plans.map(plan => {
      if (!plan.features.some(f => f.name === newFeature)) {
        return {
          ...plan,
          features: [...plan.features, { name: newFeature, type: "boolean" } as FeatureType]
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    setNewFeature("");
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const updatedPlans = [...plans];
    const featureToRemove = updatedPlans[planIndex].features[featureIndex].name;

    // Remove from this specific plan
    updatedPlans[planIndex].features.splice(featureIndex, 1);
    setPlans(updatedPlans);
    
    // Check if this feature should be removed from shared features
    if (!plans.some(p => p.features.some(f => f.name === featureToRemove))) {
      setSharedFeatures(sharedFeatures.filter(f => f !== featureToRemove));
    }
  };

  // Render the new AI recommendation flow
  const renderAIRecommendationFlow = () => {
    switch (aiRecommendStep) {
      case "input":
        return (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">Tell us about your product</h3>
            <p className="text-gray-500 mb-6">
              We'll use this information to generate tailored pricing recommendations for your product.
              Choose one method below that works best for you.
            </p>

            <div className="space-y-6">
              {/* URL Input Option */}
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedInputMethod === "url" ? "border-2 border-primary bg-primary/5" : "hover:border-primary/40"
                )}
                onClick={() => setSelectedInputMethod("url")}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Paste a URL of your website</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      We'll analyze your website to understand your product and suggest pricing.
                    </p>
                    <Input
                      placeholder="https://your-product.com"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={selectedInputMethod !== "url" && selectedInputMethod !== null}
                      className={selectedInputMethod === "url" ? "border-primary" : ""}
                    />
                  </div>
                </div>
              </Card>

              {/* Document Upload Option */}
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedInputMethod === "document" ? "border-2 border-primary bg-primary/5" : "hover:border-primary/40"
                )}
                onClick={() => setSelectedInputMethod("document")}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Upload a document</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Upload a product spec, pitch deck, or description (PDF, DOC, etc.).
                    </p>
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-md p-4 text-center",
                        selectedInputMethod === "document" ? "border-primary/50 bg-primary/5" : "border-gray-200",
                        selectedInputMethod !== "document" && selectedInputMethod !== null ? "opacity-50" : ""
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedInputMethod === "document") {
                          document.getElementById("file-upload")?.click();
                        }
                      }}
                    >
                      {uploadedFile ? (
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="font-medium">{uploadedFile.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                            }}
                            disabled={selectedInputMethod !== "document"}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                          <p className="text-sm">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={selectedInputMethod !== "document"}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Text Input Option */}
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedInputMethod === "text" ? "border-2 border-primary bg-primary/5" : "hover:border-primary/40"
                )}
                onClick={() => setSelectedInputMethod("text")}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Describe your product in text</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Tell us about your product, target audience, and key features.
                    </p>
                    <Textarea
                      placeholder="My product is a collaboration tool for design teams. It helps designers share feedback, manage versions, and collaborate in real-time. Our target audience is design teams at mid-size companies..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={selectedInputMethod !== "text" && selectedInputMethod !== null}
                      className={cn(
                        "min-h-[120px]",
                        selectedInputMethod === "text" ? "border-primary" : ""
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setView("choice")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={processInput} disabled={!selectedInputMethod}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
        
      case "processing":
        return (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Analyzing your product</h3>
              <p className="text-gray-500 mt-2">
                We're processing your input to generate the best pricing recommendations.
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Analyzing product information</span>
                  <span>{Math.min(processingProgress, 30)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500" 
                    style={{ width: `${Math.min(processingProgress, 30)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Finding similar companies</span>
                  <span>{Math.max(0, Math.min(processingProgress - 30, 40))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500" 
                    style={{ width: `${Math.max(0, Math.min((processingProgress - 30) * (40/30), 40))}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Generating recommendations</span>
                  <span>{Math.max(0, Math.min(processingProgress - 70, 30))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500" 
                    style={{ width: `${Math.max(0, Math.min((processingProgress - 70) * (30/30), 30))}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">This usually takes about 15 seconds</p>
          </div>
        );
        
      case "pricing-check":
        return (
          <div className="max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-6">Do you have an existing pricing page?</h3>
            <p className="text-gray-500 mb-6">
              Let us know if you already have a pricing structure that we can improve upon.
            </p>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className={cn(
                  "flex-1 h-20 text-left p-4",
                  hasPricingPage === true ? "border-2 border-primary" : ""
                )}
                onClick={() => {
                  setHasPricingPage(true);
                  setAiRecommendStep("feedback");
                }}
              >
                <div>
                  <div className="font-medium text-base mb-1">Yes</div>
                  <div className="text-sm text-gray-500">I already have pricing</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className={cn(
                  "flex-1 h-20 text-left p-4",
                  hasPricingPage === false ? "border-2 border-primary" : ""
                )}
                onClick={() => {
                  setHasPricingPage(false);
                  setAiRecommendStep("recommendations");
                }}
              >
                <div>
                  <div className="font-medium text-base mb-1">No</div>
                  <div className="text-sm text-gray-500">I need pricing recommendations</div>
                </div>
              </Button>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setAiRecommendStep("input")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        );
        
      case "feedback":
        return (
          <div className="max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-6">
              Is there anything wrong with your current pricing page?
            </h3>
            <p className="text-gray-500 mb-6">
              Your feedback will help us generate more tailored recommendations.
            </p>
            
            <div className="flex gap-4 mb-6">
              <Button 
                variant="outline" 
                size="lg" 
                className={cn(
                  "flex-1 h-20 text-left p-4",
                  hasPricingIssues === true ? "border-2 border-primary" : ""
                )}
                onClick={() => {
                  setHasPricingIssues(true);
                  setAiRecommendStep("context");
                }}
              >
                <div>
                  <div className="font-medium text-base mb-1">Yes</div>
                  <div className="text-sm text-gray-500">There are issues I'd like to address</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className={cn(
                  "flex-1 h-20 text-left p-4",
                  hasPricingIssues === false ? "border-2 border-primary" : ""
                )}
                onClick={() => {
                  setHasPricingIssues(false);
                  setAiRecommendStep("recommendations");
                }}
              >
                <div>
                  <div className="font-medium text-base mb-1">No</div>
                  <div className="text-sm text-gray-500">But I'd still like suggestions</div>
                </div>
              </Button>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setAiRecommendStep("pricing-check")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        );
        
      case "context":
        return (
          <div className="max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-6">
              Tell us about your pricing issues
            </h3>
            <p className="text-gray-500 mb-6">
              This will help us tailor recommendations specific to your needs.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback-context">Describe the issues or what you'd like to improve</Label>
                <Textarea
                  id="feedback-context"
                  placeholder="Our current pricing doesn't convert well. We think our prices might be too high for our target audience..."
                  className="mt-2 min-h-[120px]"
                  value={feedbackContext}
                  onChange={(e) => setFeedbackContext(e.target.value)}
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Quick tags (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {feedbackTags.map((tag, index) => (
                    <div
                      key={index}
                      onClick={() => toggleFeedbackTag(tag)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm cursor-pointer transition-all",
                        selectedFeedbackTags.includes(tag)
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setAiRecommendStep("feedback")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setAiRecommendStep("recommendations")}
                disabled={!feedbackContext && selectedFeedbackTags.length === 0}
              >
                Generate Recommendations
              </Button>
            </div>
          </div>
        );
        
      case "recommendations":
        return (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Recommended Pricing Models</h3>
            <p className="text-gray-500 mb-6">
              Based on your input, here are pricing models that might work well for your product.
            </p>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              {aiGeneratedPlans.map((modelOption, modelIndex) => (
                <Card key={modelIndex} className="p-6 border">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold">{modelOption.modelName}</h4>
                    <p className="text-gray-500">{modelOption.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {modelOption.plans.map((plan, planIndex) => (
                      <div 
                        key={planIndex} 
                        className={cn(
                          "p-4 rounded-md",
                          planIndex === 1 ? "bg-primary/5 border border-primary/20" : "bg-gray-50"
                        )}
                      >
                        <h5 className="font-semibold text-lg">{plan.name}</h5>
                        <div className="my-2">
                          {plan.planType === "custom" ? (
                            <span className="text-xl font-bold text-gray-700">Custom</span>
                          ) : (
                            <span>
                              <span className="text-xl font-bold">${plan.price}</span>
                              <span className="text-sm text-gray-500">/mo</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          {plan.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center">
                              <Check size={16} className="text-green-500 mr-2 shrink-0" />
                              <span className="text-sm">
                                {feature.type === "limit" 
                                  ? `${feature.name}: ${feature.limit}` 
                                  : feature.name
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleAIRecommendationComplete(modelIndex)}
                      className="px-6"
                    >
                      Use This Model
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setPlans(modelOption.plans);
                        setView("manual");
                      }}
                    >
                      Customize
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => {
                  if (hasPricingIssues) {
                    setAiRecommendStep("context");
                  } else if (hasPricingPage !== null) {
                    setAiRecommendStep("pricing-check");
                  } else {
                    setAiRecommendStep("input");
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render import pricing flow
  const renderImportFlow = () => {
    switch (importStep) {
      case "input":
        return (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">Import Your Existing Pricing</h3>
            <p className="text-gray-500 mb-6">
              Import your current pricing structure from various sources. We'll extract and standardize your pricing plans automatically.
            </p>

            <div className="space-y-6">
              {/* URL Import Option */}
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedImportMethod === "url" ? "border-2 border-primary bg-primary/5" : "hover:border-primary/40"
                )}
                onClick={() => setSelectedImportMethod("url")}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Import from Website URL</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Paste your pricing page URL and we'll extract your existing plans and features.
                    </p>
                    <Input
                      placeholder="https://yourcompany.com/pricing"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={selectedImportMethod !== "url" && selectedImportMethod !== null}
                      className={selectedImportMethod === "url" ? "border-primary" : ""}
                    />
                  </div>
                </div>
              </Card>

              {/* PDF Upload Option */}
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedImportMethod === "pdf" ? "border-2 border-primary bg-primary/5" : "hover:border-primary/40"
                )}
                onClick={() => setSelectedImportMethod("pdf")}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Upload PDF Document</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Upload a PDF with your pricing information (pricing sheet, proposal, etc.).
                    </p>
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-md p-4 text-center",
                        selectedImportMethod === "pdf" ? "border-primary/50 bg-primary/5" : "border-gray-200",
                        selectedImportMethod !== "pdf" && selectedImportMethod !== null ? "opacity-50" : ""
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedImportMethod === "pdf") {
                          document.getElementById("pdf-upload")?.click();
                        }
                      }}
                    >
                      {importFile && selectedImportMethod === "pdf" ? (
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="font-medium">{importFile.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setImportFile(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                          <p className="text-sm">Click to upload PDF</p>
                          <p className="text-xs text-gray-500">PDF files up to 10MB</p>
                        </div>
                      )}
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleImportFileChange}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Image Upload Option */}
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedImportMethod === "image" ? "border-2 border-primary bg-primary/5" : "hover:border-primary/40"
                )}
                onClick={() => setSelectedImportMethod("image")}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Upload Image/Screenshot</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Upload a screenshot of your pricing page or pricing table image.
                    </p>
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-md p-4 text-center",
                        selectedImportMethod === "image" ? "border-primary/50 bg-primary/5" : "border-gray-200",
                        selectedImportMethod !== "image" && selectedImportMethod !== null ? "opacity-50" : ""
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedImportMethod === "image") {
                          document.getElementById("image-upload")?.click();
                        }
                      }}
                    >
                      {importFile && selectedImportMethod === "image" ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Download className="h-5 w-5 text-primary" />
                          <span className="font-medium">{importFile.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setImportFile(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                          <p className="text-sm">Click to upload image</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        className="hidden"
                        onChange={handleImportFileChange}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Text Input Option */}
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all",
                  selectedImportMethod === "text" ? "border-2 border-primary bg-primary/5" : "hover:border-primary/40"
                )}
                onClick={() => setSelectedImportMethod("text")}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Paste Pricing Text</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Copy and paste your existing pricing information as text.
                    </p>
                    <Textarea
                      placeholder="Basic Plan: $29/month - Up to 5 users, 10 projects, Email support..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={selectedImportMethod !== "text" && selectedImportMethod !== null}
                      className={cn(
                        "min-h-[120px]",
                        selectedImportMethod === "text" ? "border-primary" : ""
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setView("choice")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={processImport} disabled={!selectedImportMethod || isProcessing}>
                {isProcessing ? "Processing..." : "Import Pricing"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold">Processing Your Pricing Data</h3>
              <p className="text-gray-500 mt-2">
                We're extracting and standardizing your pricing information...
              </p>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="text-sm text-gray-600">
                This may take a moment while we analyze your pricing structure.
              </div>
            </div>
          </div>
        );

      case "verification":
        return (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Verify Imported Pricing</h3>
            <p className="text-gray-500 mb-6">
              Please review the extracted pricing plans and make any necessary adjustments.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {extractedPlans.map((plan, planIndex) => (
                <Card key={planIndex} className="p-4">
                  <h4 className="font-semibold text-lg mb-2">{plan.name}</h4>
                  <div className="mb-4">
                    {plan.planType === "custom" ? (
                      <span className="text-xl font-bold text-gray-700">Custom</span>
                    ) : (
                      <span>
                        <span className="text-xl font-bold">${plan.price}</span>
                        <span className="text-sm text-gray-500">/mo</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">
                          {feature.type === "limit" 
                            ? `${feature.name}: ${feature.limit}` 
                            : feature.name
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setImportStep("input")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPlans(extractedPlans);
                    setView("manual");
                  }}
                >
                  Customize Plans
                </Button>
                <Button onClick={handleImportComplete}>
                  Use These Plans
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render choice view
  const renderChoiceView = () => {
    return (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">How would you like to set up your pricing?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 cursor-pointer hover:border-primary transition-all" onClick={() => setView("import")}>
            <div className="flex items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Import Existing Pricing</h3>
                <p className="text-sm text-gray-500">
                  Already have pricing? Import from your website, PDF, or paste your existing structure.
                </p>
              </div>
            </div>
            <Button className="w-full" variant="secondary">Import Pricing</Button>
          </Card>

          <Card className="p-6 cursor-pointer hover:border-primary transition-all" onClick={() => setView("recommend")}>
            <div className="flex items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Get AI Recommendations</h3>
                <p className="text-sm text-gray-500">
                  We'll analyze your product and suggest pricing models that work well for similar businesses.
                </p>
              </div>
            </div>
            <Button className="w-full">Get Recommendations</Button>
          </Card>
          
          <Card className="p-6 cursor-pointer hover:border-primary transition-all" onClick={() => setView("manual")}>
            <div className="flex items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Create Custom Pricing</h3>
                <p className="text-sm text-gray-500">
                  Set up your pricing structure manually with complete control over plans and features.
                </p>
              </div>
            </div>
            <Button className="w-full" variant="outline">Create Custom Plans</Button>
          </Card>
        </div>
        
        <div className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  };

  // Render manual pricing setup
  const renderManualSetup = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create Your Pricing Plans</h2>
          <Button onClick={addNewPlan} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Plan
          </Button>
        </div>
        
        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, planIndex) => (
            <Card key={planIndex} className="p-4 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2" 
                onClick={() => removePlan(planIndex)}
              >
                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
              </Button>
              
              {/* Plan name */}
              <div className="mb-4">
                <Label htmlFor={`plan-name-${planIndex}`}>Plan Name</Label>
                <Input 
                  id={`plan-name-${planIndex}`}
                  value={plan.name} 
                  onChange={(e) => updatePlan(planIndex, 'name', e.target.value)} 
                  className="mt-1"
                />
              </div>
              
              {/* Plan type */}
              <div className="mb-4">
                <Label htmlFor={`plan-type-${planIndex}`}>Plan Type</Label>
                <Select 
                  value={plan.planType}
                  onValueChange={(value) => updatePlanType(planIndex, value as "free" | "paid" | "custom")}
                >
                  <SelectTrigger id={`plan-type-${planIndex}`} className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="custom">Custom/Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Plan price - only shown for paid plans */}
              {plan.planType === "paid" && (
                <div className="mb-4">
                  <Label htmlFor={`plan-price-${planIndex}`}>Price (USD)</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      id={`plan-price-${planIndex}`}
                      value={plan.price} 
                      onChange={(e) => updatePlan(planIndex, 'price', e.target.value)} 
                      className="pl-8"
                      type="text"
                      inputMode="decimal"
                    />
                  </div>
                </div>
              )}
              
              {/* Features */}
              <div>
                <Label className="mb-2 block">Features</Label>
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm">{feature.name}</span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                              <Button size="sm" onClick={() => removeFeature(planIndex, featureIndex)}>Confirm</Button>
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <Select 
                            value={feature.type} 
                            onValueChange={(value) => updateFeature(planIndex, featureIndex, 'type', value)}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="boolean">Included</SelectItem>
                              <SelectItem value="limit">Limited</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {feature.type === 'limit' && (
                            <Input 
                              value={feature.limit || ""}
                              onChange={(e) => updateFeature(planIndex, featureIndex, 'limit', e.target.value)}
                              className="h-7 text-xs"
                              placeholder="Limit"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Add feature section */}
        <Card className="p-4 mb-8">
          <h3 className="font-semibold mb-4">Add Feature to All Plans</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="New feature name" 
              value={newFeature} 
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addFeatureToAllPlans} disabled={!newFeature.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setView("choice")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleManualSave}>Save and Continue</Button>
        </div>
      </div>
    );
  };

  // Render content based on current view
  const renderContent = () => {
    switch (view) {
      case "choice":
        return renderChoiceView();
      case "import":
        return renderImportFlow();
      case "recommend":
        return renderAIRecommendationFlow();
      case "manual":
        return renderManualSetup();
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default PricingWizardStep;
