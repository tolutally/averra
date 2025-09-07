import React from 'react';
import Icon from '../../../components/AppIcon';

const CaseMetricsCards = ({ metrics = {} }) => {
  const defaultMetrics = {
    totalCases: 156,
    activeCases: 89,
    completedToday: 12,
    overdueCases: 8,
    avgCompletionTime: "4.2 days",
    completionRate: 78
  };

  const data = { ...defaultMetrics, ...metrics };

  const cards = [
    {
      title: "Total Cases",
      value: data?.totalCases,
      icon: "FileText",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Active Cases",
      value: data?.activeCases,
      icon: "Clock",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: "Completed Today",
      value: data?.completedToday,
      icon: "CheckCircle",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Overdue",
      value: data?.overdueCases,
      icon: "AlertTriangle",
      color: "text-error",
      bgColor: "bg-error/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards?.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-subtle transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{card?.title}</p>
              <p className="text-2xl font-semibold text-foreground">{card?.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={20} className={card?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CaseMetricsCards;