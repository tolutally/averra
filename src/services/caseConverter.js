// Case converter service - converts templates to actual case instances
export const generateCaseId = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CASE-${year}${month}${day}-${random}`;
};

export const convertTemplateToCase = (template, caseData, participants = []) => {
  const caseId = generateCaseId();
  
  return {
    id: caseId,
    name: caseData.caseName,
    clientName: caseData.clientName,
    description: caseData.caseDescription,
    status: 'not-started',
    priority: caseData.priority,
    deadline: caseData.deadline,
    coordinatorId: caseData.coordinatorId,
    templateId: template.id,
    templateName: template.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participants: participants.map(p => ({
      ...p,
      status: 'invited',
      invitedAt: new Date().toISOString(),
      tokenId: Math.random().toString(36).substr(2, 16)
    })),
    steps: template.steps.map((step, index) => ({
      id: `req-${index + 1}`,
      stepId: step.id,
      title: step.title,
      description: step.description,
      status: 'pending',
      uploads: [],
      messages: 0,
      acceptanceCriteria: step.acceptanceCriteria || []
    })),
    metrics: {
      totalSteps: template.steps.length,
      completedSteps: 0,
      progress: 0,
      estimatedDuration: template.estimatedDuration
    },
    auditTrail: [
      {
        id: 'audit-1',
        action: 'Case Created',
        description: `Case "${caseData.caseName}" created from template "${template.name}"`,
        user: 'System',
        timestamp: new Date().toISOString(),
        type: 'creation'
      }
    ]
  };
};

export const updateCaseProgress = (caseId, completedSteps) => {
  const existingCases = JSON.parse(localStorage.getItem('averra_cases') || '[]');
  const updatedCases = existingCases.map(case_ => {
    if (case_.id === caseId) {
      const progress = Math.round((completedSteps / case_.metrics.totalSteps) * 100);
      return {
        ...case_,
        metrics: {
          ...case_.metrics,
          completedSteps,
          progress
        },
        status: progress === 100 ? 'completed' : 
               progress > 0 ? 'in-progress' : 'not-started',
        updatedAt: new Date().toISOString()
      };
    }
    return case_;
  });
  
  localStorage.setItem('averra_cases', JSON.stringify(updatedCases));
  return updatedCases.find(case_ => case_.id === caseId);
};

export const addAuditTrailEntry = (caseId, action, description, user = 'System') => {
  const existingCases = JSON.parse(localStorage.getItem('averra_cases') || '[]');
  const updatedCases = existingCases.map(case_ => {
    if (case_.id === caseId) {
      const newEntry = {
        id: `audit-${case_.auditTrail.length + 1}`,
        action,
        description,
        user,
        timestamp: new Date().toISOString(),
        type: 'activity'
      };
      
      return {
        ...case_,
        auditTrail: [...case_.auditTrail, newEntry],
        updatedAt: new Date().toISOString()
      };
    }
    return case_;
  });
  
  localStorage.setItem('averra_cases', JSON.stringify(updatedCases));
};

export const getCaseById = (caseId) => {
  const existingCases = JSON.parse(localStorage.getItem('averra_cases') || '[]');
  return existingCases.find(case_ => case_.id === caseId);
};

export const getAllCases = () => {
  return JSON.parse(localStorage.getItem('averra_cases') || '[]');
};
