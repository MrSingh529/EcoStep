export const RiverAvatar = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#BAE6FD" />
        <path d="M25 20C40 40 30 60 50 80" stroke="#0EA5E9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 20C65 40 55 60 75 80" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
