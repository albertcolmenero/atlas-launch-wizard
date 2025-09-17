import { BarChart3 } from "lucide-react";
import ComingSoonPage from "./ComingSoonPage";

type CompetitorTrackingPageProps = {
  onBack: () => void;
  onContinue: () => void;
};

const CompetitorTrackingPage = ({ onBack, onContinue }: CompetitorTrackingPageProps) => {
  return (
    <ComingSoonPage
      title="Competitor Tracking Dashboard"
      description="Monitor and analyze your competitors with our comprehensive tracking dashboard. Get insights into pricing strategies, feature sets, and market positioning to stay ahead of the competition."
      features={[
        "Real-time competitor pricing monitoring and alerts",
        "Feature comparison matrix with visual dashboards",
        "Market positioning analysis and gap identification",
        "Automated competitor intelligence reports",
        "Integration with major competitor data sources",
        "Custom alerts for pricing and feature changes"
      ]}
      icon={<BarChart3 className="h-8 w-8" />}
      onBack={onBack}
      onContinue={onContinue}
      showContinueButton={false}
    />
  );
};

export default CompetitorTrackingPage;
