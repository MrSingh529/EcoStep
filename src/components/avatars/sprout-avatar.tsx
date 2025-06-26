export const SproutAvatar = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#D9F99D" />
        <path d="M50 80V50M50 50C50 38.9543 58.9543 30 70 30" stroke="#65A30D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 65C50 59.4772 45.5228 55 40 55C34.4772 55 30 59.4772 30 65" stroke="#4D7C0F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
