interface UrgencyBadgeProps {
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL' | string;
  className?: string;
}

export default function UrgencyBadge({ urgency, className = '' }: UrgencyBadgeProps) {
  const getBadgeStyle = () => {
    switch (urgency?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-[#dc2626] border-red-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'NORMAL':
      default:
        return 'bg-slate-200 text-slate-700 border-slate-300';
    }
  };

  const getDotColor = () => {
    switch (urgency?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-[#dc2626]';
      case 'HIGH':
        return 'bg-amber-600';
      case 'NORMAL':
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${getBadgeStyle()} ${className}`}
    >
      <span className={`size-2 rounded-full ${getDotColor()}`}></span>
      {urgency?.toUpperCase()}
    </span>
  );
}