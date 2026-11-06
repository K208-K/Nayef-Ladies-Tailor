import React from 'react';

interface WhatsAppIconProps {
  className?: string;
}

export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 11.6a8 8 0 0 1-11.8 7l-4.2 1.2 1.3-4A8 8 0 1 1 20 11.6Z" />
    <path d="M8.8 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4 0 .6l-.5.6c.6 1.1 1.5 2 2.7 2.6l.6-.5c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5v.5c0 .3-.1.5-.4.7-.5.3-1.1.4-1.6.2-2.9-.9-5.2-3.1-6.3-5.8-.2-.6-.1-1.2.2-1.8Z" />
  </svg>
);
