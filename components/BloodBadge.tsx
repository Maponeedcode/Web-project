interface BloodBadgeProps {
  bloodType: string; // Ex 'A+', 'B-', 'O+', 'AB+'
  className?: string;
}

export default function BloodBadge({ bloodType, className = '' }: BloodBadgeProps) {
  return (
    <div
      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0e3b6c] text-white flex items-center justify-center shrink-0 shadow-md ${className}`}
    >
      <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight">
        {bloodType}
      </span>
    </div>
  );
}