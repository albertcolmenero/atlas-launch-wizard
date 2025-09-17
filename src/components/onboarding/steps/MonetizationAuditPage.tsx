import { FileSearch } from "lucide-react";
import ComingSoonPage from "./ComingSoonPage";

type MonetizationAuditPageProps = {
  onBack: () => void;
  onContinue: () => void;
};

const MonetizationAuditPage = ({ onBack, onContinue }: MonetizationAuditPageProps) => {
  return (
    <ComingSoonPage
      title="Basic AI Monetization Audit"
      description="Upload your product documentation for comprehensive AI-powered monetization analysis. RAG-based insights help identify usage patterns, sentiment trends, and revenue optimization opportunities."
      features={[
        "Document upload and automatic processing",
        "RAG-based analysis of product documentation",
        "Usage pattern identification and insights",
        "Sentiment analysis across customer feedback",
        "Monetization opportunity recommendations",
        "Competitive analysis and market positioning"
      ]}
      icon={<FileSearch className="h-8 w-8" />}
      onBack={onBack}
      onContinue={onContinue}
      showContinueButton={false}
    />
  );
};

export default MonetizationAuditPage;
