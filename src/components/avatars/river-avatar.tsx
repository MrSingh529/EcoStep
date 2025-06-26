export const RiverAvatar = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="currentColor" className="text-sky-200 dark:text-sky-900" />
        <path d="M25 20C40 40 30 60 50 80" stroke="currentColor" className="text-sky-500 dark:text-sky-400" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 20C65 40 55 60 75 80" stroke="currentColor" className="text-sky-400 dark:text-sky-500" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);