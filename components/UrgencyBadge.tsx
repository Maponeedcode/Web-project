interface UrgencyBadgeProps {
  urgency: 'CRITICAL' | 'URGENT' | 'NORMAL' | string;
  className?: string;
}

export default function UrgencyBadge({ urgency, className = '' }: UrgencyBadgeProps) {
  const getBadgeStyle = () => {
    switch (urgency?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-600 text-white animate-pulse';
      case 'URGENT':
        return 'bg-amber-500 text-white';
      case 'NORMAL':
      default:
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    }
  };

  const getLabel = () => {
    switch (urgency?.toUpperCase()) {
      case 'CRITICAL':
        return 'ด่วนวิกฤต';
      case 'URGENT':
        return 'ด่วน';
      case 'NORMAL':
      default:
        return 'ปกติ';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getBadgeStyle()} ${className}`}
    >
      {getLabel()}
    </span>
  );
}