import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  MessageSquare,
  Calculator,
  FileSearch,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  FileText,
  Link
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGoalsStepProps = {
  onNext: (selectedGoal?: string) => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
};

const ProductGoalsStep = ({ onNext, onBack, updateUserData, userData }: ProductGoalsStepProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    // New options (as requested)
    {
      id: "competitor-tracking",
      title: "Competitor Tracking Dashboard",
      description: "Basic comparison UI for monitoring competitors. MVP leveraging roadmap item #6.",
      icon: <BarChart3 className="h-6 w-6" />,
      category: "Analysis",
    },
    {
      id: "wtp-interview",
      title: "WTP Interview Script Generator",
      description: "AI-powered generator using agentic prompts for quick willingness-to-pay outputs.",
      icon: <MessageSquare className="h-6 w-6" />,
      category: "Research",
    },
    {
      id: "price-sensitivity",
      title: "Van Westendorp Price Sensitivity Tool",
      description: "Simple form-based calculator with AI analysis for price sensitivity metering.",
      icon: <Calculator className="h-6 w-6" />,
      category: "Pricing",
    },
    {
      id: "monetization-audit",
      title: "Basic AI Monetization Audit",
      description: "Upload product docs for RAG-based insights on usage and sentiment analysis.",
      icon: <FileSearch className="h-6 w-6" />,
      category: "Analysis",
    },
    // Original options (kept as requested)
    {
      id: "import-pricing",
      title: "Import Existing Pricing",
      description: "Already have pricing? Import from your website, PDF, or paste your existing structure.",
      icon: <Download className="h-6 w-6" />,
      category: "Setup",
    },
    {
      id: "ai-recommendations",
      title: "Get AI Recommendations",
      description: "We'll analyze your product and suggest pricing models that work well for similar businesses.",
      icon: <Sparkles className="h-6 w-6" />,
      category: "AI",
    },
  ];

  const selectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    const selectedGoalData = goals.find(goal => goal.id === goalId);
    // Create a serializable version without the React icon element
    const serializableGoalData = selectedGoalData ? {
      id: selectedGoalData.id,
      title: selectedGoalData.title,
      description: selectedGoalData.description,
      category: selectedGoalData.category,
    } : null;

    updateUserData({
      selectedGoals: [goalId],
      goalDetails: serializableGoalData ? [serializableGoalData] : [],
      selectedGoal: goalId,
    });
    // Small delay for visual feedback before moving forward
    setTimeout(() => {
      onNext(goalId);
    }, 300);
  };

  const selectedGoalData = goals.find(goal => goal.id === selectedGoal);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Analysis":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Research":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pricing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Setup":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "AI":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Custom":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Let's get started</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          What are you looking for today?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose what you'd like to focus on first. You can always access other tools later.
        </p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={cn(
              "relative p-6 cursor-pointer transition-all duration-300 hover:shadow-md group",
              "border border-gray-200 hover:border-gray-300",
              selectedGoal === goal.id
                ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg ring-2 ring-primary/20"
                : "hover:shadow-md"
            )}
            onClick={() => selectGoal(goal.id)}
          >
            {/* Light highlight border at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 rounded-t-lg" />


            {/* Icon */}
            <div className={cn(
              "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all",
              selectedGoal === goal.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              {goal.icon}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className={cn(
                  "font-semibold text-lg transition-colors",
                  selectedGoal === goal.id ? "text-primary" : "text-gray-900 group-hover:text-primary"
                )}>
                  {goal.title}
                </h3>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {goal.description}
              </p>

              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium transition-all",
                  getCategoryColor(goal.category),
                  selectedGoal === goal.id && "border-primary/50"
                )}
              >
                {goal.category}
              </Badge>
            </div>

            {/* Hover Effect */}
            <div className={cn(
              "absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none",
              selectedGoal === goal.id
                ? "bg-gradient-to-br from-primary/10 to-transparent"
                : "group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:to-transparent opacity-0 group-hover:opacity-100"
            )} />
          </Card>
        ))}
      </div>

      {/* Custom Pricing Link */}
      <div className="text-center mb-8">
        <Button
          variant="ghost"
          onClick={() => selectGoal("custom-pricing")}
          className="text-gray-500 hover:text-primary transition-colors group"
        >
          <Link className="h-4 w-4 mr-2 group-hover:text-primary" />
          Or create custom pricing plans manually
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default ProductGoalsStep;
