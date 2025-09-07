import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AppLayout from '../../components/layout/AppLayout';

const HelpSupportCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all');
  const [selectedUserType, setSelectedUserType] = useState('coordinator');
  const [expandedSections, setExpandedSections] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [supportTicketForm, setSupportTicketForm] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });
  const [showTicketForm, setShowTicketForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All Topics', icon: 'Grid3X3' },
    { id: 'getting-started', name: 'Getting Started', icon: 'Play' },
    { id: 'workflow', name: 'Workflow Management', icon: 'GitBranch' },
    { id: 'cases', name: 'Case Management', icon: 'FileText' },
    { id: 'analytics', name: 'Analytics & Reports', icon: 'BarChart3' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: 'AlertTriangle' },
    { id: 'api', name: 'API & Integration', icon: 'Code' },
    { id: 'security', name: 'Security & Compliance', icon: 'Shield' }
  ];

  const coordinatorTopics = [
    {
      id: 'workflow-creation',
      title: 'Creating Custom Workflows',
      category: 'workflow',
      description: 'Learn how to build and customize onboarding workflows',
      content: 'Step-by-step guide to creating effective workflows...',
      videoUrl: '/videos/workflow-creation.mp4',
      tags: ['workflow', 'templates', 'customization']
    },
    {
      id: 'case-management',
      title: 'Managing Cases and Participants',
      category: 'cases',
      description: 'Best practices for case monitoring and participant communication',
      content: 'Comprehensive guide to case management features...',
      videoUrl: '/videos/case-management.mp4',
      tags: ['cases', 'participants', 'communication']
    },
    {
      id: 'analytics-interpretation',
      title: 'Understanding Analytics Dashboard',
      category: 'analytics',
      description: 'How to interpret completion rates and performance metrics',
      content: 'Detailed explanation of analytics features...',
      videoUrl: '/videos/analytics-guide.mp4',
      tags: ['analytics', 'metrics', 'reporting']
    },
    {
      id: 'strict-mode',
      title: 'Strict Mode Configuration',
      category: 'security',
      description: 'Configure enhanced security and compliance settings',
      content: 'Learn about strict mode features and configuration...',
      tags: ['security', 'compliance', 'configuration']
    }
  ];

  const participantTopics = [
    {
      id: 'completing-steps',
      title: 'How to Complete Onboarding Steps',
      category: 'getting-started',
      description: 'Step-by-step guide for external participants',
      content: 'Complete walkthrough of the onboarding process...',
      videoUrl: '/videos/participant-guide.mp4',
      tags: ['onboarding', 'steps', 'completion']
    },
    {
      id: 'file-uploads',
      title: 'File Upload Requirements',
      category: 'getting-started',
      description: 'Supported formats and upload instructions',
      content: 'Detailed file upload specifications and examples...',
      tags: ['uploads', 'files', 'requirements']
    },
    {
      id: 'technical-requirements',
      title: 'System Requirements',
      category: 'troubleshooting',
      description: 'Browser compatibility and technical specifications',
      content: 'Minimum system requirements and compatibility info...',
      tags: ['technical', 'browsers', 'compatibility']
    }
  ];

  const faqs = [
    {
      question: 'How do I reset my workflow template?',
      answer: 'Navigate to Workflow Templates, select the template, and click "Reset to Default" in the settings menu.',
      category: 'workflow'
    },
    {
      question: 'Can participants save their progress?',
      answer: 'Yes, participant progress is automatically saved after each completed step and can be resumed anytime.',
      category: 'getting-started'
    },
    {
      question: 'What file formats are supported for uploads?',
      answer: 'We support PDF, DOCX, JPG, PNG, and ZIP files up to 10MB in size.',
      category: 'getting-started'
    },
    {
      question: 'How do I export audit reports?',
      answer: 'Go to Analytics > Reports, select your date range, and click "Export" to download as PDF or Excel.',
      category: 'analytics'
    }
  ];

  const filteredContent = () => {
    const topics = selectedUserType === 'coordinator' ? coordinatorTopics : participantTopics;
    let filtered = topics;

    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(topic => topic?.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(topic => 
        topic?.title?.toLowerCase()?.includes(query) ||
        topic?.description?.toLowerCase()?.includes(query) ||
        topic?.tags?.some(tag => tag?.toLowerCase()?.includes(query))
      );
    }

    return filtered;
  };

  const filteredFaqs = () => {
    let filtered = faqs;

    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(faq => faq?.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(faq => 
        faq?.question?.toLowerCase()?.includes(query) ||
        faq?.answer?.toLowerCase()?.includes(query)
      );
    }

    return filtered;
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev?.[sectionId]
    }));
  };

  const handleTopicView = (topicId) => {
    const viewed = [...recentlyViewed?.filter(id => id !== topicId), topicId]?.slice(-5);
    setRecentlyViewed(viewed);
    localStorage.setItem('help-recently-viewed', JSON.stringify(viewed));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const params = new URLSearchParams();
    if (query) params?.set('q', query);
    if (selectedCategory !== 'all') params?.set('category', selectedCategory);
    setSearchParams(params);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (searchQuery) params?.set('q', searchQuery);
    if (categoryId !== 'all') params?.set('category', categoryId);
    setSearchParams(params);
  };

  const handleTicketSubmit = (e) => {
    e?.preventDefault();
    // Handle ticket submission
    console.log('Support ticket submitted:', supportTicketForm);
    setShowTicketForm(false);
    setSupportTicketForm({
      subject: '',
      description: '',
      priority: 'medium',
      category: 'general'
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem('help-recently-viewed');
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  return (
    <AppLayout>
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Help & Support Center
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Comprehensive guidance for coordinators and participants. Find documentation, 
                tutorials, and support resources to maximize your onboarding workflow efficiency.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                  <Input
                    type="text"
                    placeholder="Search documentation, FAQs, and guides..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e?.target?.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* User Type Selector */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">I am a:</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="coordinator"
                        checked={selectedUserType === 'coordinator'}
                        onChange={(e) => setSelectedUserType(e?.target?.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-foreground">Coordinator</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="participant"
                        checked={selectedUserType === 'participant'}
                        onChange={(e) => setSelectedUserType(e?.target?.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-foreground">Participant</span>
                    </label>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories?.map((category) => (
                      <button
                        key={category?.id}
                        onClick={() => handleCategoryChange(category?.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-smooth ${
                          selectedCategory === category?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon name={category?.icon} size={16} />
                        <span>{category?.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      iconName="MessageCircle"
                      onClick={() => setShowTicketForm(!showTicketForm)}
                      className="w-full justify-start"
                    >
                      Submit Support Ticket
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Video"
                      className="w-full justify-start"
                    >
                      Video Tutorials
                    </Button>
                    <Button
                      variant="outline"
                      iconName="Download"
                      className="w-full justify-start"
                    >
                      Download Resources
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Need More Help?</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Mon-Fri, 9AM-6PM EST</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">support@onboardflow.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-success text-xs">Live Chat Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {/* Recently Viewed */}
                {recentlyViewed?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Recently Viewed</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recentlyViewed?.slice(0, 4)?.map((topicId) => {
                        const topic = [...coordinatorTopics, ...participantTopics]?.find(t => t?.id === topicId);
                        if (!topic) return null;
                        return (
                          <div
                            key={topic?.id}
                            className="bg-card border border-border rounded-lg p-4 hover:shadow-subtle transition-smooth cursor-pointer"
                            onClick={() => handleTopicView(topic?.id)}
                          >
                            <h3 className="font-medium text-foreground mb-2">{topic?.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{topic?.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {topic?.tags?.slice(0, 2)?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Documentation Topics */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {selectedUserType === 'coordinator' ? 'Coordinator Documentation' : 'Participant Guides'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredContent()?.map((topic) => (
                      <div
                        key={topic?.id}
                        className="bg-card border border-border rounded-lg p-6 hover:shadow-subtle transition-smooth cursor-pointer"
                        onClick={() => handleTopicView(topic?.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-medium text-foreground">{topic?.title}</h3>
                          {topic?.videoUrl && (
                            <Icon name="Video" size={16} className="text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{topic?.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {topic?.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-secondary/20 text-secondary-foreground text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {filteredFaqs()?.map((faq, index) => (
                      <div key={index} className="bg-card border border-border rounded-lg">
                        <button
                          onClick={() => toggleSection(`faq-${index}`)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-smooth"
                        >
                          <span className="font-medium text-foreground">{faq?.question}</span>
                          <Icon
                            name={expandedSections?.[`faq-${index}`] ? "ChevronUp" : "ChevronDown"}
                            size={16}
                            className="text-muted-foreground"
                          />
                        </button>
                        {expandedSections?.[`faq-${index}`] && (
                          <div className="px-4 pb-4">
                            <p className="text-muted-foreground">{faq?.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Ticket Form */}
                {showTicketForm && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Submit Support Ticket</h2>
                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Subject"
                          required
                          value={supportTicketForm?.subject}
                          onChange={(e) => setSupportTicketForm(prev => ({ ...prev, subject: e?.target?.value }))}
                          placeholder="Brief description of your issue"
                        />
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                          <select
                            value={supportTicketForm?.priority}
                            onChange={(e) => setSupportTicketForm(prev => ({ ...prev, priority: e?.target?.value }))}
                            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                        <textarea
                          required
                          value={supportTicketForm?.description}
                          onChange={(e) => setSupportTicketForm(prev => ({ ...prev, description: e?.target?.value }))}
                          placeholder="Detailed description of your issue or question"
                          rows={4}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-vertical"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button type="submit" iconName="Send">
                          Submit Ticket
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowTicketForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default HelpSupportCenter;