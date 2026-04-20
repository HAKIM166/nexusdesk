import DashboardShell from "@/components/layout/dashboard-shell";
import AIMessageBox from "@/components/ai/ai-message-box";

export default function AIPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="section-title">AI Assistant</h1>
          <p className="section-subtitle">
            Generate smart suggestions for your business
          </p>
        </div>

        <AIMessageBox />
      </div>
    </DashboardShell>
  );
}