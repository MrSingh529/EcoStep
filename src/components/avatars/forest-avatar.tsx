export const ForestAvatar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#A7F3D0" />
    <path d="M50 85V65M50 65L35 80M50 65L65 80" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M45 45C45 36.7157 51.7157 30 60 30C68.2843 30 75 36.7157 75 45V55H45V45Z" fill="#10B981"/>
    <path d="M55 45C55 36.7157 48.2843 30 40 30C31.7157 30 25 36.7157 25 45V55H55V45Z" fill="#059669"/>
  </svg>
);
