import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type ComingSoonPageProps = {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  onBack: () => void;
  onContinue: () => void;
  showContinueButton?: boolean;
};

const ComingSoonPage = ({
  title,
  description,
  features,
  icon,
  onBack,
  onContinue,
  showContinueButton = true
}: ComingSoonPageProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animate in content
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className={cn(
        "text-center mb-12 transition-all duration-700",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Coming Soon</span>
        </div>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white shadow-lg">
            {icon}
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Features Grid */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 transition-all duration-700 delay-200",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        {features.map((feature, index) => (
          <Card
            key={index}
            className={cn(
              "p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300",
              "bg-gradient-to-br from-white to-gray-50/50"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {feature}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className={cn(
        "text-center mb-12 transition-all duration-700 delay-400",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-primary">
              Excited for this feature?
            </h3>
          </div>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {showContinueButton
              ? "This powerful tool is in development. Continue with pricing setup or check back soon!"
              : "This powerful tool is in development. Check back soon for updates!"
            }
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="px-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Choose Different Option
            </Button>
            {showContinueButton && (
              <Button
                onClick={onContinue}
                className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Continue to Pricing Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
