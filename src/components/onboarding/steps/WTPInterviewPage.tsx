import { MessageSquare } from "lucide-react";
import ComingSoonPage from "./ComingSoonPage";

type WTPInterviewPageProps = {
  onBack: () => void;
  onContinue: () => void;
};

const WTPInterviewPage = ({ onBack, onContinue }: WTPInterviewPageProps) => {
  return (
    <ComingSoonPage
      title="WTP Interview Script Generator"
      description="Generate professional, AI-powered interview scripts to uncover customer willingness-to-pay. Using advanced agentic prompts to create natural, effective conversations that reveal true price sensitivity."
      features={[
        "AI-generated interview scripts tailored to your product",
        "Advanced agentic prompts for natural conversation flow",
        "Price sensitivity discovery and objection handling",
        "Customizable script templates for different customer segments",
        "Real-time script optimization based on responses",
        "Integration with survey tools and CRM systems"
      ]}
      icon={<MessageSquare className="h-8 w-8" />}
      onBack={onBack}
      onContinue={onContinue}
      showContinueButton={false}
    />
  );
};

export default WTPInterviewPage;
