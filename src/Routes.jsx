import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import TokenGuard from "components/guards/TokenGuard";
import Toast from "components/ui/Toast";
import NotFound from "pages/NotFound";
import CoordinatorDashboard from './pages/coordinator-dashboard';
import TokenizedOnboardingStep from './pages/tokenized-onboarding-step';
import CaseCounterpartyView from './pages/case-counterparty-view';
import CaseDetailAuditTrail from './pages/case-detail-audit-trail';
import CaseDetail from './pages/case-detail';
import CasesCockpit from './pages/cases-cockpit';
import CaseVault from './pages/case-vault';
import WorkflowTemplateConfiguration from './pages/workflow-template-configuration';
import WorkflowBuilder from './pages/workflow-builder';
import HelpSupportCenter from './pages/help-support-center';
import SystemSettings from './pages/system-settings';
import CaseCreation from './pages/case-creation';
import PlaybookBlockDemo from './pages/PlaybookBlockDemo';

const Routes = () => {
  const toast = useSelector(state => state.ui.toast);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Main application - go directly to coordinator dashboard */}
          <Route path="/" element={<CoordinatorDashboard />} />
          
          {/* Protected internal routes */}
          <Route path="/coordinator-dashboard" element={<CoordinatorDashboard />} />
          <Route path="/case-creation" element={<CaseCreation />} />
          <Route path="/case-vault" element={<CaseVault />} />
          <Route path="/cases" element={<CasesCockpit />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/counterparty-view/:caseId" element={<CaseCounterpartyView />} />
          <Route path="/case-detail-audit-trail/:id" element={<CaseDetailAuditTrail />} />
          <Route path="/workflow-template-configuration" element={<WorkflowTemplateConfiguration />} />
          <Route path="/workflow-builder" element={<WorkflowBuilder />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/help" element={<HelpSupportCenter />} />
          <Route path="/playbook-block-demo" element={<PlaybookBlockDemo />} />
          
          {/* External tokenized routes with guards */}
          <Route 
            path="/steps/:token" 
            element={
              <TokenGuard>
                <TokenizedOnboardingStep />
              </TokenGuard>
            } 
          />
          <Route 
            path="/onboarding/:caseId" 
            element={
              <TokenGuard>
                <TokenizedOnboardingStep />
              </TokenGuard>
            } 
          />
          <Route 
            path="/steps/:token/otp" 
            element={
              <TokenGuard requireOTP={true}>
                <TokenizedOnboardingStep />
              </TokenGuard>
            } 
          />
          <Route 
            path="/r/:slug/:token" 
            element={
              <TokenGuard>
                <TokenizedOnboardingStep />
              </TokenGuard>
            } 
          />
          
          {/* Legacy routes - redirect to new structure */}
          <Route path="/tokenized-onboarding-step" element={<TokenizedOnboardingStep />} />
          <Route path="/case-detail-audit-trail" element={<CaseDetailAuditTrail />} />
          <Route path="/help-support-center" element={<HelpSupportCenter />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        
        {/* Global Toast */}
        {toast && <Toast {...toast} />}
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;