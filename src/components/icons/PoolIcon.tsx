import React from 'react';

export const PoolIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M18 10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
        <path d="M10 21.9c0-2.5 1.8-4.5 4.1-4.9" />
        <path d="M10 4.1c0 2.5-1.8 4.5-4.1 4.9" />
        <path d="m2 10 2.5-2.5" />
        <path d="M14 2.5 16.5 5" />
        <path d="m21 14 2.5 2.5" />
        <path d="M3.5 21.5 5 19" />
    </svg>
);
