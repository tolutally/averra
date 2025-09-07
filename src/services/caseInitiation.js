// Case initiation service - handles participant invitations and case setup
export const generateParticipantLinks = (caseId, participants) => {
  return participants.map(participant => ({
    participantId: participant.id,
    email: participant.email,
    name: participant.name,
    role: participant.role,
    invitationLink: `${window.location.origin}/steps/${participant.tokenId}?case=${caseId}`,
    tokenId: participant.tokenId,
    caseId
  }));
};

export const sendInvitationEmails = async (participantLinks, caseDetails) => {
  // Simulate email sending with realistic delays
  console.log('📧 Sending invitation emails...');
  
  const emailPromises = participantLinks.map(async (link, index) => {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500 + (index * 100)));
    
    const emailData = {
      to: link.email,
      subject: `Action Required: Complete Your ${caseDetails.templateName} Requirements`,
      body: `
        Hello ${link.name},
        
        You have been invited to complete requirements for: ${caseDetails.name}
        
        Client: ${caseDetails.clientName}
        Deadline: ${new Date(caseDetails.deadline).toLocaleDateString()}
        
        Please click the link below to get started:
        ${link.invitationLink}
        
        If you have any questions, please contact your coordinator.
        
        Best regards,
        Vouchline Team
      `,
      caseId: link.caseId,
      participantId: link.participantId,
      sentAt: new Date().toISOString()
    };
    
    // In a real application, this would call an email service API
    console.log(`✅ Email sent to ${link.email}:`, emailData);
    
    return {
      ...link,
      emailSent: true,
      sentAt: emailData.sentAt
    };
  });
  
  const results = await Promise.all(emailPromises);
  console.log(`📬 Successfully sent ${results.length} invitations`);
  
  return results;
};

export const sendReminderEmails = async (caseId, participantIds = []) => {
  const caseData = JSON.parse(localStorage.getItem('vouchline_cases') || '[]')
    .find(case_ => case_.id === caseId);
  
  if (!caseData) {
    throw new Error('Case not found');
  }
  
  const participantsToRemind = participantIds.length > 0 
    ? caseData.participants.filter(p => participantIds.includes(p.id))
    : caseData.participants.filter(p => p.status !== 'completed');
  
  console.log(`📨 Sending reminders to ${participantsToRemind.length} participants for case ${caseId}`);
  
  const reminderPromises = participantsToRemind.map(async (participant, index) => {
    await new Promise(resolve => setTimeout(resolve, 200 + (index * 50)));
    
    const reminderData = {
      to: participant.email,
      subject: `Reminder: Complete Your ${caseData.templateName} Requirements`,
      body: `
        Hello ${participant.name},
        
        This is a friendly reminder to complete your requirements for: ${caseData.name}
        
        Deadline: ${new Date(caseData.deadline).toLocaleDateString()}
        
        Please use your original invitation link to continue:
        ${window.location.origin}/steps/${participant.tokenId}?case=${caseId}
        
        Best regards,
        Vouchline Team
      `,
      sentAt: new Date().toISOString()
    };
    
    console.log(`🔔 Reminder sent to ${participant.email}`);
    return reminderData;
  });
  
  return await Promise.all(reminderPromises);
};

export const generateCaseInvitationSummary = (caseData, participantLinks) => {
  return {
    caseId: caseData.id,
    caseName: caseData.name,
    clientName: caseData.clientName,
    templateName: caseData.templateName,
    totalParticipants: participantLinks.length,
    invitationsSent: participantLinks.filter(link => link.emailSent).length,
    deadline: caseData.deadline,
    estimatedCompletion: caseData.metrics.estimatedDuration,
    createdAt: caseData.createdAt,
    coordinatorId: caseData.coordinatorId,
    participantSummary: participantLinks.map(link => ({
      name: link.name,
      email: link.email,
      role: link.role,
      invitationLink: link.invitationLink,
      emailSent: link.emailSent
    }))
  };
};

export const validateCaseParticipants = (participants) => {
  const errors = [];
  const emails = participants.map(p => p.email.toLowerCase().trim()).filter(email => email);
  
  // Check for duplicate emails
  const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
  if (duplicateEmails.length > 0) {
    errors.push('Duplicate email addresses found');
  }
  
  // Check for empty participants
  if (participants.length === 0) {
    errors.push('At least one participant is required');
  }
  
  // Validate each participant
  participants.forEach((participant, index) => {
    if (!participant.email.trim()) {
      errors.push(`Participant ${index + 1}: Email is required`);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email)) {
      errors.push(`Participant ${index + 1}: Invalid email format`);
    }
    
    if (!participant.name.trim()) {
      errors.push(`Participant ${index + 1}: Name is required`);
    }
  });
  
  return errors;
};
