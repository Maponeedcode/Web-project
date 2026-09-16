interface BloodBadgeProps {
  bloodType: string; // Ex 'A+', 'B-', 'O+', 'AB+'
  className?: string;
}

export default function BloodBadge({ bloodType, className = '' }: BloodBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 ${className}`}
    >
      {bloodType}
    </span>
  );
}