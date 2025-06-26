export const MountainAvatar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="currentColor" className="text-slate-200 dark:text-slate-700" />
    <path d="M30 80L50 40L60 60L70 80H30Z" fill="currentColor" className="text-slate-500 dark:text-slate-400" />
    <path d="M45 80L60 50L75 80H45Z" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
    <path d="M55 47L60 40L65 47L60 55L55 47Z" fill="currentColor" className="text-white dark:text-slate-200" />
  </svg>
);