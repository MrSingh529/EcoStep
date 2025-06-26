export const SproutAvatar = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="currentColor" className="text-lime-200 dark:text-lime-900" />
        <path d="M50 80V50M50 50C50 38.9543 58.9543 30 70 30" stroke="currentColor" className="text-lime-600 dark:text-lime-400" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 65C50 59.4772 45.5228 55 40 55C34.4772 55 30 59.4772 30 65" stroke="currentColor" className="text-lime-700 dark:text-lime-500" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);