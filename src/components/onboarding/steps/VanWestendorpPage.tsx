import { Calculator } from "lucide-react";
import ComingSoonPage from "./ComingSoonPage";

type VanWestendorpPageProps = {
  onBack: () => void;
  onContinue: () => void;
};

const VanWestendorpPage = ({ onBack, onContinue }: VanWestendorpPageProps) => {
  return (
    <ComingSoonPage
      title="Van Westendorp Price Sensitivity Tool"
      description="Apply the renowned Van Westendorp Price Sensitivity Meter to determine optimal pricing ranges. Simple form-based calculator with comprehensive AI analysis for data-driven pricing decisions."
      features={[
        "Complete Van Westendorp PSM implementation",
        "Interactive price sensitivity questionnaires",
        "Automated optimal price range calculation",
        "AI-powered analysis and recommendations",
        "Visual price acceptance curves and graphs",
        "Exportable reports for stakeholder presentations"
      ]}
      icon={<Calculator className="h-8 w-8" />}
      onBack={onBack}
      onContinue={onContinue}
      showContinueButton={false}
    />
  );
};

export default VanWestendorpPage;
